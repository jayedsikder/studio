
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import type { ReactNode } from 'react';

// Component to conditionally render Header and Footer
function AppStructure({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    // For auth pages, render children in a way that allows them to control their own full-page layout
    return <main className="flex-grow">{children}</main>;
  }

  // For non-auth pages, render with Header, main content area, and Footer
  return (
    <>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}

export function AppClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <AppStructure>{children}</AppStructure>
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}
