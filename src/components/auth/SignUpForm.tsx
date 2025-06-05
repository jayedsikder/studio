
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';

// For Firebase (Scenario B), you'd import:
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { app } from "@/lib/firebase"; // Assuming firebase is initialized in lib/firebase.ts

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setIsLoading(true);

    // --- Scenario A: Custom API Backend ---
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/mock/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');

      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          // const responseData = await response.json(); // e.g., { userId: "...", email: "...", message: "..." }
          await response.json(); // Assuming success response structure matches
          toast({
            title: "Registration Successful!",
            description: "You can now log in with your new account.",
          });
          router.push('/auth/login');
        } else {
          const responseText = await response.text();
          console.error(
            `Error: Backend returned non-JSON response. Status: ${response.status}. Content-Type: ${contentType}. Preview: ${responseText.substring(0, 100)}.`
          );
          toast({
            title: "Registration Failed",
            description: "The server returned an unexpected response. Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        let errorMessage = "Failed to register. Please try again.";
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || `Server error: ${response.status}`;
          } catch (jsonError) {
            console.error("Failed to parse JSON error response:", jsonError);
            const responseText = await response.text();
            console.error(
              `Error: Backend returned non-JSON error response. Status: ${response.status}. Content-Type: ${contentType}. Preview: ${responseText.substring(0, 100)}.`
            );
            errorMessage = "The server returned an unexpected error format. Please try again later.";
          }
        } else {
           const responseText = await response.text();
           console.error(
            `Error: Backend returned non-JSON error response. Status: ${response.status}. Content-Type: ${contentType}. Preview: ${responseText.substring(0, 100)}.`
          );
          errorMessage = "The server returned an unexpected response. Please try again later.";
        }
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Handle network errors or other exceptions during fetch
      console.error("Network or other error during registration:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected network error occurred. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    // --- Scenario B: Firebase Authentication (Example) ---
    // const auth = getAuth(app);
    // try {
    //   const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    //   // Optionally, update Firebase user profile with firstName, lastName here
    //   // await updateProfile(userCredential.user, { displayName: `${data.firstName} ${data.lastName}` });
    //   toast({
    //     title: "Registration Successful!",
    //     description: "Welcome! You can now log in.",
    //   });
    //   router.push('/auth/login');
    // } catch (error: any) {
    //   let errorMessage = "An unexpected error occurred.";
    //   if (error.code === "auth/email-already-in-use") {
    //     errorMessage = "This email address is already in use.";
    //   } else if (error.code === "auth/weak-password") {
    //     errorMessage = "The password is too weak.";
    //   }
    //   toast({
    //     title: "Registration Failed",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              <FormDescription>
                Must be at least 8 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
