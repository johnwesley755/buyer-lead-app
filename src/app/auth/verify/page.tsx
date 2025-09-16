'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!token) {
      setError('Invalid token');
      setIsLoading(false);
      return;
    }
    
    async function verifyToken() {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify token');
        }
        
        // Redirect to dashboard or buyers page
        router.push(data.redirect || '/buyers');
      } catch (error) {
        console.error('Verification error:', error);
        setError(error instanceof Error ? error.message : 'Failed to verify token');
        setIsLoading(false);
      }
    }
    
    verifyToken();
  }, [token, router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Buyer Lead App</h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">
            Verifying your login
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Verifying your login, please wait...</p>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Verification failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Try again
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}