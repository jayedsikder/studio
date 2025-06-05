"use client";

import type { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductImage } from '@/components/products/ProductImage';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      updateItemQuantity(item.id, 1); // Or removeItem(item.id) if quantity reaches 0
    } else {
      updateItemQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-border last:border-b-0 bg-card rounded-md shadow-sm">
      <Link href={`/products/${item.id}`} className="shrink-0">
        <ProductImage src={item.imageUrl} alt={item.name} aiHint={item.aiHint} className="w-20 h-20 md:w-24 md:h-24 rounded" width={100} height={100}/>
      </Link>
      <div className="flex-grow space-y-1">
        <Link href={`/products/${item.id}`}>
          <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{item.category}</p>
        <p className="text-md font-semibold text-primary">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          className="w-16 h-10 text-center"
          min="1"
          aria-label={`Quantity for ${item.name}`}
        />
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="Increase quantity">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-md font-semibold w-20 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" aria-label={`Remove ${item.name} from cart`}>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
