// src/features/profile/components/ProfileCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { User, Mail, Phone, Building, Users, Edit } from 'lucide-react';
import { Profile } from '../types';
import { formatProfileData } from '../utils';

interface ProfileCardProps {
  profile: Profile;
  onEditClick: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEditClick }) => {
  const displayName = formatProfileData.getDisplayName(profile);
  const roleLabel = formatProfileData.getRoleLabel(profile.role);
  const formattedPhone = formatProfileData.formatPhone(profile.contactPhone);
  const initials = formatProfileData.getInitials(profile);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        {/* Avatar */}
        <div className="mx-auto mb-4">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Photo de profil"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-gray-200">
              <span className="text-2xl font-semibold text-gray-600">{initials}</span>
            </div>
          )}
        </div>
        
        {/* Nom et rôle */}
        <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
        <p className="text-gray-500">{roleLabel}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{formatProfileData.getFullName(profile)}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{profile.email}</span>
          </div>
          
          {profile.contactPhone && (
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{formattedPhone}</span>
            </div>
          )}
          
          {profile.nameCompany && (
            <div className="flex items-center space-x-3">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{profile.nameCompany}</span>
            </div>
          )}
          
          {profile.nameAsso && (
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{profile.nameAsso}</span>
            </div>
          )}
        </div>
        
        {/* Bouton d'édition */}
        <Button onClick={onEditClick} className="w-full mt-6">
          <Edit className="w-4 h-4 mr-2" />
          Modifier le profil
        </Button>
      </CardContent>
    </Card>
  );
};
