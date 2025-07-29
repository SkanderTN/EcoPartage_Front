// frontend/src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import * as Components from './Components'; // Importe tous les styled-components

// Icônes simples pour les inputs (utilisées comme du texte pour la simplicité avec styled-components)
const Icon = ({ children }) => <Components.StyledIcon>{children}</Components.StyledIcon>;

function App() {
  const [signIn, toggle] = React.useState(true);

  // États pour le formulaire d'inscription
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [nameAsso, setNameAsso] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [nameCompany, setNameCompany] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureName, setProfilePictureName] = useState('Aucun fichier choisi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);

  // États pour les erreurs par champ
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    nameAsso: '',
    contactPhone: '',
    nameCompany: '',
    profilePicture: ''
  });

  // États pour le formulaire de connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInSuccess, setSignInSuccess] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  // États pour les erreurs par champ de connexion
  const [loginFieldErrors, setLoginFieldErrors] = useState({
    email: '',
    password: ''
  });

  const dropdownRef = useRef(null);

  const roleOptions = [
    { value: 'simple', label: 'Individuel', icon: '👤' },
    { value: 'association', label: 'Association', icon: '🏢' },
    { value: 'company', label: 'Société', icon: '🏭' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonctions de validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d+$/.test(phone);
  };

  // Validation d'un champ spécifique
  const validateField = (fieldName, value, currentRole = role) => {
    let error = '';
    
    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) error = 'Le prénom est obligatoire.';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Le nom est obligatoire.';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'L\'adresse email est obligatoire.';
        } else if (!validateEmail(value)) {
          error = 'Le format de l\'adresse email est invalide.';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Le mot de passe est obligatoire.';
        } else if (value.length < 6) {
          error = 'Le mot de passe doit contenir au moins 6 caractères.';
        }
        break;
      case 'role':
        if (!value) error = 'Veuillez sélectionner une activité.';
        break;
      case 'nameAsso':
        if (currentRole === 'association' && !value.trim()) {
          error = 'Le nom de l\'association est obligatoire.';
        }
        break;
      case 'nameCompany':
        if (currentRole === 'company' && !value.trim()) {
          error = 'Le nom de la société est obligatoire.';
        }
        break;
      case 'contactPhone':
        if ((currentRole === 'association' || currentRole === 'company')) {
          if (!value.trim()) {
            error = 'Le numéro de contact est obligatoire.';
          } else if (!validatePhone(value)) {
            error = 'Le numéro de contact doit contenir uniquement des chiffres.';
          }
        }
        break;
    }
    
    return error;
  };

  // Validation des champs de connexion
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
    }
    
    return error;
  };

  // Mettre à jour l'erreur d'un champ
  const updateFieldError = (fieldName, value, currentRole = role) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: validateField(fieldName, value, currentRole)
    }));
  };

  // Mettre à jour l'erreur d'un champ de connexion
  const updateLoginFieldError = (fieldName, value) => {
    setLoginFieldErrors(prev => ({
      ...prev,
      [fieldName]: validateLoginField(fieldName, value)
    }));
  };

  // Gestionnaires modifiés avec validation en temps réel
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    updateFieldError('firstName', value);
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    updateFieldError('lastName', value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    updateFieldError('email', value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    updateFieldError('password', value);
  };

  const handleNameAssoChange = (e) => {
    const value = e.target.value;
    setNameAsso(value);
    updateFieldError('nameAsso', value);
  };

  const handleNameCompanyChange = (e) => {
    const value = e.target.value;
    setNameCompany(value);
    updateFieldError('nameCompany', value);
  };

  const handleContactPhoneChange = (e) => {
    const value = e.target.value;
    setContactPhone(value);
    updateFieldError('contactPhone', value);
  };

  // Gestionnaires pour la connexion
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setProfilePictureName(file ? file.name : 'Aucun fichier choisi');
    
    // Vérifier la taille du fichier (10 Mo = 10 * 1024 * 1024 bytes)
    if (file && file.size > 10 * 1024 * 1024) {
      setFieldErrors(prev => ({
        ...prev,
        profilePicture: 'La taille de l\'image est trop grande. La taille maximale autorisée est de 10 Mo.'
      }));
    } else {
      // Effacer l'erreur si le fichier est valide
      setFieldErrors(prev => ({
        ...prev,
        profilePicture: ''
      }));
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setIsDropdownOpen(false);
    updateFieldError('role', selectedRole);
    
    // Revalider les champs conditionnels quand le rôle change
    if (selectedRole === 'association') {
      updateFieldError('nameAsso', nameAsso, selectedRole);
      updateFieldError('contactPhone', contactPhone, selectedRole);
    } else if (selectedRole === 'company') {
      updateFieldError('nameCompany', nameCompany, selectedRole);
      updateFieldError('contactPhone', contactPhone, selectedRole);
    }
  };

  // Gestionnaire de soumission pour l'inscription (simplifié)
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess('');
    setSignUpLoading(true);

    // Valider tous les champs
    const errors = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      email: validateField('email', email),
      password: validateField('password', password),
      role: validateField('role', role),
      nameAsso: validateField('nameAsso', nameAsso),
      nameCompany: validateField('nameCompany', nameCompany),
      contactPhone: validateField('contactPhone', contactPhone),
      profilePicture: fieldErrors.profilePicture // Conserver l'erreur actuelle de la photo
    };

    setFieldErrors(errors);

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setSignUpLoading(false);
      console.log('❌ Validation échouée - Erreurs dans le formulaire:', errors);
      return;
    }

    try {
      console.log('🚀 Début de l\'inscription utilisateur...');
      
      const formData = new FormData();
      const dto = {
        firstName,
        lastName,
        email,
        password,
        role,
        ...(role === 'association' && { nameAsso, contactPhone }),
        ...(role === 'company' && { nameCompany, contactPhone }),
      };
      
      formData.append('dto', JSON.stringify(dto));
      if (profilePicture) {
        console.log('📸 Image de profil ajoutée:', {
          name: profilePicture.name,
          size: `${(profilePicture.size / 1024 / 1024).toFixed(2)} Mo`,
          type: profilePicture.type
        });
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 413) {
        const errorMsg = 'La taille de l\'image est trop grande. La taille maximale autorisée est de 10 Mo.';
        setSignUpError(errorMsg);
        setFieldErrors(prev => ({
          ...prev,
          profilePicture: errorMsg
        }));
        setSignUpLoading(false);
        console.error('❌ Erreur 413: Fichier trop grand');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : 'Erreur lors de l\'enregistrement.';
        setSignUpError(errorMessage);
        console.error('❌ Erreur backend inscription:', {
          status: response.status,
          message: errorMessage,
          fullResponse: data
        });
        return;
      }

      console.log('✅ Utilisateur créé avec succès!');
      console.log('👤 Informations utilisateur:', {
        email: email,
        nom: `${firstName} ${lastName}`,
        role: role,
        ...(role === 'association' && { association: nameAsso }),
        ...(role === 'company' && { entreprise: nameCompany })
      });
      
      setSignUpSuccess('Enregistrement réussi ! Vous pouvez maintenant vous connecter.');
      
      // Réinitialiser le formulaire
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRole('');
      setNameAsso('');
      setContactPhone('');
      setNameCompany('');
      setProfilePicture(null);
      setProfilePictureName('Aucun fichier choisi');
      setFieldErrors({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        nameAsso: '',
        contactPhone: '',
        nameCompany: '',
        profilePicture: ''
      });
      
      console.log('🔄 Basculement vers le formulaire de connexion');
      toggle(true);

    } catch (err) {
      console.error('❌ Erreur réseau lors de l\'inscription:', err);
      setSignUpError('Erreur réseau ou autre problème lors de l\'inscription.');
    } finally {
      setSignUpLoading(false);
      console.log('🏁 Fin du processus d\'inscription');
    }
  };

  // Gestionnaire de soumission pour la connexion
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInSuccess('');
    setSignInLoading(true);

    // Valider les champs de connexion
    const errors = {
      email: validateLoginField('email', loginEmail),
      password: validateLoginField('password', loginPassword)
    };

    setLoginFieldErrors(errors);

    // Vérifier s'il y a des erreurs
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

  return(
    <Components.Container>
      {/* Conteneur du formulaire d'inscription */}
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form onSubmit={handleSignUpSubmit}>
          <Components.Title>Créer un compte</Components.Title>
          
          <Components.InputWrapper>
            <Icon>👤</Icon>
            <Components.Input 
              type='text' 
              placeholder='Prénom' 
              value={firstName} 
              onChange={handleFirstNameChange}
              // L'attribut 'required' est géré par la validation côté client
            />
          </Components.InputWrapper>
          {fieldErrors.firstName && <Components.ErrorMessage>{fieldErrors.firstName}</Components.ErrorMessage>}
          
          <Components.InputWrapper>
            <Icon>👤</Icon>
            <Components.Input 
              type='text' 
              placeholder='Nom' 
              value={lastName} 
              onChange={handleLastNameChange}
              // L'attribut 'required' est géré par la validation côté client
            />
          </Components.InputWrapper>
          {fieldErrors.lastName && <Components.ErrorMessage>{fieldErrors.lastName}</Components.ErrorMessage>}
          
          <Components.InputWrapper>
            <Icon>✉️</Icon>
            <Components.Input 
              type='email' 
              placeholder='Adresse email' 
              value={email} 
              onChange={handleEmailChange}
              // L'attribut 'required' est géré par la validation côté client
            />
          </Components.InputWrapper>
          {fieldErrors.email && <Components.ErrorMessage>{fieldErrors.email}</Components.ErrorMessage>}
          
          <Components.InputWrapper>
            <Icon>🔒</Icon>
            <Components.Input 
              type='password' 
              placeholder='Mot de passe' 
              value={password} 
              onChange={handlePasswordChange}
              // L'attribut 'required' est géré par la validation côté client
            />
          </Components.InputWrapper>
          {fieldErrors.password && <Components.ErrorMessage>{fieldErrors.password}</Components.ErrorMessage>}
          
          <Components.InputWrapper>
            <Components.FileButton htmlFor="profilePictureInput">Choisier un fichier</Components.FileButton>
            <Components.Input 
              type='file' 
              id="profilePictureInput"
              onChange={handleProfilePictureChange}
              accept="image/*"
            />
            <Components.FileNameDisplay>{profilePictureName}</Components.FileNameDisplay>
          </Components.InputWrapper>
          {fieldErrors.profilePicture && <Components.ErrorMessage>{fieldErrors.profilePicture}</Components.ErrorMessage>}
          
          <Components.DropdownContainer ref={dropdownRef}>
            <Icon>💼</Icon>
            <Components.DropdownButton 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              isOpen={isDropdownOpen}
              hasValue={role !== ''}
            >
              <span>{role ? roleOptions.find(option => option.value === role)?.label : 'Activité'}</span>
              <Components.DropdownArrow isOpen={isDropdownOpen}>▼</Components.DropdownArrow>
            </Components.DropdownButton>
            
            {isDropdownOpen && (
              <Components.DropdownMenu>
                {roleOptions.map((option) => (
                  <Components.DropdownOption
                    key={option.value}
                    onClick={() => handleRoleSelect(option.value)}
                    isSelected={role === option.value}
                  >
                    <Components.OptionIcon>{option.icon}</Components.OptionIcon>
                    <Components.OptionText>{option.label}</Components.OptionText>
                  </Components.DropdownOption>
                ))}
              </Components.DropdownMenu>
            )}
          </Components.DropdownContainer>
          {fieldErrors.role && <Components.ErrorMessage>{fieldErrors.role}</Components.ErrorMessage>}

          {/* Champs spécifiques au rôle "Association" */}
          {role === 'association' && (
            <>
              <Components.InputWrapper>
                <Icon>🏢</Icon>
                <Components.Input 
                  type='text' 
                  placeholder="Nom de l'association" 
                  value={nameAsso} 
                  onChange={handleNameAssoChange}
                  // L'attribut 'required' est géré par la validation côté client
                />
              </Components.InputWrapper>
              {fieldErrors.nameAsso && <Components.ErrorMessage>{fieldErrors.nameAsso}</Components.ErrorMessage>}
              
              <Components.InputWrapper>
                <Icon>📞</Icon>
                <Components.Input 
                  type='tel' 
                  placeholder='Numéro de contact' 
                  value={contactPhone} 
                  onChange={handleContactPhoneChange}
                  // L'attribut 'required' est géré par la validation côté client
                />
              </Components.InputWrapper>
              {fieldErrors.contactPhone && <Components.ErrorMessage>{fieldErrors.contactPhone}</Components.ErrorMessage>}
            </>
          )}

          {/* Champs spécifiques au rôle "Société" */}
          {role === 'company' && (
            <>
              <Components.InputWrapper>
                <Icon>🏢</Icon>
                <Components.Input 
                  type='text' 
                  placeholder="Nom de la société" 
                  value={nameCompany} 
                  onChange={handleNameCompanyChange}
                  // L'attribut 'required' est géré par la validation côté client
                />
              </Components.InputWrapper>
              {fieldErrors.nameCompany && <Components.ErrorMessage>{fieldErrors.nameCompany}</Components.ErrorMessage>}
              
              <Components.InputWrapper>
                <Icon>📞</Icon>
                <Components.Input 
                  type='tel' 
                  placeholder='Numéro de contact' 
                  value={contactPhone} 
                  onChange={handleContactPhoneChange}
                  // L'attribut 'required' est géré par la validation côté client
                />
              </Components.InputWrapper>
              {fieldErrors.contactPhone && <Components.ErrorMessage>{fieldErrors.contactPhone}</Components.ErrorMessage>}
            </>
          )}

          <Components.Button type="submit" disabled={signUpLoading}>
            {signUpLoading ? 'Inscription en cours...' : "S'inscrire"}
          </Components.Button>
          {signUpError && <Components.ErrorMessage>{signUpError}</Components.ErrorMessage>}
          {signUpSuccess && <Components.SuccessMessage>{signUpSuccess}</Components.SuccessMessage>}
        </Components.Form>
      </Components.SignUpContainer>

      {/* Conteneur du formulaire de connexion */}
      <Components.SignInContainer signinIn={signIn}>
        <Components.Form onSubmit={handleSignInSubmit}>
          <Components.Title>Se connecter</Components.Title>
          
          <Components.InputWrapper>
            <Icon>✉️</Icon>
            <Components.Input 
              type='email' 
              placeholder='Adresse email' 
              value={loginEmail} 
              onChange={handleLoginEmailChange}
              // L'attribut 'required' est géré par la validation côté client
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
              // L'attribut 'required' est géré par la validation côté client
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

      {/* Conteneur de l'overlay */}
      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            {/* Utilisation des composants de logo définis dans Components.jsx */}
            <Components.OverlayLogoContainer>
            <Components.LogoImage src="https://res.cloudinary.com/dtryy9qlp/image/upload/v1753698884/logo-removebg_np2rko.png" alt="ÉcoPartage Logo" />
            </Components.OverlayLogoContainer>
            <Components.Title>Bienvenue de nouveau !</Components.Title>
            <Components.Paragraph>
              Pour rester connecté avec nous, veuillez vous connecter avec vos informations personnelles.
            </Components.Paragraph>
            <Components.GhostButton onClick={() => { 
              toggle(true); 
              setSignUpSuccess(''); 
              setSignUpError(''); 
              setSignInError(''); 
              setSignInSuccess('');
              setFieldErrors({
                firstName: '', lastName: '', email: '', password: '', 
                role: '', nameAsso: '', contactPhone: '', nameCompany: '', profilePicture: ''
              });
              setLoginFieldErrors({ email: '', password: '' });
            }}>
              Se connecter
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>

            {/* Utilisation des composants de logo définis dans Components.jsx */}
          <Components.LogoContainer>
            <Components.LogoImage src="https://res.cloudinary.com/dtryy9qlp/image/upload/v1753698884/logo-removebg_np2rko.png" alt="ÉcoPartage Logo" />
          </Components.LogoContainer>

            {/* Retypé la ligne pour éviter les problèmes de parseur */}
            <Components.Title>Bonjour, ami(e) !</Components.Title> 
            <Components.Paragraph>
              Entrez vos informations personnelles et commencez votre aventure avec nous.
            </Components.Paragraph>
            <Components.GhostButton onClick={() => { 
              toggle(false); 
              setSignUpSuccess(''); 
              setSignUpError(''); 
              setSignInError(''); 
              setSignInSuccess('');
              setFieldErrors({
                firstName: '', lastName: '', email: '', password: '', 
                role: '', nameAsso: '', contactPhone: '', nameCompany: '', profilePicture: ''
              });
              setLoginFieldErrors({ email: '', password: '' });
            }}>
              S'inscrire
            </Components.GhostButton>
          </Components.RightOverlayPanel>
          
        </Components.Overlay>
      </Components.OverlayContainer>

    </Components.Container>
  )
}

export default App;
