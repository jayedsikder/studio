"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';

// Simplified schema for customer info, SSLCommerz handles payment details
const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  postalCode: z.string().min(4, { message: "Postal code must be at least 4 characters." }),
  // TODO: Add phone number field as it's typically required by SSLCommerz
  // phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      // phone: '',
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (customerData) => {
    setIsLoading(true);

    const orderData = {
      items: items.map(item => ({ // SSLCommerz might need specific item format
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      customerInfo: { // Match structure expected by your API endpoint
        fullName: customerData.fullName,
        email: customerData.email,
        address: customerData.address,
        city: customerData.city,
        postalCode: customerData.postalCode,
        // phone: customerData.phone, // Add if phone field is implemented
      },
    };

    try {
      const response = await fetch('/api/sslcommerz/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to initiate payment session.');
      }

      if (responseData.GatewayPageURL) {
        // Clear cart before redirecting, or handle this based on IPN later
        // clearCart(); 
        toast({
          title: "Redirecting to Payment Gateway...",
          description: "You will be redirected to SSLCommerz to complete your payment.",
        });
        window.location.href = responseData.GatewayPageURL; // Redirect to SSLCommerz
      } else {
        throw new Error('Could not retrieve payment gateway URL.');
      }

    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast({
        title: "Checkout Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // setIsLoading(false) should not be reached if redirect happens
  };

  if (items.length === 0 && !isLoading) { // Prevent showing this if redirecting
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty.</h2>
        <p className="text-muted-foreground mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Button asChild>
          <Link href="/">Return to Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Checkout Details</CardTitle>
            <CardDescription>Please fill in your shipping information. You'll be redirected to SSLCommerz for payment.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <fieldset className="space-y-4 p-4 border rounded-md">
                  <legend className="text-lg font-semibold px-1">Shipping Information</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                   {/* TODO: Add Phone Number Field Here - SSLCommerz often requires it 
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="01xxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  */}
                </fieldset>
                
                <div className="flex items-center text-sm text-muted-foreground p-3 bg-secondary rounded-md border">
                    <ShieldCheck className="h-6 w-6 mr-3 text-primary flex-shrink-0"/>
                    <span>You will be redirected to the SSLCommerz secure payment page to enter your payment details. We do not store your card information.</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? 'Processing...' : `Proceed to Secure Payment ($${totalPrice.toFixed(2)})`}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="sticky top-24 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.name} (x{item.quantity})</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr className="my-3"/>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}