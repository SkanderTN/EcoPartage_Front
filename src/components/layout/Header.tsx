// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/authentification/hooks/useAuth";
import Logo from "../../assets/LOGO_BLACK.png";
import { CartIcon } from "../../features/cart/components";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { loggedInUser, handleLogout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(loggedInUser);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Écouter les mises à jour du profil utilisateur
  useEffect(() => {
    const handleUserUpdate = (event: CustomEvent) => {
      console.log("Header: Mise à jour du profil reçue", event.detail);
      setCurrentUser(event.detail);
    };

    const handleAuthChange = (event: CustomEvent) => {
      console.log("Header: Changement d'authentification", event.detail);
      setCurrentUser(event.detail);
    };

    // Écouter les événements de mise à jour
    window.addEventListener('user-profile-updated', handleUserUpdate as EventListener);
    window.addEventListener('auth-changed', handleAuthChange as EventListener);
    
    return () => {
      window.removeEventListener('user-profile-updated', handleUserUpdate as EventListener);
      window.removeEventListener('auth-changed', handleAuthChange as EventListener);
    };
  }, []);

  // Mettre à jour l'utilisateur courant quand loggedInUser change
  useEffect(() => {
    setCurrentUser(loggedInUser);
  }, [loggedInUser]);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsProfileMenuOpen(false);
    // Rediriger vers la page d'authentification après déconnexion
    navigate("/auth", { replace: true });
  };

  // Obtenir les initiales de l'utilisateur pour l'avatar
  const getInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "Utilisateur";
  };

  // Utiliser currentUser au lieu de loggedInUser pour les affichages
  const userToDisplay = currentUser || loggedInUser;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="EcoPartage" className="h-10 w-10 mr-3" />
            <span className="font-bold text-xl text-gray-900">ÉcoPartage</span>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center space-x-12">
            <a
              href="/"
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
              style={{ fontFamily: "Crimson Text, serif" }}
            >
              Accueil
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-gray-900 font-medium text-lg transition-colors"
              style={{ fontFamily: "Crimson Text, serif" }}
            >
              À propos
            </a>
          </nav>

          {/* Actions à droite */}
          <div className="flex items-center space-x-6">
            {/* Intégration du CartIcon */}
            <CartIcon
              className="hover:bg-gray-100 rounded-lg p-2"
              onClick={() => navigate("/cart")}
              showBadge={true}
            />
            
            {/* Menu profil utilisateur */}
            {userToDisplay ? (
              <div className="relative" ref={profileMenuRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  {/* Avatar utilisateur */}
                  {userToDisplay.profilePicture ? (
                    <img
                      src={userToDisplay.profilePicture}
                      alt="Photo de profil"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        // En cas d'erreur de chargement, afficher les initiales
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback avec initiales */}
                  <div 
                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
                    style={{ display: userToDisplay.profilePicture ? 'none' : 'flex' }}
                  >
                    <span className="text-sm font-semibold text-gray-600">
                      {getInitials(userToDisplay)}
                    </span>
                  </div>
                  
                  <span className="hidden sm:block text-gray-700">
                    {getDisplayName(userToDisplay)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>

                {/* Menu déroulant */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Mon profil
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-700" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-800 text-center text-gray-400"></div>
    </header>
  );
};

export default Header;