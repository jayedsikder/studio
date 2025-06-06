
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | CommerceFlow',
  description: 'Reset your CommerceFlow account password.',
};

export default function ForgotPasswordPage() {
  return (
    // Re-use the same full-page styling as login/signup
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center min-h-screen relative overflow-hidden p-4">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-sky-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="z-10 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
