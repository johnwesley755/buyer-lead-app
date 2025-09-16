'use client';

import Link from 'next/link';
import { useBuyers } from '@/lib/hooks/use-buyers';
import { BuyerStatusBadge } from '@/components/buyers/buyer-status-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/common/empty-state';

export function BuyerTable() {
  const { buyers, loading, error, filters, setFilter } = useBuyers();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (buyers.length === 0) {
    return (
      <EmptyState
        title="No buyers found"
        description="Get started by creating a new buyer lead."
        actionLabel="Add Buyer"
        actionHref="/buyers/new"
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buyers.map((buyer) => (
            <TableRow key={buyer.id}>
              <TableCell className="font-medium">
                <Link href={`/buyers/${buyer.id}`} className="hover:underline">
                  {buyer.firstName} {buyer.lastName}
                </Link>
              </TableCell>
              <TableCell>{buyer.email}</TableCell>
              <TableCell>
                <BuyerStatusBadge status={buyer.status} />
              </TableCell>
              <TableCell className="capitalize">{buyer.priority}</TableCell>
              <TableCell>{buyer.location || '-'}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/buyers/${buyer.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {buyers.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('page', String(Math.max(1, filters.page - 1)))}
            disabled={filters.page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter('page', String(filters.page + 1))}
            disabled={buyers.length < 10}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}