import { z } from 'zod';

export const buyerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'negotiating', 'closed', 'lost']).default('new'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  budget: z.number().optional().nullable(),
  location: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  assignedTo: z.string().optional().nullable(),
});

export type BuyerFormValues = z.infer<typeof buyerSchema>;