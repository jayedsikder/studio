import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | CommerceFlow',
  description: 'Complete your purchase securely.',
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-8">
      <CheckoutForm />
    </div>
  );
}
