// src/features/profile/services/profileApi.ts
import axios from 'axios';
import { Profile, UpdateProfileDto, ChangePasswordDto, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Configuration axios pour les requêtes authentifiées
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const profileApi = {
  // Récupérer le profil utilisateur
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (profileData: UpdateProfileDto): Promise<Profile> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/profile`,
        profileData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  // Changer le mot de passe
  changePassword: async (passwordData: ChangePasswordDto): Promise<{ message: string }> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/change-password`,
        passwordData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  },

  // Upload photo de profil
  uploadProfilePicture: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_BASE_URL}/user/profile/picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      throw error;
    }
  },
};
