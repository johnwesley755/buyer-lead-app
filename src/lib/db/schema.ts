import { 
  pgTable, 
  serial, 
  varchar, 
  timestamp, 
  text, 
  integer,
  boolean,
  json,
  uuid,
  pgEnum
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Enums
export const buyerStatusEnum = pgEnum('buyer_status', [
  'new',
  'contacted',
  'qualified',
  'negotiating',
  'closed',
  'lost'
]);

export const buyerPriorityEnum = pgEnum('buyer_priority', [
  'low',
  'medium',
  'high'
]);

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 128 }).primaryKey().notNull().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Buyers table
export const buyers = pgTable('buyers', {
  id: varchar('id', { length: 128 }).primaryKey().notNull().$defaultFn(() => createId()),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  status: buyerStatusEnum('status').default('new').notNull(),
  priority: buyerPriorityEnum('priority').default('medium').notNull(),
  budget: integer('budget'),
  location: varchar('location', { length: 255 }),
  notes: text('notes'),
  tags: json('tags').$type<string[]>().default([]),
  assignedTo: varchar('assigned_to', { length: 128 }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Buyer history table
export const buyerHistory = pgTable('buyer_history', {
  id: varchar('id', { length: 128 }).primaryKey().notNull().$defaultFn(() => createId()),
  buyerId: varchar('buyer_id', { length: 128 }).notNull().references(() => buyers.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 128 }).references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  details: json('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Magic link tokens table
export const verificationTokens = pgTable('verification_tokens', {
  id: varchar('id', { length: 128 }).primaryKey().notNull().$defaultFn(() => createId()),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});