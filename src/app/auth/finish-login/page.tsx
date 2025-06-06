
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FinishLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your login link...");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const emailLink = window.location.href;

    if (isSignInWithEmailLink(auth, emailLink)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // If email is not in localStorage, prompt user for it.
        // This can happen if the user opens the link on a different browser/device.
        // For simplicity, we'll show an error. A more robust solution would be a form here.
        email = window.prompt('Please provide your email for confirmation:');
        if (!email) {
            setMessage("Email address is required to complete sign-in.");
            setError("Could not complete sign-in: Email not provided.");
            setIsLoading(false);
            toast({ title: "Login Failed", description: "Email address was not provided for verification.", variant: "destructive" });
            router.push('/auth/login');
            return;
        }
      }

      signInWithEmailLink(auth, email, emailLink)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          toast({
            title: "Login Successful!",
            description: `Welcome back, ${result.user.email}!`,
          });
          setMessage("Successfully logged in! Redirecting...");
          setIsLoading(false);
          router.push('/');
        })
        .catch((err) => {
          console.error("Firebase Sign In With Link Error:", err);
          window.localStorage.removeItem('emailForSignIn'); // Clear even on error
          let friendlyMessage = "Failed to sign in with email link.";
          switch (err.code) {
            case 'auth/expired-action-code':
              friendlyMessage = "Login link has expired. Please request a new one.";
              break;
            case 'auth/invalid-action-code':
              friendlyMessage = "Login link is invalid. It may have already been used or malformed.";
              break;
            case 'auth/user-disabled':
              friendlyMessage = "Your account has been disabled.";
              break;
            case 'auth/invalid-email':
                friendlyMessage = "The email address provided for verification is invalid.";
                break;
            default:
              friendlyMessage = err.message || "An unexpected error occurred.";
          }
          toast({
            title: "Login Failed",
            description: friendlyMessage,
            variant: "destructive",
          });
          setMessage(friendlyMessage);
          setError("Could not complete sign-in.");
          setIsLoading(false);
          // Optionally redirect to login page after a delay or give option to retry
          // router.push('/auth/login');
        });
    } else {
      setMessage("Invalid login link. Please try logging in again.");
      setError("This is not a valid sign-in link.");
      setIsLoading(false);
      toast({ title: "Invalid Link", description: "The link you used is not valid for signing in.", variant: "destructive" });
      router.push('/auth/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Completing Sign-In</CardTitle>
          <CardDescription>
            {isLoading ? "Please wait while we verify your login link..." : message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary my-4" />}
          {error && !isLoading && (
            <p className="text-destructive my-4">{message}</p>
          )}
          {!isLoading && (
             <Button asChild variant="link" className="mt-4">
                <Link href="/auth/login">Back to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
