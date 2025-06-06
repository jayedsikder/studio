
import { SignUpForm } from '@/components/auth/SignUpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | CommerceFlow',
  description: 'Join CommerceFlow to build your digital empire.',
};

export default function SignUpPage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center min-h-screen relative overflow-hidden p-4">
      {/* Animated decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="z-10 w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
