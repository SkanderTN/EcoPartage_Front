import { useState, useEffect, useCallback } from 'react';
import { postsService } from '../services/posts.service';
import { Category } from '../types/post.types';

export const useCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const categories = await postsService.getCategories();
      setData(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};

export const useCreateCategory = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      { name, description }: { name: string; description?: string },
      options?: {
        onSuccess?: (category: Category) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setIsPending(true);
        setError(null);
        const newCategory = await postsService.createCategory(name, description);
        options?.onSuccess?.(newCategory);
        return newCategory;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create category');
        setError(error.message);
        options?.onError?.(error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return {
    mutate,
    isPending,
    error,
  };
};