
import type { Metadata } from 'next';
import './globals.css';
import { AppClientLayout } from './app-client-layout'; // Import the new client layout component
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'CommerceFlow',
  description: 'Modern E-commerce Platform by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased flex flex-col",
        )}
        suppressHydrationWarning // Added to handle potential browser extension interference
      >
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}
