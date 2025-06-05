"use client";

import Link from 'next/link';
import { ShoppingCart, Search as SearchIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cart', label: 'Cart' },
    // Add more links as needed
  ];

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-primary hover:opacity-80 transition-opacity">
          <Zap className="h-7 w-7" />
          <span>CommerceFlow</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          {navLinks.map(link => (
            <Button key={link.href} variant="ghost" asChild
              className={cn(
                "text-foreground/80 hover:text-primary hover:bg-primary/10",
                pathname === link.href && "text-primary font-semibold bg-primary/10"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative hover:text-primary hover:bg-primary/10">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          {/* Mobile Menu Trigger (optional) */}
        </div>
      </div>
    </header>
  );
}
