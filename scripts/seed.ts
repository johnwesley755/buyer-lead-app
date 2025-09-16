import { db } from '../src/lib/db';
import { users, buyers, buyerHistory } from '../src/lib/db/schema';
import { createId } from '@paralleldrive/cuid2';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const user = await db.insert(users).values({
    id: createId(),
    email: 'test@example.com',
    name: 'Test User',
  }).returning();

  console.log('👤 Created test user:', user[0].email);

  // Create some sample buyers
  const sampleBuyers = [
    {
      id: createId(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      status: 'new',
      priority: 'medium',
      budget: 500000,
      location: 'New York, NY',
      notes: 'Looking for a 3-bedroom house',
      tags: ['first-time', 'pre-approved'],
      assignedTo: user[0].id,
    },
    {
      id: createId(),
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      status: 'contacted',
      priority: 'high',
      budget: 750000,
      location: 'San Francisco, CA',
      notes: 'Interested in waterfront properties',
      tags: ['investor', 'cash-buyer'],
      assignedTo: user[0].id,
    },
    {
      id: createId(),
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phone: '555-456-7890',
      status: 'qualified',
      priority: 'medium',
      budget: 350000,
      location: 'Chicago, IL',
      notes: 'Looking for a condo downtown',
      tags: ['downsizing'],
      assignedTo: user[0].id,
    },
  ];

  for (const buyer of sampleBuyers) {
    await db.insert(buyers).values(buyer);
    
    // Add history record
    await db.insert(buyerHistory).values({
      id: createId(),
      buyerId: buyer.id,
      userId: user[0].id,
      action: 'created',
      details: buyer,
    });
  }

  console.log('👥 Created sample buyers');
  console.log('✅ Seed completed successfully');
}

seed()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });