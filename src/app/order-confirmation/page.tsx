"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle, PackageSearch, Loader2, Info } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';


export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart(); // Get clearCart from CartContext

  const [status, setStatus] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Processing your order confirmation...");
  const [title, setTitle] = useState("Order Status");
  const [icon, setIcon] = useState(<Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const transId = searchParams.get('tran_id');

    setStatus(paymentStatus);
    setTransactionId(transId);
    setIsLoading(false);

    if (paymentStatus === 'success') {
      setTitle("Payment Successful!");
      setMessage("Thank you for your purchase. Your order has been confirmed.");
      setIcon(<CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />);
      // Clear the cart only on successful payment confirmation
      // This should ideally be done after IPN verification on the backend,
      // but for frontend simulation, we can do it here.
      clearCart(); 
    } else if (paymentStatus === 'fail') {
      setTitle("Payment Failed");
      setMessage("Unfortunately, your payment could not be processed. Please try again or contact support.");
      setIcon(<XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />);
    } else if (paymentStatus === 'cancel') {
      setTitle("Order Cancelled");
      setMessage("Your order has been cancelled. You can try placing the order again or continue shopping.");
      setIcon(<AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />);
    } else {
      setTitle("Order Status Unknown");
      setMessage("We are currently processing your order information. If you completed a payment, please wait for an email confirmation or check your order history.");
      setIcon(<Info className="mx-auto h-16 w-16 text-blue-500 mb-4" />);
    }
  }, [searchParams, clearCart]);


  return (
    <div className="container mx-auto py-12 flex justify-center items-start min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-lg text-center shadow-xl rounded-lg">
        <CardHeader className="pt-8">
          {icon}
          <CardTitle className="text-3xl font-headline text-primary">{title}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              {transactionId && (
                <p className="text-sm text-muted-foreground">
                  Transaction ID: <span className="font-mono bg-secondary px-2 py-1 rounded">{transactionId}</span>
                </p>
              )}
              {status === 'fail' && (
                <Button asChild size="lg" className="mt-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  <Link href="/checkout">Try Payment Again</Link>
                </Button>
              )}
               {(status === 'success' || status === 'cancel' || !status ) && (
                 <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                   <Link href="/">Continue Shopping</Link>
                 </Button>
               )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}