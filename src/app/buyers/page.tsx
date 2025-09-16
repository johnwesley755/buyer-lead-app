import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BuyerTable } from '@/components/buyers/buyer-table';
import { ImportDialog } from '@/components/buyers/import-dialog';
import { ExportButton } from '@/components/buyers/export-button';
import { use } from 'react';

interface BuyersPageProps {
  searchParams: Promise<{
    view?: string;
    status?: string;
  }>;
}

export default function BuyersPage({ searchParams }: BuyersPageProps) {
  // Use React.use to unwrap the Promise
  const params = use(searchParams);
  const { view, status } = params;
  const showImport = view === 'import';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buyers</h1>
        <div className="flex items-center gap-4">
          <ExportButton status={status} />
          <Button variant="outline" asChild>
            <Link href="/buyers?view=import">Import</Link>
          </Button>
          <Button asChild>
            <Link href="/buyers/new">Add New Buyer</Link>
          </Button>
        </div>
      </div>
      
      {showImport ? (
        <div className="rounded-lg border p-6">
          <ImportDialog />
        </div>
      ) : (
        <BuyerTable />
      )}
    </div>
  );
}