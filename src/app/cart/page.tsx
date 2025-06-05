import { CartView } from '@/components/cart/CartView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | CommerceFlow',
  description: 'Review items in your shopping cart.',
};

export default function CartPage() {
  return (
    <div className="container mx-auto py-8">
      <CartView />
    </div>
  );
}
