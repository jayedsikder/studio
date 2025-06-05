import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, PackageCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed | CommerceFlow',
  description: 'Your order has been successfully placed.',
};

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto py-12 flex justify-center items-center">
      <Card className="w-full max-w-lg text-center shadow-xl rounded-lg">
        <CardHeader className="pt-8">
          <PackageCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-headline text-primary">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Thank you for your purchase. (This was a fun simulation!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your digital services will be "delivered" shortly. You would typically receive an email with access details or download links.</p>
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono">SIM-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </p>
          <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
