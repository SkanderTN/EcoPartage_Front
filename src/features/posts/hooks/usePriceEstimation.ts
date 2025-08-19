import { useState } from 'react';
import { PostCondition } from '../types/post.types';

interface PriceEstimationParams {
  title: string;
  description?: string;
  quantity?: {
    value: string;
    unit: string;
  };
  condition: PostCondition;
  mainPhoto: File | null;
  additionalPhotos?: File[];
}

export const usePriceEstimation = () => {
  const [isEstimating, setIsEstimating] = useState(false);
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

  const estimatePrice = async (params: PriceEstimationParams): Promise<number | null> => {
    if (!params.mainPhoto) {
      setError('Une photo principale est requise pour l\'estimation');
      return null;
    }

    setIsEstimating(true);
    setError(null);

    try {
      const mainPhotoBase64 = await compressAndConvertToBase64(params.mainPhoto);
      let additionalPhotosBase64: string[] = [];

      if (params.additionalPhotos && params.additionalPhotos.length > 0) {
        additionalPhotosBase64 = await Promise.all(
          params.additionalPhotos.map(file => compressAndConvertToBase64(file))
        );
      }

      const requestBody = {
        title: params.title,
        description: params.description,
        quantity: params.quantity,
        condition: params.condition,
        mainPhotoBase64,
        additionalPhotosBase64
      };

      const response = await fetch('/api/posts/estimate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'estimation du prix');
      }

      const data = await response.json();
      return data.estimatedPrice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de l\'estimation';
      setError(errorMessage);
      return null;
    } finally {
      setIsEstimating(false);
    }
  };

  return {
    estimatePrice,
    isEstimating,
    error
  };
};