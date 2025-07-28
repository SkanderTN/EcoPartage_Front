import React from 'react';
import PostCard from './PostCard';
import { Post } from '../types/post.types';
import { Skeleton } from '../../../components/ui/skeleton';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';

interface PostGridProps {
  posts: Post[];
  loading: boolean;
  onPostClick: (postId: string) => void;
}

export const PostGrid: React.FC<PostGridProps> = ({ posts, loading, onPostClick }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
            <CardFooter className="px-4 py-3 bg-gray-50">
              <Skeleton className="h-6 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune annonce trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => onPostClick(post.id)}
        />
      ))}
    </div>
  );
};