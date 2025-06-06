
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Client components cannot export metadata directly.
// If a dynamic title is needed, it can be set via useEffect:
// useEffect(() => { document.title = 'Checkout | CommerceFlow'; }, []);

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/checkout'); // Optionally add redirect query for post-login
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // User is not logged in, and redirection should be in progress.
    // Render a loading state or null to prevent flashing content.
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  // User is logged in, render the checkout form
  return (
    <div className="container mx-auto py-8">
      <CheckoutForm />
    </div>
  );
}
