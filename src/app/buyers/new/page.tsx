import { BuyerForm } from '@/components/buyers/buyer-form';

export default function NewBuyerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Buyer</h1>
      <div className="rounded-lg border p-6">
        <BuyerForm />
      </div>
    </div>
  );
}