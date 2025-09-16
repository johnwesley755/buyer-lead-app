'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function useBuyers() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = parseInt(searchParams.get('page') || '1');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  useEffect(() => {
    async function fetchBuyers() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.set('page', page.toString());
        if (status) queryParams.set('status', status);
        if (search) queryParams.set('search', search);
        if (sortBy) queryParams.set('sortBy', sortBy);
        if (sortOrder) queryParams.set('sortOrder', sortOrder);

        const response = await fetch(`/api/buyers?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch buyers');
        }

        const data = await response.json();
        setBuyers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchBuyers();
  }, [page, status, search, sortBy, sortOrder]);

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset to page 1 when filters change
    if (key !== 'page') {
      params.set('page', '1');
    }
    
    router.push(`/buyers?${params.toString()}`);
  }

  return {
    buyers,
    loading,
    error,
    filters: {
      page,
      status,
      search,
      sortBy,
      sortOrder,
    },
    setFilter,
  };
}