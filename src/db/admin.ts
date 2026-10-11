import { db } from './index.ts';
import { siteSettings, perfumesCustom, orders, reviews } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { Perfume } from '../types/perfume.ts';

export interface SiteSettingsData {
  brandName: string;
  brandTagline: string;
  logoText: string;
  logoUrl: string;
  brandCities: string;
  announcementBar: string;
  heroHeadline: string;
  heroSubheadline: string;
  currency: string;
  contactEmail: string;
  adminPin: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  brandName: 'AURELIA',
  brandTagline: 'Maison de Haute Parfumerie fondée à Grasse. Distilling rare botanicals and aged resins into sovereign extrait compositions.',
  logoText: 'AURELIA',
  logoUrl: '',
  brandCities: 'Paris · Grasse · London · Tokyo · Dubai',
  announcementBar: 'COMPLIMENTARY WORLDWIDE COURIER & BESPOKE FLACON ENGRAVING ON ALL MASTER FLACONS',
  heroHeadline: 'HAUTE PARFUMERIE',
  heroSubheadline: 'Bespoke Olfactory Masterpieces Aged in French Limousin Oak',
  currency: 'USD',
  contactEmail: 'concierge@maison-aurelia.com',
  adminPin: 'admin123',
};

// Retrieve all site settings merged with defaults
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const rows = await db.select().from(siteSettings);
    const result = { ...DEFAULT_SITE_SETTINGS };
    for (const row of rows) {
      if (row.key in result) {
        (result as any)[row.key] = row.value;
      }
    }
    return result;
  } catch (error) {
    console.error('Failed to load site settings from database, returning defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

// Save or update multiple site settings
export async function updateSiteSettings(settings: Partial<SiteSettingsData>): Promise<SiteSettingsData> {
  try {
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
        if (existing.length > 0) {
          await db.update(siteSettings)
            .set({ value: String(value), updatedAt: new Date() })
            .where(eq(siteSettings.key, key));
        } else {
          await db.insert(siteSettings).values({
            key,
            value: String(value),
          });
        }
      }
    }
    return await getSiteSettings();
  } catch (error) {
    console.error('Failed to update site settings in database:', error);
    throw error;
  }
}

// Retrieve custom perfumes from database
export async function getAllCustomPerfumes(): Promise<Perfume[]> {
  try {
    const rows = await db.select().from(perfumesCustom).orderBy(perfumesCustom.sortOrder);
    if (!rows || rows.length === 0) {
      return [];
    }
    const perfumes: Perfume[] = [];
    for (const row of rows) {
      try {
        const parsed = JSON.parse(row.data) as Perfume;
        perfumes.push(parsed);
      } catch (err) {
        console.warn(`Failed to parse perfume data for id ${row.id}:`, err);
      }
    }
    return perfumes;
  } catch (error) {
    console.error('Failed to load perfumes from database:', error);
    return [];
  }
}

// Save or update a custom perfume
export async function upsertCustomPerfume(perfume: Perfume): Promise<Perfume> {
  try {
    const dataString = JSON.stringify(perfume);
    const existing = await db.select().from(perfumesCustom).where(eq(perfumesCustom.id, perfume.id)).limit(1);
    
    if (existing.length > 0) {
      await db.update(perfumesCustom)
        .set({
          name: perfume.name,
          data: dataString,
          updatedAt: new Date(),
        })
        .where(eq(perfumesCustom.id, perfume.id));
    } else {
      await db.insert(perfumesCustom).values({
        id: perfume.id,
        name: perfume.name,
        data: dataString,
        sortOrder: 0,
      });
    }
    return perfume;
  } catch (error) {
    console.error('Failed to upsert perfume:', error);
    throw error;
  }
}

// Delete a custom perfume
export async function deleteCustomPerfume(id: string): Promise<boolean> {
  try {
    await db.delete(perfumesCustom).where(eq(perfumesCustom.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete perfume:', error);
    throw error;
  }
}

// Reset perfumes to defaults
export async function resetCustomPerfumes(defaultPerfumes: Perfume[]): Promise<Perfume[]> {
  try {
    await db.delete(perfumesCustom);
    for (let i = 0; i < defaultPerfumes.length; i++) {
      const p = defaultPerfumes[i];
      await db.insert(perfumesCustom).values({
        id: p.id,
        name: p.name,
        data: JSON.stringify(p),
        sortOrder: i,
      });
    }
    return defaultPerfumes;
  } catch (error) {
    console.error('Failed to reset perfumes:', error);
    throw error;
  }
}

// Admin: Get all orders across all customers
export async function getAllOrdersAdmin() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    return [];
  }
}

// Admin: Update order status (confirmed, macerating, dispatched, delivered, cancelled)
export async function updateOrderStatusAdmin(orderId: number, status: string) {
  try {
    const updated = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    return updated[0];
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

// Admin: Delete review
export async function deleteReviewAdmin(reviewId: number) {
  try {
    await db.delete(reviews).where(eq(reviews.id, reviewId));
    return true;
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw error;
  }
}
