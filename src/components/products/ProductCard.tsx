"use client";

import type { Product } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductImage } from './ProductImage';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, PlusCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setIsInCart(getItemQuantity(product.id) > 0);
  }, [getItemQuantity, product.id]);
  

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    addItem(product);
    setIsInCart(true);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Link href="/cart">
          <Button variant="outline" size="sm">View Cart</Button>
        </Link>
      )
    });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <ProductImage src={product.imageUrl} alt={product.name} aiHint={product.aiHint} />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
          <p className="text-base font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          {isInCart ? (
            <Button variant="outline" className="w-full" disabled>
              <CheckCircle className="mr-2 h-4 w-4" />
              Added to Cart
            </Button>
          ) : (
            <Button 
              variant="default" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
}
