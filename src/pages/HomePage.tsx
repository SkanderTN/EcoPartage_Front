import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostSearch } from '../features/posts/components/PostSearch';
import { PostGrid } from '../features/posts/components/PostGrid';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/ui/button';
import { usePosts } from '../features/posts/hooks/usePosts';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    posts, 
    loading, 
    error, 
    filters, 
    pagination, 
    updateFilters, 
    changePage 
  } = usePosts();

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handleSearch = (query: string) => {
    updateFilters({ q: query });
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Réduisez le gaspillage.
            <br />
            <span className="text-[#518581] font-bold mb-4">Valorisez vos surplus</span>
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Connectez-vous avec votre communauté pour partager, échanger ou vendre 
            vos surplus et contribuer à une économie circulaire.
          </p>
          
          {/* Search Bar */}
          <PostSearch 
            onSearch={handleSearch} 
            filters={filters} 
            onFilterChange={updateFilters}
          />
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Toutes les annonces</h2>
          <Button 
            className="bg-[#518581] hover:bg-green-700 text-white"
            onClick={() => navigate('/posts/create')}
          >
            Publier une annonce
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <PostGrid 
          posts={posts} 
          loading={loading} 
          onPostClick={handlePostClick} 
        />

        {/* Pagination */}
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </section>

    </div>
  );
};

export default HomePage;