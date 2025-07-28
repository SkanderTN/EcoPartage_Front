import { useState, useEffect, useCallback } from 'react';
import { Post, FilterPostDto } from '../types/post.types';
import { postsService } from '../services/posts.service';

export const usePosts = (initialFilters?: FilterPostDto) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterPostDto>(initialFilters || {});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
  });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsService.getPosts({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setPosts(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const updateFilters = (newFilters: Partial<FilterPostDto>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const changePage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const refresh = () => {
    fetchPosts();
  };

  return {
    posts,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    changePage,
    refresh,
  };
};