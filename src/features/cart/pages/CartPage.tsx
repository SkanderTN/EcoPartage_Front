// src/features/cart/pages/CartPage.tsx
import React, { useEffect, useCallback } from "react";
import { ArrowLeft, ShoppingBag, Package } from "lucide-react";
import { useCart } from "../hooks";
import { CartItem, CartSummary } from "../components";

interface CartPageProps {
  onContinueShopping?: () => void;
  onCheckout?: () => void;
  onBack?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onContinueShopping,
  onCheckout,
  onBack,
}) => {
  const { cart, loading, error, isEmpty, actions } = useCart();

  // Force le rechargement du panier au montage du composant
  useEffect(() => {
    actions.fetchCart();
  }, []);

  // Calculs corrects basés sur les données du panier
  const uniqueItemsCount = cart?.items?.length || 0;
  const totalQuantity =
    cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  // Gestion du rechargement du panier avec callback pour éviter les re-renders
  const handleCartUpdate = useCallback(async () => {
    await actions.fetchCart();
  }, [actions]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    onBack?.();
  };

  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault();
    onContinueShopping?.();
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    actions.fetchCart();
  };

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={handleRetry}
                disabled={loading}
                className="bg-[#A8C2C0] text-white px-6 py-2 rounded-lg hover:bg-[#94AEAB] transition-colors disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Réessayer"}
              </button>
              {onBack && (
                <button
                  onClick={handleBack}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État de chargement
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>

            {/* Cart items skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary skeleton */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={handleBack}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Retour"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <h1 className="text-3xl font-bold text-[#5D7052] flex items-center">
                <ShoppingBag className="w-8 h-8 mr-3 text-[#5D7052]" />
                Mon Panier
              </h1>
            </div>

            {!isEmpty && (
              <div className="text-sm text-gray-600">
                {uniqueItemsCount} article{uniqueItemsCount > 1 ? "s" : ""}(
                {totalQuantity} unité{totalQuantity > 1 ? "s" : ""})
              </div>
            )}
          </div>
        </div>

        {/* Panier vide */}
        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-6">
              <ShoppingBag className="w-24 h-24 mx-auto" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Votre panier est vide
            </h2>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez nos produits et ajoutez vos articles préférés à votre
              panier pour commencer vos achats.
            </p>

            {onContinueShopping && (
              <button
                onClick={handleContinueShopping}
                className="bg-[#A8C2C0] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#94AEAB] transition-colors"
              >
                Continuer mes achats
              </button>
            )}
          </div>
        ) : (
          /* Contenu du panier */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart?.items?.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.quantity}`} // Key plus spécifique pour forcer le re-render
                    item={item}
                    onUpdate={handleCartUpdate}
                  />
                ))}
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary
                  key={`summary-${cart?.totalPrice}-${totalQuantity}`} // Key pour forcer le re-render
                  onCheckout={onCheckout}
                  onContinueShopping={onContinueShopping}
                />
              </div>
            </div>
          </div>
        )}

        {/* Informations supplémentaires */}
        {!isEmpty && (
          <div className="mt-12 bg-slate-100 rounded-lg p-6">
            {" "}
            <h3 className="text-lg font-semibold text-[#5D7052] mb-4">
              Pourquoi choisir nos produits ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#5D7052]">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#5D7052] rounded-full mr-3"></div>
                Qualité garantie
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#5D7052] rounded-full mr-3"></div>
                Livraison rapide
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#5D7052] rounded-full mr-3"></div>
                Support client 24/7
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
