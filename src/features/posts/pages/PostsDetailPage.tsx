import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Package,
  Calendar,
  MessageCircle,
  Tag
} from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../authentification/hooks/useAuth";
import { PostType, PostCondition } from "../types/post.types";
import ChatModalComponent from "../../chat/components/ChatModalComponent";
import { useState, useEffect } from "react";
import socket from "../../chat/api/socket";
import { AddToCartButton } from "../../cart/components";

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = usePost(id || "");
  const { loggedInUser } = useAuth();
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Ajout d'un useEffect pour surveiller l'objet post
  useEffect(() => {
    if (post) {
      console.log("--- Débogage Frontend ---");
      console.log("L'objet post a été chargé :", post);
      console.log(
        "Nom de l'utilisateur du post (post.userName) :",
        post.userName
      );
      console.log("ID de l'utilisateur du post (post.userId) :", post.userId);
      console.log("--- Fin du débogage Frontend ---");
    }
  }, [post]);

  useEffect(() => {
  if (!loggedInUser || !post) return;

  const handleNewMessage = (message: any) => {
    console.log("--- Débogage Notification CORRIGÉ ---");
    console.log("Message reçu:", message);
    console.log("loggedInUser.id:", String(loggedInUser.id));
    console.log("post.userId:", String(post.userId));
    console.log("message.senderId:", String(message.senderId));
    console.log("message.receiverId:", message.receiverId); // Remarquez: pas de String() ici car c'est déjà un number
    console.log("chatModalOpen:", chatModalOpen);

    const currentUserId = String(loggedInUser.id);
    const postOwnerId = String(post.userId);
    const senderId = String(message.senderId);
    const receiverId = String(message.receiverId); // Convertir en string pour la comparaison

    // Logique simplifiée: la notification s'affiche si l'utilisateur actuel reçoit un message
    // et que ce message implique le propriétaire de l'annonce (dans un sens ou l'autre)
    const isReceiverOfMessage = receiverId === currentUserId;
    const isRelatedToPost = senderId === postOwnerId || receiverId === postOwnerId;
    
    // Ne pas afficher de notification si le modal est ouvert
    const shouldShowNotification = isReceiverOfMessage && isRelatedToPost && !chatModalOpen;

    console.log("Détails de la vérification:");
    console.log("- senderId === currentUserId:", senderId === currentUserId);
    console.log("- receiverId === postOwnerId:", receiverId === postOwnerId);
    console.log("- senderId === postOwnerId:", senderId === postOwnerId);
    console.log("- receiverId === currentUserId:", receiverId === currentUserId);
    console.log("- isReceiverOfMessage:", isReceiverOfMessage);
    console.log("- isRelatedToPost:", isRelatedToPost);
    console.log("- shouldShowNotification:", shouldShowNotification);
    console.log("----------------------------");

    if (shouldShowNotification) {
      setUnreadCount(prev => {
        const newCount = prev + 1;
        console.log(`🔔 NOTIFICATION: compteur passé de ${prev} à ${newCount}`);
        return newCount;
      });
    }
  };

  socket.on("receiveMessage", handleNewMessage);

  return () => {
    socket.off("receiveMessage", handleNewMessage);
  };
}, [loggedInUser, post, chatModalOpen]);

// Ajouter aussi cet useEffect pour réinitialiser le compteur quand le modal s'ouvre
useEffect(() => {
  if (chatModalOpen) {
    console.log("Modal ouvert - Remise à zéro du compteur de notifications");
    setUnreadCount(0);
  }
}, [chatModalOpen]);

// Ajouter aussi cet useEffect pour réinitialiser le compteur quand le modal s'ouvre
useEffect(() => {
  if (chatModalOpen) {
    console.log("Modal ouvert - Remise à zéro du compteur de notifications");
    setUnreadCount(0);
  }
}, [chatModalOpen]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Annonce non trouvée"}
        </div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const getTypeLabel = (type: PostType) => {
    return type === PostType.FREE ? "Gratuit" : "Payant";
  };

  const getTypeColor = (type: PostType) => {
    return type === PostType.FREE
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  const getConditionLabel = (condition: PostCondition) => {
    switch (condition) {
      case PostCondition.NEW:
        return "Neuf";
      case PostCondition.LIKE_NEW:
        return "Comme neuf";
      case PostCondition.USED:
        return "Utilisé";
      case PostCondition.DAMAGED:
        return "Endommagé";
      case PostCondition.EXPIRED:
        return "Expiré";
    }
  };

  const allPhotos = [post.mainPhoto, ...(post.additionalPhotos || [])].filter(
    Boolean
  );

  // Vérifier si l'utilisateur connecté est le propriétaire de l'annonce
  const isOwner =
    loggedInUser && String(loggedInUser.id) === String(post.userId);

  console.log("--- Débogage isOwner ---");
  console.log("Utilisateur connecté (loggedInUser):", loggedInUser);
  console.log(
    "ID de l'utilisateur connecté (loggedInUser.id):",
    loggedInUser ? loggedInUser.id : "Non connecté"
  );
  console.log("ID du propriétaire de l'annonce (post.userId):", post.userId);
  console.log("Résultat de la comparaison (isOwner):", isOwner);
  console.log("Unread count:", unreadCount);
  console.log("-------------------------");

  const handleContactClick = () => {
  if (!loggedInUser) {
    alert("Veuillez vous connecter pour contacter le propriétaire.");
    return;
  }

  setChatModalOpen(true);
  // Le compteur sera réinitialisé automatiquement par l'useEffect qui surveille chatModalOpen
};

  // Création de l'objet produit à passer au bouton `AddToCartButton`
  const product: any = {
    id: post.id,
    title: post.title,
    description: post.description,
    price: post.price || 0,
    type: post.type === PostType.PAID ? 'paid' : 'free',
    imageUrl: post.mainPhoto,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          {allPhotos.length > 0 ? (
            <>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={allPhotos[0]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allPhotos.slice(1).map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={photo}
                        alt={`${post.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400">
                <svg
                  className="w-24 h-24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <div className="flex gap-2">
                <Badge className={getTypeColor(post.type)}>
                  {getTypeLabel(post.type)}
                </Badge>
                <Badge variant="outline">
                  {getConditionLabel(post.condition)}
                </Badge>
              </div>
            </div>

            {post.type === PostType.PAID && post.price && (
              <p className="text-3xl font-bold text-[#518581] mb-4">{post.price} DT</p>
            )}
          </div>
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {post.description}
            </p>
          </div>
          <div className="border-t pt-6"></div>
          <div className="space-y-4">
            {post.category && (
              <div className="flex items-center text-gray-600">
                <Tag className="mr-2 h-5 w-5" />
                <span>{post.category.name}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-5 w-5" />
              <span>
                {[post.street, post.neighborhood, post.city, post.postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Package className="mr-2 h-5 w-5" />
              <span>
                {post.quantity.value} {post.quantity.unit}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-5 w-5" />
              <span>
                Publié le {new Date(post.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            {/* Remplacement du bouton par le composant AddToCartButton */}
              <AddToCartButton 
                product={product} 
                className="w-full bg-[#518581] hover:bg-green-700"
                quantity={1}
              />

            {/* Bouton Contacter - maintenant actif pour tous */}
            <Button
              variant="outline"
              className="w-full relative"
              onClick={handleContactClick}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isOwner ? "Voir les messages" : "Contacter"}

              {/* Badge de notification pour le propriétaire et les autres utilisateurs */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {loggedInUser && (
        <ChatModalComponent
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          currentUserId={String(loggedInUser.id)}
          targetUserId={isOwner ? "" : String(post.userId)}
          targetUserName={isOwner ? "messages" : post.userName}
          isOwner={isOwner}
        />
      )}
    </div>
  );
};

export default PostDetailPage;
