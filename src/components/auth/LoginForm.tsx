
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

// IMPORTANT: Replace this with your actual backend base URL
const YOUR_ACTUAL_BACKEND_BASE_URL = '[YOUR_ACTUAL_BACKEND_BASE_URL]';

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

    if (YOUR_ACTUAL_BACKEND_BASE_URL === '[YOUR_ACTUAL_BACKEND_BASE_URL]') {
      toast({
        title: "Configuration Incomplete",
        description: "Please replace '[YOUR_ACTUAL_BACKEND_BASE_URL]' in LoginForm.tsx with your actual backend URL.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const loginApiUrl = `${YOUR_ACTUAL_BACKEND_BASE_URL}/auth/login`;

    try {
      const response = await fetch(loginApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json(); // Attempt to parse JSON for both success and error

      if (!response.ok) {
        // Backend returned an error (e.g., 401, 400)
        const errorMessage = responseData.message || responseData.error || `Login failed with status: ${response.status}`;
        console.error('Login API Error Response:', responseData);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        // Successful login
        console.log("Login successful. Tokens received:", responseData);
        // TODO: Securely store tokens (e.g., in HttpOnly cookies via backend, or in context/localStorage)
        // Example:
        // if (responseData.accessToken) localStorage.setItem('accessToken', responseData.accessToken);
        // if (responseData.refreshToken) localStorage.setItem('refreshToken', responseData.refreshToken);
        // if (contextLogin) contextLogin(responseData.accessToken, responseData.refreshToken);
        
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
        });
        router.push('/'); // Redirect to home page or dashboard
      }
    } catch (error: any) {
      // Network error or other issues (e.g., failed to parse JSON if backend sent completely unexpected response)
      console.error('Login submission error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
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
