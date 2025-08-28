// src/features/profile/types/Profile.ts
export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'simple' | 'company' | 'association';
  profilePicture?: string | null;
  isActive: boolean;
  
  // Champs spécifiques selon le rôle
  nameAsso?: string;        // Pour les associations
  nameCompany?: string;     // Pour les entreprises
  contactPhone?: number;    // Pour entreprises et associations
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  nameAsso?: string;
  nameCompany?: string;
  contactPhone?: number;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileApiResponse {
  success: boolean;
  data: Profile;
  message?: string;
}

export interface UploadResponse {
  profilePicture: string;
}