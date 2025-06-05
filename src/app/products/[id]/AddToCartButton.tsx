"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import { ShoppingCart, CheckCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, getItemQuantity } = useCart();
  const [quantityInCart, setQuantityInCart] = useState(0);

  useEffect(() => {
    setQuantityInCart(getItemQuantity(product.id));
  }, [getItemQuantity, product.id]);

  const handleAddToCart = () => {
    addItem(product);
    setQuantityInCart(prev => prev + 1); // Optimistic update
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Link href="/cart">
          <Button variant="outline" size="sm">View Cart</Button>
        </Link>
      ),
    });
  };

  if (quantityInCart > 0) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" size="lg" className="flex-1" disabled>
          <CheckCircle className="mr-2 h-5 w-5" />
          Added to Cart ({quantityInCart})
        </Button>
        <Button variant="default" size="lg" onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Another
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
      aria-label={`Add ${product.name} to cart`}
    >
      <ShoppingCart className="mr-2 h-6 w-6" />
      Add to Cart
    </Button>
  );
}
