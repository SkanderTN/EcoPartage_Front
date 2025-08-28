// src/features/cart/components/AddToCartButton.tsx
import React, { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCart } from '../hooks';
import { Product } from '../types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

// Fonction utilitaire pour déclencher la mise à jour du panier
const triggerCartUpdate = () => {
  console.log('📢 [AddToCartButton] Déclenchement événement cart-updated');
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  variant = 'primary',
  size = 'md',
  showIcon = true,
  className = '',
  onSuccess,
  onError,
  disabled = false
}) => {
  const { actions, loading: cartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Vérifier si le produit peut être ajouté au panier
  const canAddToCart = !disabled;

  const handleAddToCart = async () => {
    if (!canAddToCart || isAdding) return;

    setIsAdding(true);
    
    try {
      const success = await actions.addToCart({
        productId: product.id,
        quantity
      });

      if (success) {
        setJustAdded(true);
        console.log('✅ [AddToCartButton] Produit ajouté avec succès');
        
        // ⭐ SOLUTION : Déclencher l'événement global pour mettre à jour l'icône
        triggerCartUpdate();
        
        onSuccess?.();
        
        // Réinitialiser l'état après 2 secondes
        setTimeout(() => {
          setJustAdded(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error('❌ [AddToCartButton] Erreur lors de l\'ajout:', error);
      onError?.(error.message || 'Erreur lors de l\'ajout au panier');
    } finally {
      setIsAdding(false);
    }
  };

  // Styles selon la variante
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#A8C2C0] text-white hover:bg-[#94AEAB] border-bg-[#A8C2C0]';
      case 'secondary':
        return 'bg-[#A8C2C0] text-white hover:bg-[#94AEAB] border-bg-[#A8C2C0]';
      case 'outline':
        return 'bg-transparent text-gray-400 hover:bg-[#94AEAB] border-bg-[#A8C2C0]';
      default:
        return 'bg-[#A8C2C0] text-white hover:bg-[#94AEAB] border-bg-[#A8C2C0]';
    }
  };

  // Styles selon la taille
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  // Contenu du bouton selon l'état
  const getButtonContent = () => {
    if (isAdding || cartLoading) {
      return (
        <>
          <Loader2 className={`${showIcon ? 'mr-2' : ''} h-4 w-4 animate-spin`} />
          {showIcon && 'Ajout en cours...'}
        </>
      );
    }

    if (justAdded) {
      return (
        <>
          <Check className={`${showIcon ? 'mr-2' : ''} h-4 w-4`} />
          {showIcon && 'Ajouté !'}
        </>
      );
    }

    return (
      <>
        <ShoppingCart className={`${showIcon ? 'mr-2' : ''} h-4 w-4`} />
        {showIcon && 'Ajouter au panier'}
      </>
    ); 
  };

  // Classes CSS complètes
  const buttonClasses = `
    inline-flex items-center justify-center border rounded-lg font-medium
    transition-all duration-200 ease-in-out transform active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${justAdded ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
    ${className}
  `;

  return (
    <button
      onClick={handleAddToCart}
      disabled={!canAddToCart || isAdding || cartLoading}
      className={buttonClasses}
      title={
        product.type === 'free' 
          ? 'Ce produit est gratuit' 
          : 'Ajouter ce produit au panier'
      }
    >
      {getButtonContent()}
    </button>
  );
};