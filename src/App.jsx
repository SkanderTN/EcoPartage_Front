// src/App.jsx
import React, { useState } from "react";
import LoginPage from './features/authentification/pages/LoginPage';
import SignUpPage from './features/authentification/pages/SignUpPage';
// import Chat from './Chat'; // Assumant que Chat.jsx reste dans src/
import * as Components from './features/authentification/components'; // Pour les composants d'overlay

function App() {
  const [signIn, toggle] = useState(true); // Gère l'état de bascule entre Sign In et Sign Up
  const [loggedInUser, setLoggedInUser] = useState(null); // Stocke les informations de l'utilisateur connecté

  // Fonction appelée après une connexion réussie
  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    // Réinitialise les messages d'erreur/succès des formulaires d'auth
    // (Les états sont gérés dans LoginPage/SignUpPage, donc pas besoin ici)
  };

  // Fonction appelée après une inscription réussie
  const handleSignUpSuccess = () => {
    // Après une inscription réussie, bascule vers le formulaire de connexion
    toggle(true);
    // Réinitialise les messages d'erreur/succès des formulaires d'auth
    // (Les états sont gérés dans LoginPage/SignUpPage, donc pas besoin ici)
  };

  // Fonction de déconnexion (pour l'exemple)
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setLoggedInUser(null);
    toggle(true); // Revenir à la page de connexion
  };

  return (
    <Components.Container>
      {/* {loggedInUser ? (
        // Si l'utilisateur est connecté, affiche le chat
        <>
          <Chat 
            currentUserId={loggedInUser.id} 
            targetUserId="vendeur123" // ID de l'utilisateur avec qui chatter (ex: un vendeur)
          />
          <Components.Button onClick={handleLogout} style={{ marginTop: '20px' }}>
            Déconnexion
          </Components.Button>
        </>
      ) : ( */}
        {/* // Sinon, affiche les formulaires d'authentification */}
        <>
          {/* Passage de la prop signinIn aux pages */}
          {signIn ? (
            <LoginPage onLoginSuccess={handleLoginSuccess} signinIn={signIn} />
          ) : (
            <SignUpPage onSignUpSuccess={handleSignUpSuccess} signinIn={signIn} />
          )}

          {/* Conteneur de l'overlay (panneaux coulissants) */}
          <Components.OverlayContainer signinIn={signIn}>
            <Components.Overlay signinIn={signIn}>

              {/* Panneau gauche de l'overlay (pour le bouton Sign In) */}
              <Components.LeftOverlayPanel signinIn={signIn}>
                <Components.OverlayLogoContainer>
                  <Components.LogoImage src="https://res.cloudinary.com/dtryy9qlp/image/upload/v1753698884/logo-removebg_np2rko.png" alt="ÉcoPartage Logo" />
                </Components.OverlayLogoContainer>
                <Components.Title>Bienvenue de nouveau !</Components.Title>
                <Components.Paragraph>
                  Pour rester connecté avec nous, veuillez vous connecter avec vos informations personnelles.
                </Components.Paragraph>
                <Components.GhostButton onClick={() => { 
                  toggle(true); 
                }}>
                  Se connecter
                </Components.GhostButton>
              </Components.LeftOverlayPanel>

              {/* Panneau droit de l'overlay (pour le bouton Sign Up) */}
              <Components.RightOverlayPanel signinIn={signIn}>
                <Components.OverlayLogoContainer>
                  <Components.LogoImage src="https://res.cloudinary.com/dtryy9qlp/image/upload/v1753698884/logo-removebg_np2rko.png" alt="ÉcoPartage Logo" />
                </Components.OverlayLogoContainer>
                <Components.Title>Bonjour, ami(e) !</Components.Title> 
                <Components.Paragraph>
                  Entrez vos informations personnelles et commencez votre aventure avec nous.
                </Components.Paragraph>
                <Components.GhostButton onClick={() => { 
                  toggle(false); 
                }}>
                  S'inscrire
                </Components.GhostButton>
              </Components.RightOverlayPanel>
              
            </Components.Overlay>
          </Components.OverlayContainer>
        </>
    </Components.Container>
  )
}

export default App;
