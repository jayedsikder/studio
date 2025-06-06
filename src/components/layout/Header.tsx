
"use client";

import Link from 'next/link';
import { ShoppingCart, Zap, LogIn, UserPlus, LogOut, UserCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function Header() {
  const { totalItems } = useCart();
  const { user, loading, logout } = useAuth(); // Use the auth context
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    // { href: '/cart', label: 'Cart' }, // Cart icon already present
    // Add more links as needed
  ];

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

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
        <div className="flex items-center space-x-3">
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

          {loading ? (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    {/* Placeholder for user avatar image, if available */}
                    {/* <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} /> */}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.displayName || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* 
                // Placeholder for future items
                <DropdownMenuItem asChild>
                  <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem> 
                */}
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
        </div>
      </div>
    </header>
  );
}
