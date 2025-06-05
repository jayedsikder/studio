"use client";

import { useCart } from '@/contexts/CartContext';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export function CartView() {
  const { items, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-headline font-bold">Your Shopping Cart</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:border-destructive hover:bg-destructive/5">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove all items from your shopping cart. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearCart} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Clear Cart
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <Card className="lg:sticky lg:top-24 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
          {/* Add more summary items like tax if needed */}
          <hr className="my-2 border-border" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
