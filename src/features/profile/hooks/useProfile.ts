// src/features/profile/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { Profile, UpdateProfileDto, ChangePasswordDto } from '../types';
import { profileApi } from '../services';

// Alternative simple pour les notifications toast
const showToast = {
  success: (message: string) => {
    console.log(`✅ ${message}`);
    // Vous pouvez remplacer par une notification personnalisée
    alert(`Succès: ${message}`);
  },
  error: (message: string) => {
    console.error(`❌ ${message}`);
    alert(`Erreur: ${message}`);
  }
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await profileApi.getProfile();
      setProfile(profileData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement du profil';
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (data: UpdateProfileDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileApi.updateProfile(data);
      setProfile(updatedProfile);
      
      // Mettre à jour les données dans localStorage pour cohérence
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updatedProfile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Émettre un événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedProfile }));
      
      showToast.success('Profil mis à jour avec succès');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour';
      setError(errorMessage);
      showToast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Changer le mot de passe
  const changePassword = async (data: ChangePasswordDto): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await profileApi.changePassword(data);
      showToast.success('Mot de passe modifié avec succès');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      showToast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload photo de profil
  const uploadProfilePicture = async (file: File): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await profileApi.uploadProfilePicture(file);
      if (profile) {
        const updatedProfile = { ...profile, profilePicture: response.profilePicture };
        setProfile(updatedProfile);
        
        // Mettre à jour localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, profilePicture: response.profilePicture };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Émettre un événement
        window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedProfile }));
      }
      showToast.success('Photo de profil mise à jour');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'upload';
      setError(errorMessage);
      showToast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Charger le profil au montage
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture,
  };
};