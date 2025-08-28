import React, { useState, useEffect, useRef } from "react";
import socket from "../api/socket";
import { X, Users } from "lucide-react";
import { Message } from "../types";

interface ChatModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  targetUserId: string;
  targetUserName?: string;
  isOwner?: boolean | null;
}

interface Conversation {
  userId: string;
  userName?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

const ChatModalComponent: React.FC<ChatModalComponentProps> = ({
  isOpen,
  onClose,
  currentUserId,
  targetUserId,
  targetUserName,
  isOwner = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effet pour la logique Socket.IO
  useEffect(() => {
    if (!isOpen) return;

    if (currentUserId) {
      socket.emit("registerUser", currentUserId);
    }

    // Gestion initiale : si c'est le propriétaire, on charge la liste des conversations
    // sinon, on charge une conversation spécifique
    setIsLoading(true);
    if (isOwner) {
      socket.emit("getOwnerConversations", currentUserId);
      console.log(
        `Requête 'getOwnerConversations' envoyée pour l'utilisateur ${currentUserId}`
      );
    } else if (currentUserId && targetUserId) {
      socket.emit("joinChat", {
        user1Id: currentUserId,
        user2Id: targetUserId,
      });
      setSelectedConversation(targetUserId);
      console.log(
        `Requête 'joinChat' envoyée pour la conversation avec ${targetUserId}`
      );
    } else {
      setIsLoading(false); // Pas de chat à afficher
    }

    const handleUserRegistered = (userId: string) => {
      console.log("Utilisateur enregistré confirmé:", userId);
    };

    const handleChatJoined = (roomId: string) => {
      console.log("Room rejointe:", roomId);
    };

    const handleChatHistory = (chatHistory: Message[]) => {
      console.log("Messages historiques reçus:", chatHistory);
      setMessages(chatHistory);
      setIsLoading(false);
    };

    const handleOwnerConversations = (conversationsList: any[]) => {
      console.log("Conversations du propriétaire reçues:", conversationsList);
      setConversations(conversationsList);
      setIsLoading(false);
      // Optionnel: si une seule conversation existe, la sélectionner automatiquement
      if (
        conversationsList.length > 0 &&
        !selectedConversation &&
        !targetUserId
      ) {
        // Cela peut être utile si le propriétaire n'a qu'une seule conversation
        // et qu'il n'arrive pas d'un lien direct vers une annonce.
        selectConversation(conversationsList[0].userId);
      }
    };

    const handleReceiveMessage = (message: Message) => {
      console.log("Message reçu:", message);

      // Mettre à jour les messages si c'est la conversation active
      if (
        selectedConversation === message.senderId ||
        selectedConversation === message.receiverId
      ) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (prevMsg) =>
              prevMsg.content === message.content &&
              prevMsg.senderId === message.senderId &&
              Math.abs(
                new Date(prevMsg.timestamp).getTime() -
                  new Date(message.timestamp).getTime()
              ) < 1000
          );

          if (messageExists) {
            console.log("Message déjà présent, ignoré");
            return prevMessages;
          }

          return [...prevMessages, message];
        });
      }

      // Mettre à jour la liste des conversations si c'est le propriétaire
      if (isOwner) {
        setConversations((prev) =>
          prev.map((conv) => {
            if (
              conv.userId === message.senderId ||
              conv.userId === message.receiverId
            ) {
              return {
                ...conv,
                lastMessage: message.content,
                lastMessageTime: new Date(message.timestamp),
                unreadCount:
                  selectedConversation === conv.userId
                    ? 0
                    : conv.unreadCount + 1,
              };
            }
            return conv;
          })
        );
      }
    };

    const handleError = (errorMessage: string) => {
      console.error("Erreur du serveur Socket.IO:", errorMessage);
      setIsLoading(false);
      alert(`Erreur: ${errorMessage}`);
    };

    socket.on("userRegistered", handleUserRegistered);
    socket.on("chatJoined", handleChatJoined);
    socket.on("chatHistory", handleChatHistory);
    socket.on("ownerConversations", handleOwnerConversations);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("userRegistered", handleUserRegistered);
      socket.off("chatJoined", handleChatJoined);
      socket.off("chatHistory", handleChatHistory);
      socket.off("ownerConversations", handleOwnerConversations);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("error", handleError);
    };
  }, [isOpen, currentUserId, targetUserId, isOwner, selectedConversation]);

  // Effet pour faire défiler vers le bas des messages
  useEffect(() => {
    if (isOpen && selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      inputMessage.trim() &&
      socket.connected &&
      currentUserId &&
      selectedConversation
    ) {
      const messagePayload = {
        receiverId: selectedConversation,
        content: inputMessage.trim(),
      };

      console.log("Envoi du message:", messagePayload);
      socket.emit("sendMessage", messagePayload);
      setInputMessage("");
    } else {
      console.warn(
        "Impossible d'envoyer le message: champ vide, socket non connecté ou conversation non sélectionnée."
      );
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSendMessage(syntheticEvent);
    }
  };

  const selectConversation = (userId: string) => {
    setSelectedConversation(userId);
    setIsLoading(true);
    setMessages([]);

    socket.emit("joinChat", {
      user1Id: currentUserId,
      user2Id: userId,
    });

    socket.emit("markRead", { readerId: currentUserId, otherUserId: userId });

    // Marquer les messages comme lus
    setConversations((prev) =>
      prev.map((conv) =>
        conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-100 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] h-[700px] overflow-hidden flex">
        {/* Liste des conversations (pour le propriétaire) */}
        {isOwner && (
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-[#A5C2C0]">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Users className="mr-2" size={20} />
                Vos conversations
              </h2>
            </div>

            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <p className="text-gray-500">
                    Chargement des conversations...
                  </p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex items-center justify-center p-4">
                  <p className="text-gray-500">Aucune conversation</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.userId}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedConversation === conv.userId ? "bg-gray-100" : ""
                    }`}
                    onClick={() => selectConversation(conv.userId)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900">
                          {conv.userName}
                        </h3>
                        {conv.lastMessage && (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conv.lastMessage}
                          </p>
                        )}
                        {conv.lastMessageTime && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(
                              conv.lastMessageTime
                            ).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ml-2">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Zone de chat */}
        <div className={`flex flex-col ${isOwner ? "w-2/3" : "w-full"}`}>
          {/* Header du chat */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-[#A5C2C0] flex-shrink-0">
            <h2 className="text-xl font-semibold text-white">
              {isOwner && !selectedConversation
                ? "Sélectionnez une conversation"
                : isOwner && selectedConversation
                ? conversations.find((c) => c.userId === selectedConversation)
                    ?.userName
                : targetUserName}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenu du chat */}
          {isOwner && !selectedConversation ? (
            <div className="flex-grow flex items-center justify-center p-4">
              <p className="text-gray-500">
                Sélectionnez une conversation pour commencer
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex-grow flex items-center justify-center p-4">
              <p className="text-gray-500">Chargement des messages...</p>
            </div>
          ) : (
            <>
              <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-3 bg-white">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 text-sm mt-2">
                    Commencez la discussion !
                  </p>
                )}
                {messages.map((msg, index) => {
                  const isSender =
                    String(msg.senderId) === String(currentUserId);

                  // Logique pour obtenir le nom de l'expéditeur
                  let senderName = "Utilisateur";
                  if (isSender) {
                    senderName = "Moi";
                  } else if (isOwner && selectedConversation) {
                    // Si c'est le propriétaire, on cherche l'autre utilisateur de la conversation
                    const otherUser = conversations.find(
                      (c) => c.userId === msg.senderId
                    );
                    senderName = otherUser?.userName || msg.senderId;
                  } else if (targetUserName) {
                    // Sinon, on utilise le nom de l'utilisateur cible passé en prop
                    senderName = targetUserName;
                  } else {
                    // En dernier recours, l'ID
                    senderName = msg.senderId;
                  }

                  return (
                    <div
                      key={msg.id || index}
                      className={`p-4 rounded-xl max-w-[75%] break-words shadow-sm ${
                        isSender
                          ? "bg-[#A5C2C0] text-white self-end"
                          : "bg-gray-200 text-gray-800 self-start"
                      }`}
                    >
                      <div className="text-base leading-relaxed">
                        {msg.content}
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          isSender
                            ? "text-gray-100 text-right"
                            : "text-gray-600 text-left"
                        }`}
                      >
                        {senderName} -{" "}
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Container */}
              <div className="flex p-6 border-t border-gray-200 bg-gray-100 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  className="flex-grow px-5 py-3 border border-gray-300 rounded-full text-base mr-3 focus:outline-none focus:border-[#7C9A98] focus:ring-2 focus:ring-[#A5C2C0]/50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={
                    !socket.connected ||
                    !currentUserId ||
                    !selectedConversation ||
                    !inputMessage.trim()
                  }
                  className="bg-[#A5C2C0] text-white border-none px-6 py-3 rounded-full cursor-pointer text-base font-bold transition-colors duration-300 hover:bg-[#7C9A98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModalComponent;
