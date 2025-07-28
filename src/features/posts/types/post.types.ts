// src/features/posts/types/post.types.ts

export enum PostType {
  FREE = 'free',
  PAID = 'paid',
}

export enum PostCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  USED = 'used',
  DAMAGED = 'damaged',
  EXPIRED = 'expired',
}

export enum PostStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Quantity {
  value: number;
  unit: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  type: PostType;
  price?: number;
  quantity: Quantity;
  condition: PostCondition;
  status: PostStatus;
  mainPhoto?: string;
  additionalPhotos?: string[];
  street?: string;
  city: string;
  postalCode?: string;
  neighborhood?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  description: string;
  type: PostType;
  price?: number;
  quantity: Quantity;
  condition: PostCondition;
  mainPhoto?: string;
  additionalPhotos?: string[];
  street?: string;
  city: string;
  postalCode?: string;
  neighborhood?: string;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  status?: PostStatus;
}

export interface FilterPostDto {
  city?: string;
  neighborhood?: string;
  type?: PostType;
  condition?: PostCondition;
  status?: PostStatus;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  page?: number;
  limit?: number;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}