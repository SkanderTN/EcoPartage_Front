// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./features/authentification/hooks/useAuth";
import { ProtectedRoute, PublicRoute } from "./components/guards/RouteGuards";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from './pages/AboutPage';
import PostDetailPage from "./features/posts/pages/PostsDetailPage";
import CreatePostPage from "./features/posts/pages/CreatePostPage";

// Pages de profil
import { ProfilePage, EditProfilePage } from "./features/profile/pages";

// Composants
import Layout from "./components/layout/Layout";
import AuthRoutes from "./features/authentification/components/AuthRoutes";
import "./App.css";
import { CartPage } from "./features/cart/pages/CartPage";

function App() {
  const {
    signIn,
    loggedInUser,
    isAuthChecking,
    handleLoginSuccess,
    handleSignUpSuccess,
    handleSignInToggle,
  } = useAuth();

  // 🔹 Affichage du loader pendant l'initialisation
  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 🔹 Routes publiques (non connecté) */}
        <Route 
          path="/auth/*" 
          element={
            <PublicRoute>
              <AuthRoutes
                signIn={signIn}
                onSignInToggle={handleSignInToggle}
                onLoginSuccess={handleLoginSuccess}
                onSignUpSuccess={handleSignUpSuccess}
              />
            </PublicRoute>
          } 
        />

        {/* 🔹 Routes privées (connecté) */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        <Route element={<Layout />}>
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            } 
          />

<Route 
            path="/posts/create" 
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/posts/:id" 
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 🔹 Routes de profil */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* 🔹 Redirections */}
        <Route 
          path="/" 
          element={
            loggedInUser ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />

        {/* 🔹 Route 404 - Redirection selon l'état de connexion */}
        <Route 
          path="*" 
          element={
            loggedInUser ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;