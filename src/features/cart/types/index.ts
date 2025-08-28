// src/features/cart/types/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: string; // Changé de number à string
  title: string;
  description: string;
  price: string | number; // Peut être string ou number
  type: 'free' | 'paid';
  
  // Ajout des champs manquants basés sur vos données
  mainPhoto?: string; // URL Cloudinary principale
  additionalPhotos?: string[]; // URLs des photos supplémentaires
  imageUrl?: string; // Fallback pour compatibilité
  
  // Autres champs de votre structure
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  city?: string;
  neighborhood?: string;
  street?: string;
  postalCode?: string;
  quantity?: {
    value: number;
    unit: string;
  };
  status?: 'available' | 'sold' | 'reserved';
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItemType {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  user: User | null;
  userId?: number | string; // Optionnel, pour gérer les réponses API qui incluent cet ID
  items: CartItemType[];
  totalPrice: number;
}

export interface AddToCartDto {
  productId: string | number; // Flexible pour les deux types
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartApiResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}