
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login | CommerceFlow',
  description: 'Log in to your CommerceFlow account.', // Updated description
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Log In</CardTitle> {/* Updated title */}
          <CardDescription>Enter your email and password to access your account.</CardDescription> {/* Updated description */}
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '} {/* Changed from "Want to create an account with a password?" */}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
