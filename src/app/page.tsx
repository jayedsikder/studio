
"use client";

import { useState, useEffect, useMemo } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchBar } from '@/components/search/SearchBar';
import { getProducts as fetchAllProducts, getCategories, getProductsByCategory } from '@/lib/products';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Download } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Memoize allProducts to prevent SearchBar from re-fetching if not necessary
  const memoizedAllProducts = useMemo(() => allProducts, [allProducts]);

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      const products = fetchAllProducts();
      const fetchedCategories = getCategories();
      setAllProducts(products);
      setDisplayedProducts(products);
      setCategories(fetchedCategories);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const productsToDisplay = getProductsByCategory(selectedCategory);
    setDisplayedProducts(productsToDisplay);
    // Reset search results when category changes, effectively showing all products in that category
    // Or, you might want to preserve search results and filter them by category
    // For simplicity, we reset to category view.
    setIsLoading(false); 
  }, [selectedCategory, allProducts]);


  const handleSearchResults = (results: Product[]) => {
    // If search results are for "All" category, or if current category is "All"
    if (selectedCategory === 'All') {
      setDisplayedProducts(results);
    } else {
      // Filter search results by the currently selected category
      const categoryFilteredResults = results.filter(p => p.category === selectedCategory);
      setDisplayedProducts(categoryFilteredResults);
    }
  };

  if (isLoading && allProducts.length === 0) { // Initial load skeleton
    return (
      <div className="space-y-8">
        <div className="flex w-full max-w-2xl items-center space-x-2 mx-auto mb-8">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-24" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Zap className="h-10 w-10" /> Welcome to CommerceFlow
        </h1>
        <p className="text-xl text-muted-foreground">Discover amazing digital products and services.</p>
        <div className="mt-6">
          {/* 
            Placeholder Download Button: 
            You'll need to manually ZIP your project and host it. 
            Then, replace the '#' in the href below with the actual download link.
          */}
          <Button asChild variant="outline" size="lg">
            <Link href="#"> 
              <Download className="mr-2 h-5 w-5" />
              Download Project ZIP (Placeholder)
            </Link>
          </Button>
           <p className="text-sm text-muted-foreground mt-2">
            (You need to replace the link above with your actual project ZIP URL after hosting it)
          </p>
        </div>
      </div>

      <SearchBar 
        onSearchResults={handleSearchResults} 
        allProducts={memoizedAllProducts} 
        onSearchStart={() => setIsLoading(true)}
        onSearchEnd={() => setIsLoading(false)}
      />

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-foreground'}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {isLoading && displayedProducts.length === 0 ? ( // Loading state for search/filter
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {[...Array(4)].map((_, i) => (
           <div key={i} className="space-y-2">
             <Skeleton className="h-48 w-full" />
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-4 w-1/2" />
             <Skeleton className="h-10 w-full" />
           </div>
         ))}
       </div>
      ) : (
        <ProductGrid products={displayedProducts} />
      )}
    </div>
  );
}
