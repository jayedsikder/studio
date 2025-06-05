
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

// For Firebase (Scenario B), you'd import:
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { app } from "@/lib/firebase"; // Assuming firebase is initialized in lib/firebase.ts
// Potentially a context for managing auth state:
// import { useAuth } from '@/contexts/AuthContext'; // You would create this

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }), // Basic check, backend handles strength
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // For Scenario A, to manage tokens, you might use a context:
  // const { login: contextLogin } = useAuth(); // Example

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);

    // --- Scenario A: Custom API Backend ---
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/mock/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid email or password.');
      }

      const responseData = await response.json(); // e.g., { accessToken: "...", refreshToken: "..." }
      
      // Handle token storage (e.g., in localStorage, context, or HttpOnly cookie via backend)
      // Example: localStorage.setItem('accessToken', responseData.accessToken);
      // if (responseData.refreshToken) localStorage.setItem('refreshToken', responseData.refreshToken);
      // if (contextLogin) contextLogin(responseData.accessToken, responseData.refreshToken);

      console.log("Received tokens (Scenario A):", responseData); // For demonstration
      
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      router.push('/'); // Redirect to home page or dashboard
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    // --- Scenario B: Firebase Authentication (Example) ---
    // const auth = getAuth(app);
    // try {
    //   const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    //   // Firebase handles session management internally.
    //   // onAuthStateChanged in a global listener (e.g., AuthContext) would pick up the user.
    //   toast({
    //     title: "Login Successful!",
    //     description: `Welcome back, ${userCredential.user.email}!`,
    //   });
    //   router.push('/');
    // } catch (error: any) {
    //   let errorMessage = "Invalid email or password.";
    //   if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
    //     errorMessage = "Invalid email or password.";
    //   }
    //   toast({
    //     title: "Login Failed",
    //     description: errorMessage,
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
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
