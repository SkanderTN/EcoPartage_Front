// src/components/guards/RouteGuards.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/authentification/hooks/useAuth";

// 🔹 Composant pour protéger les routes privées
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedInUser, isAuthChecking } = useAuth();
  
  // Attendre que l'authentification soit résolue
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Vérification de l'authentification...</div>
      </div>
    );
  }
  
  if (!loggedInUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// 🔹 Composant pour rediriger si déjà connecté
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedInUser, isAuthChecking } = useAuth();
  
  // Attendre que l'authentification soit résolue
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Vérification de l'authentification...</div>
      </div>
    );
  }
  
  if (loggedInUser) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};