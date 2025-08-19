import { useState } from 'react';
import { PostCondition } from '../types/post.types';

interface FieldSuggestionParams {
  mainPhoto: File | null;
  existingTitle?: string;
  existingDescription?: string;
  quantity?: {
    value: string;
    unit: string;
  };
  condition?: PostCondition;
}

export const useFieldSuggestions = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };

      img.onerror = reject;

      // Convert file to data URL first
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateSuggestion = async (
    fieldType: 'title' | 'description' | 'quantity',
    params: FieldSuggestionParams
  ): Promise<string | null> => {
    if (!params.mainPhoto) {
      setError('Une photo principale est requise pour la suggestion');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const mainPhotoBase64 = await compressAndConvertToBase64(params.mainPhoto);

      const requestBody = {
        fieldType,
        mainPhotoBase64,
        existingTitle: params.existingTitle,
        existingDescription: params.existingDescription,
        quantity: params.quantity,
        condition: params.condition
      };

      const response = await fetch('/api/posts/suggest-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de la suggestion');
      }

      const data = await response.json();
      return data.suggestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la suggestion';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateSuggestion,
    isGenerating,
    error
  };
};