// src/features/authentification/hooks/useAuth.ts - Version corrigée
import { useState, useEffect, useRef } from "react";
import { User } from "../../../types/index";

export const useAuth = () => {
  const [signIn, setSignIn] = useState<boolean>(true);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  
  // Utiliser useRef pour éviter les appels multiples
  const hasCheckedAuth = useRef(false);

  // ⭐ CORRECTION 11: Fonction pour sauvegarder l'utilisateur de manière cohérente
  const saveUserData = (userData: User) => {
    console.log("💾 [useAuth] Sauvegarde des données utilisateur:", userData);
    
    // Sauvegarder dans plusieurs clés pour la compatibilité
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    
    if (userData.token) {
      localStorage.setItem("authToken", userData.token);
    }
    
    // Déclencher des événements pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('user-changed', { detail: userData }));
    window.dispatchEvent(new CustomEvent('login', { detail: userData }));
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: userData }));
  };

  // ⭐ CORRECTION 12: Fonction pour nettoyer les données utilisateur
  const clearUserData = () => {
    console.log("🧹 [useAuth] Nettoyage des données utilisateur");
    
    // Nettoyer toutes les clés possibles
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedInUser");
    
    // Déclencher des événements
    window.dispatchEvent(new CustomEvent('logout'));
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: null }));
  };

  // Effet pour vérifier le jeton d'authentification au montage du composant
  useEffect(() => {
    // Éviter les appels multiples
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuthToken = async () => {
      const storedToken = localStorage.getItem("authToken");
      
      if (!storedToken) {
        console.log("Aucun jeton d'authentification trouvé dans localStorage");
        setIsAuthChecking(false);
        return;
      }

      try {
        console.log("Jeton d'authentification trouvé dans localStorage. Tentative de reconnexion...");
        
        // Effectuer un appel API pour valider le jeton et obtenir les détails de l'utilisateur
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/protected`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.user) {
          // Si la réponse est OK et contient des données utilisateur
          const userData: User = {
            id: data.user.userId || data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            role: data.user.role,
            token: storedToken,
            profilePicture: data.user.profilePicture || null, // Ajouter profilePicture
          };
          
          setLoggedInUser(userData);
          
          // ⭐ CORRECTION 13: Sauvegarder les données de manière cohérente
          saveUserData(userData);
          
          console.log("Utilisateur reconnecté avec succès à partir du jeton stocké.");
        } else {
          throw new Error("Données utilisateur invalides");
        }
        
      } catch (error) {
        console.error("Erreur lors de la reconnexion à partir du jeton stocké:", error);
        // Si le jeton est invalide ou expiré, le supprimer
        clearUserData();
        setLoggedInUser(null);
      } finally {
        // Indiquer que la vérification initiale est terminée
        setIsAuthChecking(false);
      }
    };

    checkAuthToken();
  }, []); // Le tableau de dépendances vide signifie que cet effet s'exécute une seule fois au montage

  const handleLoginSuccess = (userData: User) => {
    console.log("🎉 Connexion réussie pour:", userData.email);
    setLoggedInUser(userData);
    
    // ⭐ CORRECTION 14: Utiliser la fonction de sauvegarde cohérente
    saveUserData(userData);
  };

  const handleSignUpSuccess = (userData?: User) => {
    console.log("🎉 Inscription réussie");
    if (userData) {
      // Si nous recevons les données utilisateur après inscription, les utiliser
      setLoggedInUser(userData);
      saveUserData(userData);
    } else {
      // Sinon, basculer vers la page de connexion
      setSignIn(true);
    }
  };

  const handleLogout = () => {
    console.log("👋 Déconnexion de l'utilisateur");
    clearUserData();
    setLoggedInUser(null);
    setSignIn(true);
    
    // ⭐ NOUVEAU: Rediriger immédiatement vers la page d'authentification
    // On utilise window.location.href pour forcer une redirection complète
    setTimeout(() => {
      window.location.href = '/auth';
    }, 100); // Petit délai pour laisser le temps aux événements de se propager
  };

  const handleSignInToggle = () => {
    setSignIn(prev => !prev);
  };

  // Ajouter cette fonction dans votre useAuth existant :
  const updateUserProfile = (updatedProfile: any) => {
    if (loggedInUser) {
      const updatedUser = { ...loggedInUser, ...updatedProfile };
      setLoggedInUser(updatedUser);
      saveUserData(updatedUser);
    }
  };

  // Ajouter un listener pour les mises à jour du profil
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      updateUserProfile(event.detail);
    };

    window.addEventListener('user-profile-updated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate as EventListener);
    };
  }, [loggedInUser]);

  return {
    signIn,
    loggedInUser,
    handleLoginSuccess,
    handleSignUpSuccess,
    handleLogout,
    handleSignInToggle,
    isAuthChecking,
  };
};