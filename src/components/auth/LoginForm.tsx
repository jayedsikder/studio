
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
import { Loader2, MailIcon } from 'lucide-react';

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { app } from "@/lib/firebase";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    const auth = getAuth(app);

    const actionCodeSettings = {
      url: `${window.location.origin}/auth/finish-login`, // URL to redirect back to
      handleCodeInApp: true,
    };

    // Log the URL being used for Firebase email link settings
    console.log('Using actionCodeSettings.url:', actionCodeSettings.url);

    try {
      await sendSignInLinkToEmail(auth, data.email, actionCodeSettings);
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', data.email);
      
      toast({
        title: "Login Link Sent!",
        description: `A login link has been sent to ${data.email}. Please check your inbox.`,
      });
      // Optionally, you can redirect the user or clear the form
      // router.push('/some-confirmation-page'); 
      form.reset();
    } catch (error: any) {
      console.error("Firebase Send Link Error:", error);
      let errorMessage = "Failed to send login link. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
          case "auth/unauthorized-continue-uri":
            errorMessage = "Firebase: Domain not allowlisted by project. Please check Firebase console > Authentication > Settings > Authorized domains, and ensure your current domain (likely 'localhost') is added.";
            break;
          // Add other Firebase error codes as needed
          default:
            errorMessage = error.message || "An unexpected error occurred.";
        }
      }
      toast({
        title: "Error Sending Link",
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
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MailIcon className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Sending Link...' : 'Send Login Link'}
        </Button>
      </form>
    </Form>
  );
}
