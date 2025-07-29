// frontend/src/Components.jsx
import styled from 'styled-components';
// La fonction defaultShouldForwardProp sera passée comme second argument à customShouldForwardProp

// Liste des props à ne PAS transmettre aux éléments DOM natifs
const transientProps = new Set(['signinIn', 'isOpen', 'hasValue', 'isSelected']);

// Fonction utilitaire pour filtrer les props
// Le second argument, defaultShouldForwardProp, est fourni par styled-components
const customShouldForwardProp = (prop, defaultShouldForwardProp) => {
  // Si defaultShouldForwardProp n'est pas une fonction (e.g., undefined),
  // on se base uniquement sur notre liste transientProps.
  // Cela gérera les cas où styled-components ne passe pas le second argument.
  if (typeof defaultShouldForwardProp !== 'function') {
    return !transientProps.has(prop);
  }
  return !transientProps.has(prop) && defaultShouldForwardProp(prop);
};

// Le conteneur principal de l'application d'authentification
export const Container = styled.div.withConfig({ // <--- Assurez-vous que c'est bien appliqué ici
  shouldForwardProp: customShouldForwardProp,
})`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 800px; /* AUGMENTÉ */
  max-width: 100%;
  min-height: 550px; /* AUGMENTÉ */
`;

// Conteneur pour le formulaire d'inscription
export const SignUpContainer = styled.div.withConfig({
  shouldForwardProp: customShouldForwardProp, // Applique le filtre de props
})`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  ` : null}
`;

// Conteneur pour le formulaire de connexion
export const SignInContainer = styled.div.withConfig({
  shouldForwardProp: customShouldForwardProp, // Applique le filtre de props
})`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;

// Le formulaire lui-même
export const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

// Titre des formulaires et des panneaux d'overlay
export const Title = styled.h1`
  font-weight: bold;
  margin: 0; 
  color: #333; /* Couleur du titre pour les formulaires */
`;

// Wrapper pour les inputs avec icônes
export const InputWrapper = styled.div`
  position: relative;
  width: 100%; /* Prend toute la largeur disponible dans le formulaire */
  margin: 8px 0;
  display: flex; /* Permet d'aligner l'icône et l'input */
  align-items: center; /* Centre verticalement */
  background-color: #f0f0f0; /* Couleur de fond légèrement grise */
  border: 1px solid #ccc; /* AJOUTÉ: Bordure légère */
  border-radius: 8px; /* Coins légèrement arrondis */
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1); /* Ombre interne subtile */
  transition: all 0.3s ease;

  &:focus-within { /* Applique le style de focus quand un élément à l'intérieur est focus */
    box-shadow: 0 0 0 2px rgba(165, 194, 192, 0.5); /* Anneau de focus */
    border-color: #A5C2C0; /* AJOUTÉ: Couleur de bordure au focus */
  }
`;

// Champ de saisie générique
export const Input = styled.input`
  background-color: transparent; /* Transparent pour laisser le background de InputWrapper */
  border: none;
  padding: 10px 15px 10px 0px; /* Ajusté pour l'icône dans InputWrapper */
  width: 100%;
  color: #333; /* Couleur du texte */
  font-size: 14px; /* Taille de police uniforme */

  &:focus {
    outline: none;
  }

  /* Style spécifique pour le type file - le cacher et styliser le bouton */
  &[type="file"] {
    position: absolute; /* Positionne l'input file en absolu */
    width: 1px; /* Le rend très petit */
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

// Champ de sélection (pour "Activité") - Ceci est l'ancien Select, il sera remplacé par le Dropdown personnalisé
export const Select = styled.select`
  background-color: transparent; /* Transparent pour laisser le background de InputWrapper */
  border: none;
  padding: 10px 40px 10px 0px; /* AJUSTÉ: padding-right pour la flèche, padding-left à 0 car l'icône est dans InputWrapper */
  border-radius: 8px; /* Coins légèrement arrondis */
  width: 100%;
  appearance: none; /* Supprime le style par default de la flèche */
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  font-size: 14px; /* Taille de police uniforme */
  
  &:focus {
    outline: none;
  }

  /* Style conditionnel pour la couleur du texte du select */
  color: ${props => props.value === '' ? '#939393' : '#333'}; /* Gris plus clair pour le placeholder */

  /* Style pour les options (limité pour les selects natifs) */
  option {
    color: #333; /* Couleur du texte des options */
    background-color: #fff; /* Fond blanc pour les options */
  }
`;

// Icône positionnée à l'intérieur de l'inputWrapper (pour les icônes de gauche)
export const StyledIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Largeur fixe pour l'icône */
  height: 100%;
  color: #999; /* Couleur de l'icône */
  font-size: 16px; /* Taille de l'icône */
  flex-shrink: 0; /* Empêche l'icône de rétrécir */
`;

// Nouvelle icône de flèche pour le select
export const SelectArrowIcon = styled.span`
  position: absolute; /* Positionne l'icône de flèche */
  right: 15px; /* À droite de l'input */
  top: 50%;
  transform: translateY(-50%) ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}; /* Rotation basée sur la prop */
  color: #999;
  font-size: 16px;
  pointer-events: none; /* Permet de cliquer sur le select en dessous */
  transition: transform 0.3s ease; /* Animation de rotation */
`;

// Nouveau composant pour le bouton "Choisir un fichier"
export const FileButton = styled.label`
  background-color: #A5C2C0; /* Couleur du bouton du sélecteur de fichier */
  color: white;
  border: none;
  padding: 6px 10px; /* RÉDUIT: padding pour rendre le bouton plus petit */
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* Espace entre le bouton et le nom du fichier */
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  transition: background-color 0.3s ease;
  flex-shrink: 0; /* Empêche le bouton de rétrécir */
  font-size: 12px; /* RÉDUIT: Taille de police du bouton */

  &:hover {
    background-color: #7C9A98;
  }
`;

// Nouveau composant pour afficher le nom du fichier
export const FileNameDisplay = styled.span`
  font-size: 12px; /* RÉDUIT: Taille de police pour correspondre au bouton et aux placeholders */
  color: #666;
  flex-grow: 1; /* Permet au nom du fichier de prendre l'espace restant */
  text-align: left;
  padding-right: 15px; /* Padding à droite pour le texte */
  white-space: nowrap; /* Empêche le texte de se casser sur plusieurs lignes */
  overflow: hidden; /* Cache le texte qui dépasse */
  text-overflow: ellipsis; /* Ajoute des points de suspension si le texte est trop long */
`;


// Bouton principal (couleur verte/bleue comme dans l'image)
export const Button = styled.button`
  border-radius: 8px; /* Coins légèrement arrondis pour les boutons */
  border: 1px solid #7C9A98; /* Couleur de bordure plus foncée */
  background-color: #A5C2C0; /* Couleur de fond principale du bouton */
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in, background-color 0.3s ease;
  margin-top: 20px; /* Espacement au-dessus du bouton */
  width: 100%; /* Le bouton prend toute la largeur du formulaire */
  max-width: 200px; /* Limite la largeur du bouton comme dans l'image */

  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #7C9A98; /* Assombrir au survol */
  }
  &:disabled { /* Style pour le bouton désactivé */
    background-color: #cccccc;
    border-color: #bbbbbb;
    cursor: not-allowed;
  }
`;

// Bouton fantôme (blanc avec texte de la couleur principale)
export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
  color: #ffffff; /* Texte blanc */
  &:hover {
    background-color: rgba(255, 255, 255, 0.2); /* Léger fond blanc au survol */
  }
`;

// Lien (mot de passe oublié)
export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

// Conteneur de l'overlay (pour l'animation de glissement)
export const OverlayContainer = styled.div.withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props => props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

// L'overlay lui-même (avec la couleur unie #A8C2C0)
export const Overlay = styled.div.withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  background: #A8C2C0; /* Couleur unie comme demandé */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;

// Panneau générique pour les sections de l'overlay
export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

// Panneau de l'overlay gauche
export const LeftOverlayPanel = styled(OverlayPanel).withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  transform: translateX(-20%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
`;

// Panneau de l'overlay droit
export const RightOverlayPanel = styled(OverlayPanel).withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  right: 0;
  transform: translateX(0);
  ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}
`;

// Paragraphe de l'overlay
export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

// NOUVEAUX COMPOSANTS POUR LE DROPDOWN PERSONNALISÉ
export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 8px 0;
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(165, 194, 192, 0.5);
  }
`;

export const DropdownButton = styled.button.withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  background-color: transparent;
  border: none;
  padding: 10px 35px 10px 0px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.hasValue ? '#333' : '#939393'};
  display: flex;
  justify-content: space-between; /* Garde space-between pour pousser la flèche à droite */
  align-items: center;
  border-radius: 8px;

  &:focus {
    outline: none;
  }
`;

export const DropdownArrow = styled.span.withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  margin-left: 10px; /* Marge à gauche pour séparer du texte */
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: #999;
  font-size: 16px;
  pointer-events: none; /* Permet de cliquer sur le bouton en dessous */
  flex-shrink: 0; /* Empêche la flèche de rétrécir */
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 40px; /* Ajusté pour commencer après l'icône */
  right: 0;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 100px; /* RÉDUIT de 200px à 150px */
  overflow-y: auto;
  margin-top: 2px; /* RÉDUIT de 4px à 2px */
`;

export const DropdownOption = styled.li.withConfig({
  shouldForwardProp: customShouldForwardProp,
})`
  padding: 8px 12px; /* RÉDUIT de 12px 15px à 8px 12px */
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px; /* RÉDUIT de 14px à 13px */
  color: #333;
  transition: background-color 0.2s ease;
  border-radius: 4px; /* RÉDUIT de 6px à 4px */
  margin: 1px 3px; /* RÉDUIT de 2px 4px à 1px 3px */

  &:hover {
    background-color: ${props => props.isSelected ? '#A5C2C0' : '#f5f5f5'};
  }

  ${props => props.isSelected && `
    background-color: #A5C2C0;
    color: white;
  `}
`;

export const OptionIcon = styled.span`
  margin-right: 8px; /* RÉDUIT de 10px à 8px */
  font-size: 14px; /* RÉDUIT de 16px à 14px */
  width: 18px; /* RÉDUIT de 20px à 18px */
  display: flex;
  justify-content: center;
`;

export const OptionText = styled.span`
  flex: 1;
  font-size: 13px; /* Ajouté pour cohérence */
`;

export const ErrorMessage = styled.p`
  color: #ff4b2b; /* Couleur d'erreur rouge */
  font-size: 12px;
  margin-top: 5px;
`;

export const SuccessMessage = styled.p`
  color: #28a745; /* Couleur de succès verte */
  font-size: 12px;
  margin-top: 5px;
`;

// NOUVEAUX COMPOSANTS POUR LE LOGO
export const LogoContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 110px;
`;

export const LogoImage = styled.img`
  max-width: 150px; /* Ajustez la taille selon vos besoins */
  height: auto;
`;

export const OverlayLogoContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 110px;
`;

export const OverlayLogoImage = styled.img`
  max-width: 150px; /* Ajustez la taille selon vos besoins */
  height: auto;
  filter: brightness(0) invert(1); /* Pour rendre le logo blanc sur l'overlay */
`;
