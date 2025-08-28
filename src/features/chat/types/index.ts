// frontend/src/features/chat/types/index.ts

/**
 * @interface Message
 * @description Représente la structure d'un message de chat.
 * @property {string} senderId - L'ID de l'expéditeur du message.
 * @property {string} receiverId - L'ID du destinataire du message.
 * @property {string} content - Le contenu textuel du message.
 * @property {string} timestamp - Horodatage du message au format ISO 8601.
 */
export interface Message {
  id?: number; // Optionnel pour les nouveaux messages
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string; // Ajout de l'horodatage
}

/**
 * @interface ChatProps
 * @description Représente les props passées au composant Chat.
 * @property {string} currentUserId - L'ID de l'utilisateur actuellement connecté (l'expéditeur).
 * @property {string} targetUserId - L'ID de l'utilisateur avec qui chatter (le destinataire).
 */
export interface ChatProps {
  currentUserId: string;
  targetUserId: string;
}
