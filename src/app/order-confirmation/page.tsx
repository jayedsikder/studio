
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, PackageCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { useState, useEffect } from 'react';

// export const metadata: Metadata = { // Metadata should be defined statically or in generateMetadata
//   title: 'Order Confirmed | CommerceFlow',
//   description: 'Your order has been successfully placed.',
// };
// For client components, Metadata should be handled differently or this component shouldn't try to export it.
// Let's remove it for now as it's a client component. If title/desc is needed, it can be set via a useEffect or a parent server component.


export default function OrderConfirmationPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Generate order ID only on the client side
    setOrderId(`SIM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  }, []);

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
          {orderId && (
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          {!orderId && (
            <p className="text-sm text-muted-foreground">
              Generating Order ID...
            </p>
          )}
          <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// If metadata is still desired for this page, it should be in a parent route or using generateMetadata if this were a server component.
// For a client component, dynamic title changes can be done via useEffect:
// useEffect(() => { document.title = 'Order Confirmed | CommerceFlow'; }, []);
// However, Next.js prefers metadata to be exported from Server Components or page.tsx/layout.tsx files.
// Since this page is fully client-rendered due to Math.random, static metadata export is not appropriate here.
// We can add a generateMetadata function if we make this a mixed component structure.
// For now, let's assume the layout metadata is sufficient or this page's title is less critical.

export const metadata: Metadata = {
  title: 'Order Confirmed | CommerceFlow',
  description: 'Your order has been successfully placed.',
};
