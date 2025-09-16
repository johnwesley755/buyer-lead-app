import { exportBuyersToCsv, generateCsvTemplate, validateBuyers } from '@/lib/utils/csv';

describe('CSV Utilities', () => {
  describe('generateCsvTemplate', () => {
    it('should generate a CSV template with correct headers', () => {
      const template = generateCsvTemplate();
      
      // Check that the template contains all expected headers
      expect(template).toContain('First Name');
      expect(template).toContain('Last Name');
      expect(template).toContain('Email');
      expect(template).toContain('Phone');
      expect(template).toContain('Status');
      expect(template).toContain('Priority');
      expect(template).toContain('Budget');
      expect(template).toContain('Location');
      expect(template).toContain('Notes');
      expect(template).toContain('Tags');
    });
  });

  describe('exportBuyersToCsv', () => {
    it('should convert buyer objects to CSV format', () => {
      const buyers = [
        {
          id: '1',
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
          userId: 'user1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: '2',
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
          userId: 'user1',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ];
      
      const csv = exportBuyersToCsv(buyers);
      
      // Check that the CSV contains the buyer data
      expect(csv).toContain('John,Doe,john.doe@example.com');
      expect(csv).toContain('Jane,Smith,jane.smith@example.com');
      expect(csv).toContain('first-time, pre-approved');
      expect(csv).toContain('investor, cash-buyer');
    });
  });

  describe('validateBuyers', () => {
    it('should separate valid and invalid buyers', () => {
      const buyers = [
        {
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
        },
        {
          // Missing required fields
          firstName: 'Jane',
          lastName: 'Smith',
          // No email (required)
          phone: '555-987-6543',
        },
      ];
      
      const { validBuyers, invalidBuyers } = validateBuyers(buyers);
      
      expect(validBuyers.length).toBe(1);
      expect(invalidBuyers.length).toBe(1);
      
      expect(validBuyers[0].firstName).toBe('John');
      expect(invalidBuyers[0].data.firstName).toBe('Jane');
    });
  });
});