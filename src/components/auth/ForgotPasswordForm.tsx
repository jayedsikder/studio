
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'; // Removed FormLabel as it's sr-only
import { Loader2, Mail, ArrowRight, KeyRound, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');


  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setIsLoading(true);
    setIsEmailSent(false);
    setUserEmail(data.email); // Store email for the success message
    const auth = getAuth(app);

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/login`, 
        handleCodeInApp: false, 
      };

      await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
      toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${data.email}, a password reset link has been sent. Please check your inbox (and spam folder).`,
        duration: 7000,
      });
      setIsEmailSent(true);
      // form.reset(); // Don't reset form, so user can see the email they submitted to
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      // It's generally good practice not to reveal if an email exists or not for security reasons (prevents email enumeration).
      // So, even on error, we might show a message similar to success.
      // However, if you want specific error messages (e.g., "auth/invalid-email"), you can uncomment the error handling.
      toast({
        title: "Request Submitted",
        description: `If an account exists for ${data.email}, a password reset link has been sent. If you don't receive it, please check your spam folder or try again.`,
        variant: "default", // Changed from destructive to default to avoid user confusion if email doesn't exist
        duration: 7000,
      });
       setIsEmailSent(true); // Still set to true to show the "Check your email" message
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="bg-slate-800/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full border border-slate-700 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-sky-400 mb-6" />
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Check Your Email</h2>
        <p className="text-slate-300 mb-1">
          A password reset link has been sent to:
        </p>
        <p className="text-sky-300 font-medium text-lg mb-6 break-all">{userEmail}</p>
        <p className="text-slate-400 text-sm mb-6">
          (If this email is associated with an account).
          Please check your inbox and spam folder. The link will expire after some time.
        </p>
        <Button asChild className="w-full bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-semibold transition-all duration-300 py-3 group">
          <Link href="/auth/login">
            Back to Login
            <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full border border-slate-700">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/70 via-red-500/70 to-yellow-500/70 p-1 shadow-lg">
          <div className="w-full h-full bg-slate-800/80 rounded-full flex items-center justify-center backdrop-blur-sm">
            <KeyRound className="w-10 h-10 sm:w-12 sm:h-12 text-sky-400" />
          </div>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-2">Forgot Password?</h1>
      <p className="text-sm text-center text-slate-400 mb-8">
        No worries! Enter your email address below and we'll send you a link to reset your password.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel className="sr-only">Email</FormLabel> */}
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      type="email" 
                      placeholder="Email Address" 
                      {...field} 
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-pink-400" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-semibold transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center group"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>

          <div className="text-center pt-4">
            <Link href="/auth/login" className="block text-sm text-sky-400 hover:text-sky-300 transition-colors duration-300">
                Remember your password? Sign In
            </Link>
             <Link href="/auth/signup" className="block text-sm text-sky-400 hover:text-sky-300 transition-colors duration-300 mt-2">
                Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
