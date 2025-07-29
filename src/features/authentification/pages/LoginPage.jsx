// src/features/authentification/pages/LoginPage.jsx
import React, { useState } from "react";
import * as Components from '../../authentification/components'; // Importation ajustée

// Icônes simples pour les inputs
const Icon = ({ children }) => <Components.StyledIcon>{children}</Components.StyledIcon>;

const LoginPage = ({ onLoginSuccess, signinIn }) => { // Accepte la prop signinIn
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInSuccess, setSignInSuccess] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  const [loginFieldErrors, setLoginFieldErrors] = useState({
    email: '',
    password: ''
  });

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateLoginField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          error = 'L\'adresse email est obligatoire.';
        } else if (!validateEmail(value)) {
          error = 'Le format de l\'adresse email est invalide.';
        }
        break;
      case 'password':
        if (!value) error = 'Le mot de passe est obligatoire.';
        break;
      default:
        break;
    }
    return error;
  };

  const updateLoginFieldError = (fieldName, value) => {
    setLoginFieldErrors(prev => ({
      ...prev,
      [fieldName]: validateLoginField(fieldName, value)
    }));
  };

  const handleLoginEmailChange = (e) => {
    const value = e.target.value;
    setLoginEmail(value);
    updateLoginFieldError('email', value);
  };

  const handleLoginPasswordChange = (e) => {
    const value = e.target.value;
    setLoginPassword(value);
    updateLoginFieldError('password', value);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInSuccess('');
    setSignInLoading(true);

    const errors = {
      email: validateLoginField('email', loginEmail),
      password: validateLoginField('password', loginPassword)
    };

    setLoginFieldErrors(errors);

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setSignInLoading(false);
      return;
    }

    try {
      console.log('🔐 Début de la connexion utilisateur...');
      console.log('📧 Email de connexion:', loginEmail);
      
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Identifiants invalides.';
        setSignInError(errorMessage);
        console.error('❌ Erreur de connexion:', {
          status: response.status,
          message: errorMessage,
          fullResponse: data
        });
        return;
      }

      setSignInSuccess('Connexion réussie !');
      console.log('🎫 Token d\'authentification reçu');
      console.log('👤 Utilisateur maintenant connecté:', loginEmail);
      
      localStorage.setItem('authToken', data.access_token);
      
      if (onLoginSuccess) {
        onLoginSuccess({ id: loginEmail, email: loginEmail }); 
      }

      console.log('💾 Token sauvegardé dans localStorage');
      console.log('🚀 L\'utilisateur peut maintenant accéder aux fonctionnalités protégées');

    } catch (err) {
      console.error('❌ Erreur réseau lors de la connexion:', err);
      setSignInError('Erreur réseau ou autre problème lors de la connexion.');
    } finally {
      setSignInLoading(false);
      console.log('🏁 Fin du processus de connexion');
    }
  };

  return (
    // Transmet la prop signinIn au conteneur Styled Component
    <Components.SignInContainer signinIn={signinIn}> 
      <Components.Form onSubmit={handleSignInSubmit}>
        <Components.Title>Se connecter</Components.Title>
        
        <Components.InputWrapper>
          <Icon>✉️</Icon>
          <Components.Input 
            type='email' 
            placeholder='Adresse email' 
            value={loginEmail} 
            onChange={handleLoginEmailChange}
          />
        </Components.InputWrapper>
        {loginFieldErrors.email && <Components.ErrorMessage>{loginFieldErrors.email}</Components.ErrorMessage>}
        
        <Components.InputWrapper>
          <Icon>🔒</Icon>
          <Components.Input 
            type='password' 
            placeholder='Mot de passe' 
            value={loginPassword} 
            onChange={handleLoginPasswordChange}
          />
        </Components.InputWrapper>
        {loginFieldErrors.password && <Components.ErrorMessage>{loginFieldErrors.password}</Components.ErrorMessage>}
        
        <Components.Anchor href='#'>Mot de passe oublié ?</Components.Anchor>
        <Components.Button type="submit" disabled={signInLoading}>
          {signInLoading ? 'Connexion en cours...' : "Se connecter"}
        </Components.Button>
        {signInError && <Components.ErrorMessage>{signInError}</Components.ErrorMessage>}
        {signInSuccess && <Components.SuccessMessage>{signInSuccess}</Components.SuccessMessage>}
      </Components.Form>
    </Components.SignInContainer>
  );
};

export default LoginPage;
