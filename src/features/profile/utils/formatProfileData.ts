// src/features/profile/utils/formatProfileData.ts
import { Profile } from '../types';

export const formatProfileData = {
  // Formater le nom complet
  getFullName: (profile: Profile): string => {
    return `${profile.firstName} ${profile.lastName}`;
  },

  // Obtenir le nom d'affichage selon le rôle
  getDisplayName: (profile: Profile): string => {
    switch (profile.role) {
      case 'company':
        return profile.nameCompany || formatProfileData.getFullName(profile);
      case 'association':
        return profile.nameAsso || formatProfileData.getFullName(profile);
      default:
        return formatProfileData.getFullName(profile);
    }
  },

  // Obtenir la description du rôle
  getRoleLabel: (role: Profile['role']): string => {
    const roleLabels = {
      simple: 'Utilisateur',
      company: 'Entreprise',
      association: 'Association',
    };
    return roleLabels[role] || 'Utilisateur';
  },

  // Formater le numéro de téléphone
  formatPhone: (phone?: number): string => {
    if (!phone) return '';
    return phone.toString().replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  },

  // Valider l'email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Valider le mot de passe
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  // Obtenir les initiales pour l'avatar
  getInitials: (profile: Profile): string => {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  },
};
