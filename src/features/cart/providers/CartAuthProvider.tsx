// src/features/cart/providers/CartAuthProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartUserGuard } from '../components/CartUserGuard';

interface User {
  id: string | number;
  name: string;
  email?: string;
}

interface CartAuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  lastUserCheck: number;
  forceUserSync: () => void;
}

const CartAuthContext = createContext<CartAuthContextType | undefined>(undefined);

export const useCartAuth = () => {
  const context = useContext(CartAuthContext);
  if (!context) {
    throw new Error('useCartAuth must be used within CartAuthProvider');
  }
  return context;
};

interface CartAuthProviderProps {
  children: ReactNode;
}

export const CartAuthProvider: React.FC<CartAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastUserCheck, setLastUserCheck] = useState(Date.now());

  // Fonction pour récupérer l'utilisateur depuis le localStorage
  const getUserFromStorage = (): User | null => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      console.log('👤 [CartAuthProvider] Utilisateur récupéré:', user);
      return user;
    } catch (error) {
      console.error('❌ [CartAuthProvider] Erreur parsing user:', error);
      return null;
    }
  };

  // Force la synchronisation des données utilisateur
  const forceUserSync = () => {
    console.log('🔄 [CartAuthProvider] Synchronisation forcée des données utilisateur');
    const user = getUserFromStorage();
    setCurrentUser(user);
    setLastUserCheck(Date.now());
    
    // Déclencher un événement global
    window.dispatchEvent(new CustomEvent('cart-user-sync', {
      detail: { user, timestamp: Date.now() }
    }));
  };

  // Surveillance continue des changements d'utilisateur
  useEffect(() => {
    // Charger l'utilisateur initial
    forceUserSync();

    // Surveiller les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'currentUser' || e.key === 'authToken') {
        console.log('📱 [CartAuthProvider] Changement localStorage détecté:', e.key);
        setTimeout(forceUserSync, 100); // Petit délai pour la synchronisation
      }
    };

    // Surveiller les événements d'authentification
    const handleAuthEvents = (e: CustomEvent) => {
      console.log('🔐 [CartAuthProvider] Événement auth détecté:', e.type);
      forceUserSync();
    };

    // Surveillance périodique pour détecter les changements non capturés
    const checkUserPeriodically = () => {
      const currentStoredUser = getUserFromStorage();
      const currentStoredId = currentStoredUser?.id;
      const contextUserId = currentUser?.id;
      
      if (String(currentStoredId) !== String(contextUserId)) {
        console.log('⚠️ [CartAuthProvider] Différence détectée lors du check périodique');
        console.log('   - Context:', contextUserId);
        console.log('   - Storage:', currentStoredId);
        forceUserSync();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-login', handleAuthEvents as EventListener);
    window.addEventListener('user-logout', handleAuthEvents as EventListener);
    window.addEventListener('auth-expired', handleAuthEvents as EventListener);

    // Check périodique toutes les 3 secondes
    const periodicCheck = setInterval(checkUserPeriodically, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-login', handleAuthEvents as EventListener);
      window.removeEventListener('user-logout', handleAuthEvents as EventListener);
      window.removeEventListener('auth-expired', handleAuthEvents as EventListener);
      clearInterval(periodicCheck);
    };
  }, [currentUser]);

  // Gestion des changements d'utilisateur pour nettoyer le panier
  const handleUserMismatch = () => {
    console.warn('🚨 [CartAuthProvider] Changement d\'utilisateur détecté - nettoyage nécessaire');
    
    // Déclencher les événements de nettoyage
    window.dispatchEvent(new CustomEvent('cart-clear-needed'));
    window.dispatchEvent(new CustomEvent('cart-user-changed', {
      detail: { newUser: currentUser }
    }));
  };

  const isAuthenticated = !!currentUser && !!localStorage.getItem('authToken');

  const contextValue: CartAuthContextType = {
    currentUser,
    isAuthenticated,
    lastUserCheck,
    forceUserSync
  };

  return (
    <CartAuthContext.Provider value={contextValue}>
      <CartUserGuard onUserMismatch={handleUserMismatch}>
        {children}
      </CartUserGuard>
    </CartAuthContext.Provider>
  );
};