
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'; 
import { toast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag, ArrowRight, ChevronRight, Eye, EyeOff } from 'lucide-react';

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  keepSignedIn: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user: authContextUser } = useAuth(); 

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      keepSignedIn: false,
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
        await signOut(auth);
        toast({
          title: "Login Failed",
          description: "Your email address has not been verified. Please check your email for the verification link.",
          variant: "destructive",
          duration: 9000,
        });
        setIsLoading(false);
        return;
      }

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
    <div className="bg-slate-800/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full border border-slate-700">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500/70 via-red-500/70 to-yellow-500/70 p-1 shadow-lg">
          <div className="w-full h-full bg-slate-800/80 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-sky-400" />
          </div>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-8">Sign in to Your Account</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel className="sr-only">Email</FormLabel> */}
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    {...field} 
                    className="w-full px-4 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400"
                  />
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
                {/* <FormLabel className="sr-only">Password</FormLabel> */}
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      {...field} 
                      className="w-full px-4 py-3 bg-slate-700/50 text-slate-200 border border-slate-600/70 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 placeholder-slate-400 pr-10"
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
          
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="keepSignedIn"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="keep-signed-in"
                      className="h-5 w-5 text-sky-500 bg-slate-700/50 border-slate-600/70 rounded focus:ring-sky-500 focus:ring-offset-slate-800/50 data-[state=checked]:bg-sky-500 data-[state=checked]:text-slate-900"
                    />
                  </FormControl>
                  <label htmlFor="keep-signed-in" className="text-sm text-slate-300 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Keep me signed in
                  </label>
                </FormItem>
              )}
            />
             <Link href="/auth/forgot-password" className="text-sm text-sky-400 hover:text-sky-300 transition-colors duration-300">
                Forgot password?
            </Link>
          </div>


          <Button 
            type="submit" 
            className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-500 rounded-xl text-white font-semibold transition-all duration-300 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center group"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </Button>

          <div className="text-center pt-4">
            <Link href="/auth/signup" className="text-sm text-sky-400 hover:text-sky-300 transition-colors duration-300">
                Create New Account <ChevronRight className="inline-block h-4 w-4 text-sm align-middle" />
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
