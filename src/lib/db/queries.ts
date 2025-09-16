import { db } from './index';
import { buyers, buyerHistory, users, verificationTokens } from './schema';
import { eq, and, like, gte, lte, desc, asc, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// User queries
export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
}

export async function createUser(data: { email: string; name?: string }) {
  const result = await db.insert(users).values({
    id: createId(),
    email: data.email,
    name: data.name,
  }).returning();
  return result[0];
}

// Buyer queries
export async function getBuyers(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;
  
  const offset = (page - 1) * limit;
  
  let query = db.select().from(buyers);
  
  // Apply filters
  if (status) {
    query = query.where(eq(buyers.status, status as any));
  }
  
  if (search) {
    query = query.where(
      sql`(${buyers.firstName} || ' ' || ${buyers.lastName} || ' ' || ${buyers.email}) ILIKE ${'%' + search + '%'}`
    );
  }
  
  // Apply sorting
  if (sortBy === 'createdAt') {
    query = query.orderBy(sortOrder === 'asc' ? asc(buyers.createdAt) : desc(buyers.createdAt));
  } else if (sortBy === 'updatedAt') {
    query = query.orderBy(sortOrder === 'asc' ? asc(buyers.updatedAt) : desc(buyers.updatedAt));
  } else if (sortBy === 'name') {
    query = query.orderBy(
      sortOrder === 'asc' ? asc(buyers.firstName) : desc(buyers.firstName),
      sortOrder === 'asc' ? asc(buyers.lastName) : desc(buyers.lastName)
    );
  }
  
  // Apply pagination
  query = query.limit(limit).offset(offset);
  
  return query;
}

export async function getBuyerById(id: string) {
  const result = await db.select().from(buyers).where(eq(buyers.id, id));
  return result[0] || null;
}

export async function createBuyer(data: any) {
  const result = await db.insert(buyers).values({
    id: createId(),
    ...data,
  }).returning();
  
  // Add history record
  await db.insert(buyerHistory).values({
    id: createId(),
    buyerId: result[0].id,
    userId: data.userId,
    action: 'created',
    details: data,
  });
  
  return result[0];
}

export async function updateBuyer(id: string, data: any) {
  const result = await db.update(buyers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(buyers.id, id))
    .returning();
  
  // Add history record
  await db.insert(buyerHistory).values({
    id: createId(),
    buyerId: id,
    userId: data.userId,
    action: 'updated',
    details: data,
  });
  
  return result[0];
}

export async function deleteBuyer(id: string, userId: string) {
  // Add history record before deletion
  await db.insert(buyerHistory).values({
    id: createId(),
    buyerId: id,
    userId: userId,
    action: 'deleted',
    details: {},
  });
  
  const result = await db.delete(buyers).where(eq(buyers.id, id)).returning();
  return result[0];
}

// Buyer history queries
export async function getBuyerHistory(buyerId: string) {
  return db.select({
    id: buyerHistory.id,
    action: buyerHistory.action,
    details: buyerHistory.details,
    createdAt: buyerHistory.createdAt,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
    }
  })
  .from(buyerHistory)
  .leftJoin(users, eq(buyerHistory.userId, users.id))
  .where(eq(buyerHistory.buyerId, buyerId))
  .orderBy(desc(buyerHistory.createdAt));
}

// Verification token queries
export async function createVerificationToken(email: string, token: string, expires: Date) {
  const result = await db.insert(verificationTokens).values({
    id: createId(),
    email,
    token,
    expires,
  }).returning();
  return result[0];
}

export async function getVerificationToken(token: string) {
  const result = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
  return result[0] || null;
}

export async function deleteVerificationToken(token: string) {
  return db.delete(verificationTokens).where(eq(verificationTokens.token, token));
}

// Dashboard queries
export async function getDashboardStats() {
  // Get total buyers count
  const totalBuyersResult = await db.select({ count: sql`count(*)` }).from(buyers);
  const totalBuyers = Number(totalBuyersResult[0].count);
  
  // Get active leads count (new, contacted, qualified, negotiating)
  const activeLeadsResult = await db.select({ count: sql`count(*)` }).from(buyers)
    .where(sql`${buyers.status} IN ('new', 'contacted', 'qualified', 'negotiating')`);
  const activeLeads = Number(activeLeadsResult[0].count);
  
  // Get conversion rate (closed buyers / total buyers)
  const closedBuyersResult = await db.select({ count: sql`count(*)` }).from(buyers)
    .where(eq(buyers.status, 'closed'));
  const closedBuyers = Number(closedBuyersResult[0].count);
  const conversionRate = totalBuyers > 0 ? Math.round((closedBuyers / totalBuyers) * 100) : 0;
  
  // Get month-over-month growth
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  
  const currentMonthBuyersResult = await db.select({ count: sql`count(*)` }).from(buyers)
    .where(gte(buyers.createdAt, lastMonthDate));
  const currentMonthBuyers = Number(currentMonthBuyersResult[0].count);
  
  const twoMonthsAgoDate = new Date();
  twoMonthsAgoDate.setMonth(twoMonthsAgoDate.getMonth() - 2);
  
  const previousMonthBuyersResult = await db.select({ count: sql`count(*)` }).from(buyers)
    .where(and(
      gte(buyers.createdAt, twoMonthsAgoDate),
      lte(buyers.createdAt, lastMonthDate)
    ));
  const previousMonthBuyers = Number(previousMonthBuyersResult[0].count);
  
  const growthRate = previousMonthBuyers > 0 
    ? Math.round(((currentMonthBuyers - previousMonthBuyers) / previousMonthBuyers) * 100) 
    : 0;
  
  return {
    totalBuyers,
    activeLeads,
    conversionRate,
    growthRate
  };
}

export async function getRecentActivity(limit = 5) {
  return db.select({
    id: buyerHistory.id,
    action: buyerHistory.action,
    details: buyerHistory.details,
    createdAt: buyerHistory.createdAt,
    buyerId: buyerHistory.buyerId,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
    },
    buyer: {
      firstName: buyers.firstName,
      lastName: buyers.lastName,
    }
  })
  .from(buyerHistory)
  .leftJoin(users, eq(buyerHistory.userId, users.id))
  .leftJoin(buyers, eq(buyerHistory.buyerId, buyers.id))
  .orderBy(desc(buyerHistory.createdAt))
  .limit(limit);
}