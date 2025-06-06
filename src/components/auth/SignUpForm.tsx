
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Loader2, UserPlus, User, Mail, Lock, Eye, EyeOff, ArrowRight, LockKeyholeIcon } from 'lucide-react';
import Link from 'next/link';

import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters." }),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setIsLoading(true);
    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: `${data.firstName} ${data.lastName}` });
        await sendEmailVerification(userCredential.user);
        
        await signOut(auth); 
        
        toast({
          title: "Registration Almost Complete!",
          description: "Please check your email (and spam folder) for a verification link. You must verify your email before logging in.",
          duration: 9000, 
        });
        form.reset();
        router.push('/auth/login'); // Redirect to login after successful signup prompt
      } else {
        throw new Error("User creation failed unexpectedly.");
      }

    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email address is already in use.";
            break;
          case "auth/weak-password":
            errorMessage = "The password is too weak. It must be at least 8 characters long.";
            break;
          case "auth/invalid-email":
            errorMessage = "The email address is not valid.";
            break;
          default:
            errorMessage = error.message || "Failed to create account.";
        }
      }
      console.error("Firebase SignUp Error:", error);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full border border-slate-700">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/70 via-red-500/70 to-yellow-500/70 p-1 shadow-lg">
          <div className="w-full h-full bg-slate-800/80 rounded-full flex items-center justify-center backdrop-blur-sm">
            <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-sky-400" />
          </div>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-8">Create Your Account</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        placeholder="First Name" 
                        {...field} 
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-pink-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        placeholder="Last Name" 
                        {...field} 
                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-pink-400" />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      {...field} 
                      className="w-full pl-12 pr-10 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-sky-400 transition-colors duration-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-pink-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <LockKeyholeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm Password" 
                      {...field} 
                      className="w-full pl-12 pr-10 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400"
                    />
                     <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-sky-400 transition-colors duration-300"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-pink-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="terms-agreement"
                    className="h-5 w-5 text-sky-500 bg-slate-700/50 border-slate-600/70 rounded focus:ring-sky-500 focus:ring-offset-slate-800/50 data-[state=checked]:bg-sky-500 data-[state=checked]:text-slate-900"
                  />
                </FormControl>
                <label htmlFor="terms-agreement" className="text-sm text-slate-300">
                  I agree to the <Link href="/terms-and-conditions" className="text-sky-400 hover:text-sky-300 transition-colors duration-300" target="_blank">Terms and Conditions</Link>
                </label>
                <FormMessage className="text-pink-400" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 flex items-center justify-center group"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-sky-400 hover:text-sky-300 transition-colors duration-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
