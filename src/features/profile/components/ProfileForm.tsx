// src/features/profile/components/ProfileForm.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Save, Eye, EyeOff } from 'lucide-react';
import { Profile, UpdateProfileDto, ChangePasswordDto } from '../types';
import { formatProfileData } from '../utils';
import { AvatarUploader } from './AvatarUploader';

interface ProfileFormProps {
  profile: Profile;
  onUpdateProfile: (data: UpdateProfileDto) => Promise<boolean>;
  onChangePassword: (data: ChangePasswordDto) => Promise<boolean>;
  onUploadImage: (file: File) => Promise<boolean>;
  loading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onUpdateProfile,
  onChangePassword,
  onUploadImage,
  loading = false,
}) => {
  const [formData, setFormData] = useState<UpdateProfileDto>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    nameCompany: profile.nameCompany || '',
    nameAsso: profile.nameAsso || '',
    contactPhone: profile.contactPhone || 0,
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordDto>({
    currentPassword: '',
    newPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const handleInputChange = (field: keyof UpdateProfileDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof ChangePasswordDto, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Les champs prénom, nom et email sont obligatoires');
      return;
    }
    
    if (!formatProfileData.isValidEmail(formData.email!)) {
      alert('Veuillez entrer un email valide');
      return;
    }

    const success = await onUpdateProfile(formData);
    if (success) {
      // Le profil sera mis à jour via le hook
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    if (!formatProfileData.isValidPassword(passwordData.newPassword)) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const success = await onChangePassword(passwordData);
    if (success) {
      setPasswordData({ currentPassword: '', newPassword: '' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar Uploader */}
      <Card>
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUploader
            currentImage={profile.profilePicture}
            firstName={profile.firstName}
            lastName={profile.lastName}
            onImageSelect={onUploadImage}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Informations personnelles
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'password' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500'
          }`}
        >
          Mot de passe
        </button>
      </div>

      {/* Contenu des tabs */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Modifier le profil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              {/* Champs spécifiques selon le rôle */}
              {profile.role === 'company' && (
                <div>
                  <Label htmlFor="nameCompany">Nom de l'entreprise</Label>
                  <Input
                    id="nameCompany"
                    value={formData.nameCompany || ''}
                    onChange={(e) => handleInputChange('nameCompany', e.target.value)}
                  />
                </div>
              )}

              {profile.role === 'association' && (
                <div>
                  <Label htmlFor="nameAsso">Nom de l'association</Label>
                  <Input
                    id="nameAsso"
                    value={formData.nameAsso || ''}
                    onChange={(e) => handleInputChange('nameAsso', e.target.value)}
                  />
                </div>
              )}

              {(profile.role === 'company' || profile.role === 'association') && (
                <div>
                  <Label htmlFor="contactPhone">Téléphone de contact</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone || ''}
                    onChange={(e) => handleInputChange('contactPhone', parseInt(e.target.value) || 0)}
                  />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
