
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

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase"; 
// Potentially a context for managing auth state:
// import { useAuth } from '@/contexts/AuthContext'; // You would create this

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }), 
});

type LoginFormValues = z.infer<typeof loginSchema>;


export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const { login: contextLogin } = useAuth(); // Example if using AuthContext

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      // Firebase handles session management internally.
      // An onAuthStateChanged listener (e.g., in an AuthContext) would typically pick up the user.
      // if (contextLogin) contextLogin(userCredential.user); // Update context if using one
      
      toast({
        title: "Login Successful!",
        description: `Welcome back!`, // userCredential.user.email might be null if not set
      });
      router.push('/'); // Redirect to home page or dashboard
    } catch (error: any) {
      let errorMessage = "Invalid email or password.";
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          case "auth/user-disabled":
            errorMessage = "This user account has been disabled.";
            break;
          default:
            errorMessage = error.message || "Failed to log in.";
        }
      }
      console.error("Firebase Login Error:", error);
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
