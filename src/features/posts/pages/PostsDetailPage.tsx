import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, MapPin, Package, Calendar } from 'lucide-react';
import { usePost } from '../hooks/usePost';
import { PostType, PostCondition } from '../types/post.types';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = usePost(id || '');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Annonce non trouvée'}
        </div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const getTypeLabel = (type: PostType) => {
    return type === PostType.FREE ? 'Gratuit' : 'Payant';
  };

  const getTypeColor = (type: PostType) => {
    return type === PostType.FREE ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getConditionLabel = (condition: PostCondition) => {
    switch (condition) {
      case PostCondition.NEW: return 'Neuf';
      case PostCondition.LIKE_NEW: return 'Comme neuf';
      case PostCondition.USED: return 'Utilisé';
      case PostCondition.DAMAGED: return 'Endommagé';
      case PostCondition.EXPIRED: return 'Expiré';
    }
  };

  const allPhotos = [post.mainPhoto, ...(post.additionalPhotos || [])].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          {allPhotos.length > 0 ? (
            <>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={allPhotos[0]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allPhotos.slice(1).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo}
                        alt={`${post.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <div className="flex gap-2">
                <Badge className={getTypeColor(post.type)}>
                  {getTypeLabel(post.type)}
                </Badge>
                <Badge variant="outline">
                  {getConditionLabel(post.condition)}
                </Badge>
              </div>
            </div>

            {post.type === PostType.PAID && post.price && (
              <p className="text-3xl font-bold text-green-600 mb-4">{post.price} €</p>
            )}
          </div>
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{post.description}</p>
          </div>
          <div className="border-t pt-6"></div>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-5 w-5" />
              <span>{[post.street, post.neighborhood, post.city, post.postalCode].filter(Boolean).join(', ')}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Package className="mr-2 h-5 w-5" />
              <span>{post.quantity.value} {post.quantity.unit}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-5 w-5" />
              <span>Publié le {new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          

          <div className="border-t pt-6 space-y-3">
            <Button className="w-full bg-[#518581] hover:bg-green-700">
              Faire une demande
            </Button>
            <Button variant="outline" className="w-full">
              Contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;