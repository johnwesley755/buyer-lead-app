import { buyerSchema } from '@/lib/validations/buyer';

describe('Buyer Validation Schema', () => {
  it('should validate a valid buyer object', () => {
    const validBuyer = {
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
    };
    
    const result = buyerSchema.safeParse(validBuyer);
    expect(result.success).toBe(true);
  });

  it('should reject a buyer with missing required fields', () => {
    const invalidBuyer = {
      firstName: 'John',
      // Missing lastName
      email: 'john.doe@example.com',
      // Missing phone
      status: 'new',
      priority: 'medium',
    };
    
    const result = buyerSchema.safeParse(invalidBuyer);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.lastName).toBeDefined();
      expect(errors.phone).toBeDefined();
    }
  });

  it('should reject a buyer with invalid email format', () => {
    const invalidBuyer = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
      phone: '555-123-4567',
      status: 'new',
      priority: 'medium',
    };
    
    const result = buyerSchema.safeParse(invalidBuyer);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
    }
  });

  it('should reject a buyer with invalid status value', () => {
    const invalidBuyer = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      status: 'invalid-status', // Invalid status
      priority: 'medium',
    };
    
    const result = buyerSchema.safeParse(invalidBuyer);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.status).toBeDefined();
    }
  });

  it('should reject a buyer with invalid priority value', () => {
    const invalidBuyer = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      status: 'new',
      priority: 'invalid-priority', // Invalid priority
    };
    
    const result = buyerSchema.safeParse(invalidBuyer);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.priority).toBeDefined();
    }
  });
});