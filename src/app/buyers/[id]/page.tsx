import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BuyerForm } from '@/components/buyers/buyer-form';
import { getBuyerById } from '@/lib/db/queries';

interface BuyerPageProps {
  params: {
    id: string;
  };
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  const buyer = await getBuyerById(params.id);
  
  if (!buyer) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {buyer.firstName} {buyer.lastName}
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/buyers">Back to List</Link>
          </Button>
          <form action={`/api/buyers/${buyer.id}`} method="DELETE">
            <Button variant="destructive" type="submit">
              Delete Buyer
            </Button>
          </form>
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <BuyerForm initialData={buyer} buyerId={buyer.id} />
      </div>
    </div>
  );
}