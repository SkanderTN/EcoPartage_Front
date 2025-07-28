import { useState } from 'react';
import { CreatePostDto, Post } from '../types/post.types';
import { postsService } from '../services/posts.service';

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (data: CreatePostDto): Promise<Post | null> => {
    try {
      setLoading(true);
      setError(null);
      const post = await postsService.createPost(data);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
};