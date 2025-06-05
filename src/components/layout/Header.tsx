
"use client";

import Link from 'next/link';
import { ShoppingCart, Search as SearchIcon, Zap, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  // For now, assume no user is logged in.
  // Later, you'd have some auth state here to conditionally show Login/SignUp or Profile/Logout.
  const isLoggedIn = false; 

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
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map(link => (
            <Button key={link.href} variant="ghost" asChild
              className={cn(
                "text-foreground/80 hover:text-primary hover:bg-primary/10 px-3 py-2",
                pathname === link.href && "text-primary font-semibold bg-primary/10"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
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

          {!isLoggedIn && (
            <>
              <Button variant="ghost" asChild size="sm" className="hover:text-primary hover:bg-primary/10">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="default" asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signup">
                 <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
          {/* TODO: Add Profile/Logout button if isLoggedIn */}
          
          {/* Mobile Menu Trigger (optional) */}
        </div>
      </div>
    </header>
  );
}
