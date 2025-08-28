// src/features/cart/hooks/useCartItem.ts
import { useState, useCallback } from 'react';
import { CartApiService } from '../services';
import { UpdateCartItemDto } from '../types';

// Fonction utilitaire pour déclencher la mise à jour du panier
const triggerCartUpdate = () => {
  console.log('📢 [useCartItem] Déclenchement événement cart-updated');
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const useCartItem = (itemId: string, onUpdate?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour la quantité d'un article
  const updateQuantity = useCallback(async (quantity: number) => {
    if (quantity < 1) return false;
    
    console.log(`🔄 [useCartItem] Mise à jour quantité ${itemId}:`, quantity);
    setLoading(true);
    setError(null);
    
    try {
      const updateData: UpdateCartItemDto = { quantity };
      await CartApiService.updateCartItem(itemId, updateData);
      console.log('✅ [useCartItem] Quantité mise à jour');
      
      // Déclencher les événements de mise à jour
      onUpdate?.(); // Callback local
      triggerCartUpdate(); // Événement global
      
      return true;
    } catch (error: any) {
      console.error('❌ [useCartItem] Erreur mise à jour quantité:', error);
      setError(error.message || 'Erreur lors de la mise à jour de la quantité');
      return false;
    } finally {
      setLoading(false);
    }
  }, [itemId, onUpdate]);

  // Augmenter la quantité
  const increaseQuantity = useCallback(async (currentQuantity: number) => {
    console.log(`➕ [useCartItem] Augmentation quantité ${itemId}`);
    return await updateQuantity(currentQuantity + 1);
  }, [updateQuantity]);

  // Diminuer la quantité
  const decreaseQuantity = useCallback(async (currentQuantity: number) => {
    if (currentQuantity <= 1) return false;
    console.log(`➖ [useCartItem] Diminution quantité ${itemId}`);
    return await updateQuantity(currentQuantity - 1);
  }, [updateQuantity]);

  // Supprimer l'article du panier
  const removeItem = useCallback(async () => {
    console.log(`🗑️ [useCartItem] Suppression article ${itemId}`);
    setLoading(true);
    setError(null);
    
    try {
      await CartApiService.removeCartItem(itemId);
      console.log('✅ [useCartItem] Article supprimé');
      
      // Déclencher les événements de mise à jour
      onUpdate?.(); // Callback local
      triggerCartUpdate(); // Événement global
      
      return true;
    } catch (error: any) {
      console.error('❌ [useCartItem] Erreur suppression:', error);
      setError(error.message || 'Erreur lors de la suppression de l\'article');
      return false;
    } finally {
      setLoading(false);
    }
  }, [itemId, onUpdate]);

  return {
    loading,
    error,
    actions: {
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearError: () => setError(null),
    },
  };
};