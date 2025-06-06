
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login | CommerceFlow',
  description: 'Log in to your CommerceFlow account using an email link.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Log In with Email Link</CardTitle>
          <CardDescription>Enter your email to receive a secure login link. No password needed!</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Want to create an account with a password?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
