import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ImageUploadProps {
  mainPhoto: File | null;
  additionalPhotos: File[];
  onMainPhotoChange: (file: File | null) => void;
  onAdditionalPhotosChange: (files: File[]) => void;
  errors?: {
    mainPhoto?: string;
    additionalPhotos?: string;
  };
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  mainPhoto,
  additionalPhotos,
  onMainPhotoChange,
  onAdditionalPhotosChange,
  errors
}) => {
  // Dropzone pour la photo principale
  const onDropMain = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onMainPhotoChange(acceptedFiles[0]);
    }
  }, [onMainPhotoChange]);

  const {
    getRootProps: getMainRootProps,
    getInputProps: getMainInputProps,
    isDragActive: isMainDragActive
  } = useDropzone({
    onDrop: onDropMain,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  // Dropzone pour les photos additionnelles
  const onDropAdditional = useCallback((acceptedFiles: File[]) => {
    const newPhotos = [...additionalPhotos, ...acceptedFiles];
    // Limiter à 4 photos additionnelles
    onAdditionalPhotosChange(newPhotos.slice(0, 4));
  }, [additionalPhotos, onAdditionalPhotosChange]);

  const {
    getRootProps: getAdditionalRootProps,
    getInputProps: getAdditionalInputProps,
    isDragActive: isAdditionalDragActive
  } = useDropzone({
    onDrop: onDropAdditional,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 4
  });

  const removeMainPhoto = () => {
    onMainPhotoChange(null);
  };

  const removeAdditionalPhoto = (index: number) => {
    const newPhotos = additionalPhotos.filter((_, i) => i !== index);
    onAdditionalPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-6">
      {/* Photo principale */}
      <div>
        <label className="block text-lg font-semibold mb-2">Photo principale *</label>
        {!mainPhoto ? (
          <div
            {...getMainRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isMainDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
              ${errors?.mainPhoto ? 'border-red-300' : ''}
            `}
          >
            <input {...getMainInputProps()} />
            <div className="flex flex-col items-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium mb-1">UPLOAD IMAGE</p>
              <p className="text-gray-500 text-sm">
                {isMainDragActive ? 'Déposez l\'image ici' : 'Glissez-déposez ou cliquez pour sélectionner'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(mainPhoto)}
              alt="Photo principale"
              className="w-48 h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2"
              onClick={removeMainPhoto}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {errors?.mainPhoto && (
          <p className="text-red-500 text-sm mt-1">{errors.mainPhoto}</p>
        )}
      </div>

      {/* Photos additionnelles */}
      <div>
        <label className="block text-lg font-semibold mb-2">
          Photos additionnelles (max. 4)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={() => removeAdditionalPhoto(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {additionalPhotos.length < 4 && (
            <div
              {...getAdditionalRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-4 flex items-center justify-center
                cursor-pointer transition-colors duration-200 h-32
                ${isAdditionalDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
              `}
            >
              <input {...getAdditionalInputProps()} />
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                <p className="text-gray-500 text-xs">Ajouter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};