// src/features/cart/components/CartUserGuard.tsx
import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface CartUserGuardProps {
  children: React.ReactNode;
  onUserMismatch?: () => void;
}

interface UserInfo {
  id: string | number;
  name: string;
  email?: string;
}

// Fonction pour récupérer l'utilisateur courant
const getCurrentUser = (): UserInfo | null => {
  try {
    const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const CartUserGuard: React.FC<CartUserGuardProps> = ({ 
  children, 
  onUserMismatch 
}) => {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(getCurrentUser());
  const [lastUser, setLastUser] = useState<UserInfo | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Surveiller les changements d'utilisateur
  useEffect(() => {
    const checkUserChange = () => {
      const newUser = getCurrentUser();
      
      console.log('🔍 [CartUserGuard] Vérification utilisateur:', {
        previous: lastUser,
        current: newUser
      });

      // Si un utilisateur était connecté et maintenant c'est différent
      if (lastUser && newUser && String(lastUser.id) !== String(newUser.id)) {
        console.warn('⚠️ [CartUserGuard] Changement d\'utilisateur détecté!');
        console.warn('   - Ancien:', lastUser);
        console.warn('   - Nouveau:', newUser);
        
        setShowWarning(true);
        onUserMismatch?.();
        
        // Déclencher un événement global pour notifier tous les composants
        window.dispatchEvent(new CustomEvent('user-changed', {
          detail: { previousUser: lastUser, newUser }
        }));

        // Nettoyer le panier local potentiellement incorrect
        window.dispatchEvent(new CustomEvent('cart-clear-needed'));
      }

      setCurrentUser(newUser);
      setLastUser(newUser);
    };

    // Vérifier immédiatement
    checkUserChange();

    // Surveiller les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'currentUser' || e.key === 'authToken') {
        console.log('📱 [CartUserGuard] Storage change détecté:', e.key);
        setTimeout(checkUserChange, 100); // Petit délai pour s'assurer que les données sont à jour
      }
    };

    // Surveiller les événements personnalisés
    const handleCustomUserChange = () => {
      checkUserChange();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-login', handleCustomUserChange);
    window.addEventListener('user-logout', handleCustomUserChange);

    // Vérifier périodiquement (au cas où)
    const interval = setInterval(checkUserChange, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-login', handleCustomUserChange);
      window.removeEventListener('user-logout', handleCustomUserChange);
      clearInterval(interval);
    };
  }, [lastUser, onUserMismatch]);

  // Composant d'avertissement
  const WarningBanner = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <div className="font-medium">Changement d'utilisateur détecté</div>
            <div className="text-sm opacity-90">
              Le panier est en cours de synchronisation pour {currentUser?.name}...
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setShowWarning(false);
            window.location.reload(); // Force reload pour être sûr
          }}
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showWarning && <WarningBanner />}
      <div className={showWarning ? 'pt-16' : ''}>
        {children}
      </div>
    </>
  );
};