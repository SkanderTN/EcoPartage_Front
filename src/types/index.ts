// src/types/index.ts - Mise à jour du type User
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'simple' | 'company' | 'association';
  token: string;
  profilePicture?: string | null; // Nouveau champ ajouté
  
  // Champs optionnels pour compatibilité avec l'API profil
  nameAsso?: string;
  nameCompany?: string;
  contactPhone?: number;
  isActive?: boolean;
}