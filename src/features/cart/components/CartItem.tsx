// src/features/cart/components/CartItem.tsx
import React from 'react';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { CartItemType } from '../types';
import { useCartItem } from '../hooks';

interface CartItemProps {
  item: CartItemType;
  onUpdate?: () => void;
  className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdate,
  className = '' 
}) => {
  const { loading, error, actions } = useCartItem(item.id, onUpdate);

  // Conversion sécurisée du prix
  const price = typeof item.product.price === 'number' ? item.product.price : parseFloat(item.product.price as any) || 0;
  
  // Calcul du total
  const itemTotal = price * item.quantity;

  // Récupération de l'URL d'image correcte
  const imageUrl = item.product.mainPhoto || item.product.imageUrl || '';
  console.log("🖼️ [CartItem] URL image :", imageUrl);

  // ⭐ Récupération de la quantité disponible du produit
  // Gérer le fait que quantity peut être un objet { value: number, unit: string }
  const getAvailableQuantity = () => {
    if (!item.product.quantity) return 999; // Stock par défaut si pas défini
    
    if (typeof item.product.quantity === 'number') {
      return item.product.quantity;
    }
    
    if (typeof item.product.quantity === 'object' && item.product.quantity.value) {
      return item.product.quantity.value;
    }
    
    return 999; // Fallback
  };
  
  const availableQuantity = getAvailableQuantity();
  console.log(`📦 [CartItem] Quantité disponible pour "${item.product.title}":`, availableQuantity);
  console.log(`🛒 [CartItem] Quantité actuelle dans le panier:`, item.quantity);

  const handleIncreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Vérifier si on peut encore augmenter la quantité
    if (item.quantity < availableQuantity) {
      await actions.increaseQuantity(item.quantity);
    } else {
      console.warn(`⚠️ [CartItem] Quantité maximale atteinte pour "${item.product.title}"`);
    }
  };

  const handleDecreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.quantity > 1) {
      await actions.decreaseQuantity(item.quantity);
    }
  };

  const handleRemoveItem = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      await actions.removeItem();
    }
  };

  // ⭐ Logique de désactivation des boutons améliorée
  const isDecreaseDisabled = loading || item.quantity <= 1;
  const isIncreaseDisabled = loading || item.quantity >= availableQuantity;

  // ⭐ Messages d'info pour l'utilisateur
  const getQuantityInfo = () => {
    if (item.quantity >= availableQuantity) {
      return (
        <div className="text-xs text-orange-600 mt-1 text-center">
          Stock max atteint
        </div>
      );
    }
    
    if (availableQuantity <= 5 && availableQuantity > item.quantity) {
      return (
        <div className="text-xs text-amber-600 mt-1 text-center">
          Plus que {availableQuantity - item.quantity} dispo
        </div>
      );
    }
    
    return null;
  };

  // Fonction pour afficher la quantité disponible de façon lisible
  const displayAvailableQuantity = () => {
    if (!item.product.quantity) return 'Non défini';
    
    if (typeof item.product.quantity === 'number') {
      return String(item.product.quantity);
    }
    
    if (typeof item.product.quantity === 'object' && item.product.quantity.value !== undefined) {
      return `${item.product.quantity.value} ${item.product.quantity.unit || ''}`.trim();
    }
    
    return 'Non défini';
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              actions.clearError();
            }}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        {/* Image du produit */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.product.title}
              className="w-16 h-16 object-cover rounded-md"
              onError={(e) => {
                console.error("❌ Erreur de chargement image :", imageUrl);
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.classList.remove('hidden');
              }}
              onLoad={() => {
                console.log("✅ Image chargée avec succès :", imageUrl);
              }}
            />
          ) : (
            (() => {
              console.warn("⚠️ Pas d'image pour ce produit :", item.product.title);
              return null;
            })()
          )}
          
          {/* Fallback si pas d'image ou erreur */}
          <div className={`w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
            <span className="text-gray-400 text-xs">Image</span>
          </div>
        </div>

        {/* Détails du produit */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {item.product.title}
          </h3>
          
          {item.product.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {item.product.description}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              {price.toFixed(2)} DT
            </span>
            
            <span className="text-sm text-gray-500">
              Total: {itemTotal.toFixed(2)} DT
            </span>
          </div>

          {/* ⭐ Affichage du stock disponible */}
          <div className="mt-1 text-xs text-gray-400">
            Stock disponible: {displayAvailableQuantity()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end space-y-3">
          {/* Bouton supprimer */}
          <button
            onClick={handleRemoveItem}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Supprimer l'article"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

          {/* Contrôles de quantité */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 border rounded-lg">
              <button
                onClick={handleDecreaseQuantity}
                disabled={isDecreaseDisabled} 
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={
                  item.quantity <= 1 
                    ? "Quantité minimale atteinte" 
                    : "Diminuer la quantité"
                }
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={handleIncreaseQuantity}
                disabled={isIncreaseDisabled}
                className={`p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isIncreaseDisabled 
                    ? 'text-gray-400' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={
                  item.quantity >= availableQuantity
                    ? "Stock maximum atteint"
                    : "Augmenter la quantité"
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* ⭐ Messages informatifs sur la quantité */}
            {getQuantityInfo()}
          </div>
        </div>
      </div>
    </div>
  );
};