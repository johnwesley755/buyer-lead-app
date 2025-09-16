import { Resend } from 'resend';
import { generateToken, TOKEN_EXPIRY } from './config';
import { createVerificationToken, getUserByEmail, createUser } from '../db/queries';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLink(email: string) {
  // Generate a token
  const token = generateToken();
  const expires = new Date(Date.now() + TOKEN_EXPIRY);
  
  // Save token to database
  await createVerificationToken(email, token, expires);
  
  // Check if user exists, create if not
  const user = await getUserByEmail(email);
  if (!user) {
    await createUser({ email });
  }
  
  // Get base URL from environment or use default
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // Create verification URL with absolute path
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;
  
  try {
    // Send email with magic link
    const result = await resend.emails.send({
      from: 'Buyer Lead App <onboarding@resend.dev>', // Use verified sender
      to: email,
      subject: 'Your login link for Buyer Lead App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Login to Buyer Lead App</h1>
          <p>Click the link below to log in to your account:</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Log in to Buyer Lead App</a>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this email, you can safely ignore it.</p>
        </div>
      `,
    });
    
    console.log('Email sent successfully:', result);
    return { success: true };
  } catch (error) {
    console.error('Failed to send magic link:', error);
    return { success: false, error: 'Failed to send magic link. Please check your email configuration.' };
  }
}