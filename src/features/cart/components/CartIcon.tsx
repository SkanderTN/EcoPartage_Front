// ⭐ CORRECTION 15: CartIcon amélioré avec vérification d'authentification
// src/features/cart/components/CartIcon.tsx - Version corrigée
import React, { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


interface CartIconProps {
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className = '',
  onClick,
  showBadge = true 
}) => {
  const { cart, loading, actions, isAuthenticated } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Calcul correct : nombre d'articles uniques (pas la quantité totale)
  const uniqueItemsCount = cart?.items?.length || 0;

  // ⭐ CORRECTION 16: Rafraîchir le panier seulement si authentifié
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔄 [CartIcon] Utilisateur authentifié, rafraîchissement du panier");
      actions.fetchCart();
    } else {
      console.log("⚠️ [CartIcon] Utilisateur non authentifié, pas de rafraîchissement");
    }
  }, [location.pathname, isAuthenticated, actions]);

  // Rafraîchir périodiquement le panier seulement si authentifié
  useEffect(() => {
    

   

    
  }, [actions, isAuthenticated]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      console.warn('🛒 Utilisateur non connecté, redirection nécessaire');
      // Ici vous pourriez déclencher une redirection vers la page de login
      alert('Vous devez être connecté pour accéder au panier');
      navigate("/auth")
      return;
    }
    
    console.log('🛒 Clic sur CartIcon, items:', uniqueItemsCount);
    onClick?.();
  };

  // Masquer l'icône si on est sur la page panier
  const isOnCartPage = location.pathname === '/cart';

  // ⭐ CORRECTION 17: Logs de debug plus détaillés
  if (process.env.NODE_ENV === 'development') {
    console.log('🛒 [CartIcon] État complet:', {
      isAuthenticated,
      cart: cart,
      uniqueItemsCount,
      currentPath: location.pathname,
      hasToken: !!localStorage.getItem('authToken'),
      hasUser: !!localStorage.getItem('user'),
    });
  }

  return (
    <div 
      className={`relative cursor-pointer transition-opacity duration-300 ${
        isOnCartPage ? 'opacity-50 pointer-events-none' : ''
      } ${!isAuthenticated ? 'opacity-75' : ''} ${className}`} 
      onClick={handleClick}
      title={!isAuthenticated ? 'Connectez-vous pour accéder au panier' : 'Voir le panier'}
    >
      <ShoppingCart 
        className={`w-6 h-6 transition-colors hover:bg-[#94AEAB] ${
          loading ? 'animate-pulse' : ''
        } ${isOnCartPage ? 'text-gray-400' : 'text-gray-600'} ${
          !isAuthenticated ? 'text-gray-400' : ''
        }`}
      />
      
      {/* Badge affiché seulement si authentifié ET qu'il y a des articles ET qu'on n'est pas sur la page panier */}
      {showBadge && isAuthenticated && uniqueItemsCount > 0 && !isOnCartPage && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] animate-pulse">
          {uniqueItemsCount > 99 ? '99+' : uniqueItemsCount}
        </span>
      )}
      
      {/* Indicateur visuel pour utilisateur non connecté */}
      {!isAuthenticated && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></span>
      )}
    </div>
  );
};