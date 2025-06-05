export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  aiHint?: string; 
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Recommendation {
  id: string; // Assuming recommendations might have IDs, or can be product IDs
  name: string;
  description?: string; // Recommendations from AI are just strings (product names)
}
