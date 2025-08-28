// src/features/cart/components/CartSummary.tsx - Version CORRIGÉE

import React, { useEffect } from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../hooks';

interface CartSummaryProps {
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  className?: string;
  showActions?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckout,
  onContinueShopping,
  className = '',
  showActions = true
}) => {
  const { cart, loading, actions } = useCart();

  // Force un re-fetch du panier quand le composant se monte
  useEffect(() => {
    actions.fetchCart();
  }, []);

  // ✅ NOUVEAU : Écouter les événements de clear pour mise à jour immédiate
  useEffect(() => {
    const handleCartCleared = () => {
      console.log('🗑️ [CartSummary] Panier vidé - mise à jour de l\'affichage');
      // La mise à jour sera automatique via le hook useCart
    };

    const handleCartUpdated = (e: CustomEvent) => {
      if (e.detail?.action === 'clear') {
        console.log('🗑️ [CartSummary] Événement clear reçu');
        // Le useCart gère déjà la mise à jour
      }
    };

    window.addEventListener('cart-cleared', handleCartCleared);
    window.addEventListener('cart-updated', handleCartUpdated as EventListener);

    return () => {
      window.removeEventListener('cart-cleared', handleCartCleared);
      window.removeEventListener('cart-updated', handleCartUpdated as EventListener);
    };
  }, []);

  // Conversion sécurisée du prix total - utiliser le totalPrice du panier plutôt que celui du hook
  const safeTotalPrice = cart?.totalPrice
    ? (typeof cart.totalPrice === 'number' ? cart.totalPrice : parseFloat(cart.totalPrice as any) || 0)
    : 0;

  // Calcul du nombre d'articles uniques (pas la quantité totale)
  const uniqueItemsCount = cart?.items?.length || 0;

  // Calcul de la quantité totale
  const totalQuantity = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  if (!cart) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ SOLUTION SIMPLIFIÉE : Fonction de vidage sans refetch
  const handleClearCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      try {
        console.log('🗑️ [CartSummary] Démarrage vidage du panier...');
        
        // ✅ Appeler clearCart (qui gère déjà tout)
        const success = await actions.clearCart();

        if (success) {
          console.log('✅ [CartSummary] Vidage réussi - état synchronisé automatiquement');
          // ✅ SUPPRIMÉ : Plus besoin de fetchCart ni de setTimeout
          // Le useCart gère déjà la synchronisation complète
        } else {
          alert('Erreur lors du vidage du panier. Veuillez réessayer.');
        }
      } catch (error) {
        console.error('❌ [CartSummary] Erreur clearCart:', error);
        alert('Erreur lors du vidage du panier. Veuillez réessayer.');
      }
    }
  };

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCheckout?.();
  };

  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContinueShopping?.();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2" />
        Résumé de la commande
      </h2>

      <div className="space-y-3">
        {/* Détail des articles */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Articles ({uniqueItemsCount})
          </span>
          <span className="font-medium">{safeTotalPrice.toFixed(2)} DT</span>
        </div>

        {/* Quantité totale */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quantité totale</span>
          <span className="font-medium">{totalQuantity}</span>
        </div>

        {/* Frais de service */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frais de service</span>
          <span className="font-medium">0.00 DT</span>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{safeTotalPrice.toFixed(2)} DT</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="mt-6 space-y-3">
          {/* Bouton de commande */}
          <button
            onClick={handleCheckout}
            disabled={totalQuantity === 0 || loading}
            className="w-full bg-[#A8C2C0] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#94AEAB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Traitement...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Procéder au paiement
              </>
            )}
          </button>

          {/* Bouton continuer les achats */}
          {onContinueShopping && (
            <button
              onClick={handleContinueShopping}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Continuer les achats
            </button>
          )}

          {/* Bouton vider le panier */}
          {totalQuantity > 0 && (
            <button
              onClick={handleClearCart}
              disabled={loading}
              className="w-full text-red-600 hover:text-red-700 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Suppression...' : 'Vider le panier'}
            </button>
          )}
        </div>
      )}

      {/* Informations supplémentaires */}
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          Paiement sécurisé • Livraison gratuite • Support client 24/7
        </p>
      </div>
    </div>
  );
};