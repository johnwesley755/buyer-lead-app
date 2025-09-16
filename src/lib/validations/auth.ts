import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});