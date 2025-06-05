import { getProductById, getProducts } from '@/lib/products';
import { ProductImage } from '@/components/products/ProductImage';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from './AddToCartButton'; // Client component for Add to Cart
import { RecommendationsList } from '@/components/recommendations/RecommendationsList';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} | CommerceFlow`,
    description: product.description,
  };
}

// Static site generation for product pages
export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}


export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="md:sticky md:top-24">
          <ProductImage src={product.imageUrl} alt={product.name} aiHint={product.aiHint} className="rounded-xl shadow-xl" priority />
        </div>
        <div className="space-y-6">
          <Badge variant="outline" className="text-sm bg-secondary text-secondary-foreground">{product.category}</Badge>
          <h1 className="text-4xl font-headline font-bold text-primary">{product.name}</h1>
          
          {/* Mock Reviews */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-muted-foreground ml-2">(123 reviews)</span>
          </div>

          <p className="text-2xl font-semibold text-foreground">${product.price.toFixed(2)}</p>
          
          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
          
          <Separator />

          <div className="pt-4">
             {/* AddToCartButton is a client component to handle cart interactions */}
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="mt-12 pt-8 border-t">
        <RecommendationsList productDescription={product.description} />
      </div>
    </div>
  );
}
