import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders placed in the Haute Parfumerie
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  items: text('items').notNull(),
  totalAmount: integer('total_amount').notNull(),
  currency: text('currency').default('USD'),
  shippingAddress: text('shipping_address'),
  engravingText: text('engraving_text'),
  status: text('status').default('confirmed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bespoke perfume formulations & Discovery Coffrets created by clients
export const bespokeBlends = pgTable('bespoke_blends', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  blendName: text('blend_name').notNull(),
  topNotes: text('top_notes').notNull(),
  heartNotes: text('heart_notes').notNull(),
  baseNotes: text('base_notes').notNull(),
  flaconColor: text('flacon_color').notNull(),
  concentration: text('concentration').default('Extrait de Parfum'),
  macerationDays: integer('maceration_days').default(90),
  createdAt: timestamp('created_at').defaultNow(),
});

// User wishlist & saved favorites
export const userFavorites = pgTable('user_favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  fragranceId: text('fragrance_id').notNull(),
  fragranceName: text('fragrance_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Verified flacon reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  fragranceId: text('fragrance_id').notNull(),
  authorName: text('author_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  verified: integer('verified').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  bespokeBlends: many(bespokeBlends),
  favorites: many(userFavorites),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const bespokeBlendsRelations = relations(bespokeBlends, ({ one }) => ({
  user: one(users, {
    fields: [bespokeBlends.userId],
    references: [users.id],
  }),
}));

export const userFavoritesRelations = relations(userFavorites, ({ one }) => ({
  user: one(users, {
    fields: [userFavorites.userId],
    references: [users.id],
  }),
}));
