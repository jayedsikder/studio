import type { Recommendation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  // Assuming recommendations link to product pages if they are existing products
  // For now, let's assume 'name' is enough and we don't have direct links for AI generated names
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-md font-headline">{recommendation.name}</CardTitle>
      </CardHeader>
      {recommendation.description && (
         <CardContent>
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
         </CardContent>
      )}
      {/* If recommendations can be actual products with IDs:
      <CardFooter>
        <Button variant="link" asChild className="text-primary p-0">
          <Link href={`/products/${recommendation.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
      */}
    </Card>
  );
}
