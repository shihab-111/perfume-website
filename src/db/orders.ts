import { db } from './index.ts';
import { orders } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface CreateOrderParams {
  userId?: number;
  customerName: string;
  customerEmail: string;
  items: string;
  totalAmount: number;
  currency?: string;
  shippingAddress?: string;
  engravingText?: string;
}

export async function createOrder(data: CreateOrderParams) {
  try {
    const result = await db.insert(orders)
      .values({
        userId: data.userId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        items: data.items,
        totalAmount: data.totalAmount,
        currency: data.currency || 'USD',
        shippingAddress: data.shippingAddress || null,
        engravingText: data.engravingText || null,
        status: 'confirmed',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database createOrder failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function getOrdersByUserId(userId: number) {
  try {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error('Database getOrdersByUserId failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getRecentOrders(limitCount = 10) {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limitCount);
  } catch (error) {
    console.error('Database getRecentOrders failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
