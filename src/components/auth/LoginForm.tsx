
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogInIcon } from 'lucide-react';

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Added signOut
import { app } from "@/lib/firebase";
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user: authContextUser } = useAuth(); // Renamed to avoid conflict

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (authContextUser) {
    router.push('/');
  }

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (!userCredential.user.emailVerified) {
        // If email is not verified, sign the user out again and show a message.
        await signOut(auth); // Sign out the user
        toast({
          title: "Login Failed",
          description: "Your email address has not been verified. Please check your email (and spam folder) for the verification link.",
          variant: "destructive",
          duration: 9000,
        });
        setIsLoading(false);
        return; // Stop further execution
      }

      // Email is verified, proceed with login
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${userCredential.user.email}!`,
      });
      router.push('/'); 
      form.reset();
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      let errorMessage = "Failed to log in. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          case "auth/user-disabled":
            errorMessage = "This user account has been disabled.";
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password.";
            break;
          default:
            errorMessage = error.message || "An unexpected error occurred.";
        }
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogInIcon className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>
      </form>
    </Form>
  );
}
