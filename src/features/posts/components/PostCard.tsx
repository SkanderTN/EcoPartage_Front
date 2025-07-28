import React from 'react';
import { Card, CardContent, CardFooter } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { MapPin, Package } from 'lucide-react';
import { Post, PostType, PostCondition } from '../types/post.types';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const getTypeLabel = (type: PostType) => {
    switch (type) {
      case PostType.FREE:
        return 'Gratuit';
      case PostType.PAID:
        return 'Payant';
    }
  };

  const getTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.FREE:
        return 'bg-green-100 text-green-800';
      case PostType.PAID:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getConditionLabel = (condition: PostCondition) => {
    switch (condition) {
      case PostCondition.NEW:
        return 'Neuf';
      case PostCondition.LIKE_NEW:
        return 'Comme neuf';
      case PostCondition.USED:
        return 'Utilisé';
      case PostCondition.DAMAGED:
        return 'Endommagé';
      case PostCondition.EXPIRED:
        return 'Expiré';
    }
  };

  const getConditionColor = (condition: PostCondition) => {
    switch (condition) {
      case PostCondition.NEW:
        return 'bg-emerald-100 text-emerald-800';
      case PostCondition.LIKE_NEW:
        return 'bg-teal-100 text-teal-800';
      case PostCondition.USED:
        return 'bg-yellow-100 text-yellow-800';
      case PostCondition.DAMAGED:
        return 'bg-orange-100 text-orange-800';
      case PostCondition.EXPIRED:
        return 'bg-red-100 text-red-800';
    }
  };

  const displayLocation = () => {
    const parts = [];
    if (post.neighborhood) parts.push(post.neighborhood);
    if (post.city) parts.push(post.city);
    return parts.join(', ');
  };

  const allPhotos = [
    post.mainPhoto,
    ...(post.additionalPhotos || [])
  ].filter(Boolean);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {allPhotos.length > 0 ? (
          <img
            src={allPhotos[0]}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={getTypeColor(post.type)}>
            {getTypeLabel(post.type)}
          </Badge>
          <Badge className={getConditionColor(post.condition)}>
            {getConditionLabel(post.condition)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{displayLocation()}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Package className="w-4 h-4 mr-1" />
            <span>{post.quantity.value} {post.quantity.unit}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 py-3 bg-gray-50">
        {post.type === PostType.PAID && post.price !== undefined ? (
          <span className="font-bold text-lg">{post.price} €</span>
        ) : (
          <span className="text-gray-600 font-medium">Gratuit</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;