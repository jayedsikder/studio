"use client";

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { semanticSearch } from '@/ai/flows/semantic-search';
import type { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SearchBarProps {
  onSearchStart?: () => void;
  onSearchResults: (results: Product[]) => void;
  onSearchEnd?: () => void;
  allProducts: Product[]; // Pass all products to filter based on search results
}

export function SearchBar({ onSearchStart, onSearchResults, onSearchEnd, allProducts }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      // If query is empty, show all products
      onSearchResults(allProducts);
      return;
    }

    setIsLoading(true);
    if (onSearchStart) onSearchStart();

    try {
      const result = await semanticSearch({ query });
      // The AI flow returns an array of product names. We need to find the actual product objects.
      const foundProducts = result.results
        .map(name => allProducts.find(p => p.name.toLowerCase() === name.toLowerCase()))
        .filter((p): p is Product => Boolean(p));
      
      onSearchResults(foundProducts);

      if (foundProducts.length === 0) {
        toast({
          title: "No products found",
          description: "Your search didn't match any products. Try different keywords.",
        });
      }

    } catch (error) {
      console.error('Semantic search failed:', error);
      toast({
        title: "Search Error",
        description: "Something went wrong with the search. Please try again.",
        variant: "destructive",
      });
      onSearchResults(allProducts); // Show all products on error
    } finally {
      setIsLoading(false);
      if (onSearchEnd) onSearchEnd();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center space-x-2 mx-auto mb-8">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products with AI..."
        className="flex-grow text-base"
        aria-label="Search products"
      />
      <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SearchIcon className="h-5 w-5" />
        )}
        <span className="ml-2 hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
