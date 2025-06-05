import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  aiHint?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProductImage({ 
  src, 
  alt, 
  aiHint,
  className, 
  width = 600, 
  height = 400,
  priority = false 
}: ProductImageProps) {
  const placeholderSrc = `https://placehold.co/${width}x${height}.png`;
  
  return (
    <div className={cn("relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-muted", className)}>
      <Image
        src={src || placeholderSrc}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 ease-in-out hover:scale-105"
        data-ai-hint={aiHint}
        priority={priority}
        unoptimized={src.startsWith('https://placehold.co')} // Avoid optimizing placeholders
      />
    </div>
  );
}
