import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center py-12">
      <Frown className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-5xl font-bold font-headline mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  )
}
