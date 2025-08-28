// src/features/profile/pages/ProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileCard } from '../components';
import { useProfile } from '../hooks';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profil non trouvé'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>
        <ProfileCard profile={profile} onEditClick={handleEditClick} />
      </div>
    </div>
  );
};