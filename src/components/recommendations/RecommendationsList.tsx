"use client";

import { useEffect, useState } from 'react';
import { getProductRecommendations } from '@/ai/flows/product-recommendations';
import type { Recommendation } from '@/types';
import { RecommendationCard } from './RecommendationCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface RecommendationsListProps {
  productDescription: string;
}

export function RecommendationsList({ productDescription }: RecommendationsListProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState("General interest in digital tools and productivity software.");

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await getProductRecommendations({ 
        productDescription,
        userPreferences 
      });
      // The AI flow returns an array of strings (service names)
      // Map them to Recommendation objects
      const formattedRecommendations: Recommendation[] = result.recommendations.map((name, index) => ({
        id: `rec-${index}-${Date.now()}`, // Generate a unique ID
        name: name,
        // description: "AI Suggested Service" // Optional: Add a generic description
      }));
      setRecommendations(formattedRecommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      toast({
        title: "Recommendation Error",
        description: "Could not load recommendations at this time.",
        variant: "destructive",
      });
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDescription]); // Fetch new recommendations if productDescription changes

  const handlePreferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
  };

  return (
    <Card className="mt-8 bg-card shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary">You Might Also Like</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePreferenceSubmit} className="mb-6 space-y-3">
          <div>
            <Label htmlFor="userPreferences" className="text-sm font-medium">Your Preferences (optional):</Label>
            <Textarea
              id="userPreferences"
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
              placeholder="e.g., interested in marketing tools, creative software, etc."
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh Recommendations
          </Button>
        </form>

        {isLoading && recommendations.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading recommendations...</p>
          </div>
        ) : !isLoading && recommendations.length === 0 ? (
          <p className="text-muted-foreground">No recommendations available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
