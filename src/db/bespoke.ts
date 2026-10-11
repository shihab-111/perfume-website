import { db } from './index.ts';
import { bespokeBlends, userFavorites, reviews } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface CreateBespokeParams {
  userId?: number;
  blendName: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  flaconColor: string;
  concentration?: string;
  macerationDays?: number;
}

export async function createBespokeBlend(data: CreateBespokeParams) {
  try {
    const result = await db.insert(bespokeBlends)
      .values({
        userId: data.userId || null,
        blendName: data.blendName,
        topNotes: data.topNotes,
        heartNotes: data.heartNotes,
        baseNotes: data.baseNotes,
        flaconColor: data.flaconColor,
        concentration: data.concentration || 'Extrait de Parfum',
        macerationDays: data.macerationDays || 90,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database createBespokeBlend failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function getBespokeBlendsByUserId(userId: number) {
  try {
    return await db.select().from(bespokeBlends).where(eq(bespokeBlends.userId, userId)).orderBy(desc(bespokeBlends.createdAt));
  } catch (error) {
    console.error('Database getBespokeBlendsByUserId failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getAllReviews(fragranceId?: string) {
  try {
    if (fragranceId) {
      return await db.select().from(reviews).where(eq(reviews.fragranceId, fragranceId)).orderBy(desc(reviews.createdAt));
    }
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  } catch (error) {
    console.error('Database getAllReviews failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function addReview(fragranceId: string, authorName: string, rating: number, comment: string) {
  try {
    const result = await db.insert(reviews)
      .values({
        fragranceId,
        authorName,
        rating,
        comment,
        verified: 1,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database addReview failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function toggleFavorite(userId: number, fragranceId: string, fragranceName: string) {
  try {
    const existing = await db.select().from(userFavorites)
      .where(eq(userFavorites.userId, userId));
    const match = existing.find(f => f.fragranceId === fragranceId);

    if (match) {
      await db.delete(userFavorites).where(eq(userFavorites.id, match.id));
      return { favorited: false };
    } else {
      await db.insert(userFavorites).values({
        userId,
        fragranceId,
        fragranceName,
      });
      return { favorited: true };
    }
  } catch (error) {
    console.error('Database toggleFavorite failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function getFavoritesByUserId(userId: number) {
  try {
    return await db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
  } catch (error) {
    console.error('Database getFavoritesByUserId failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
