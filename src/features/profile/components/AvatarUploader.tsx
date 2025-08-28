// src/features/profile/components/AvatarUploader.tsx
import React, { useRef, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Camera, Upload } from 'lucide-react';

interface AvatarUploaderProps {
  currentImage?: string | null;
  firstName: string;
  lastName: string;
  onImageSelect: (file: File) => void;
  loading?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentImage,
  firstName,
  lastName,
  onImageSelect,
  loading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)$/)) {
        alert('Veuillez sélectionner un fichier image valide (JPG, PNG, GIF)');
        return;
      }
      
      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      
      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        setImageError(false);
      };
      reader.readAsDataURL(file);
      
      onImageSelect(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Déterminer quelle image afficher
  const imageToShow = previewImage || currentImage;
  const shouldShowImage = imageToShow && !imageError;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar actuel */}
      <div className="relative group">
        {shouldShowImage ? (
          <img
            src={imageToShow}
            alt="Photo de profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-gray-200">
            <span className="text-3xl font-semibold text-gray-600">{initials}</span>
          </div>
        )}
        
        {/* Overlay pour indiquer le changement possible */}
        <div 
          className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer"
          onClick={triggerFileSelect}
        >
          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      {/* Bouton d'upload */}
      <Button 
        type="button" 
        variant="outline" 
        onClick={triggerFileSelect}
        disabled={loading}
        className="min-w-[150px]"
      >
        <Upload className="w-4 h-4 mr-2" />
        {loading ? 'Upload en cours...' : 'Changer la photo'}
      </Button>
      
      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Informations sur les restrictions */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Formats acceptés : JPG, PNG, GIF. Taille max : 5MB
      </p>
      
      {/* Message d'erreur si l'image ne se charge pas */}
      {imageError && currentImage && (
        <p className="text-xs text-red-500 text-center">
          Erreur de chargement de l'image
        </p>
      )}
    </div>
  );
};