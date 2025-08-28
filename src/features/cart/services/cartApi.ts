// src/features/cart/services/cartApi.ts
import axios, { AxiosResponse } from 'axios';
import { Cart, AddToCartDto, UpdateCartItemDto } from '../types';

// Instance axios avec interceptors
const cartApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/cart`,
  timeout: 10000,
});

// Fonction utilitaire pour récupérer l'utilisateur courant
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Fonction pour valider que la réponse correspond à l'utilisateur courant
const validateCartResponse = (cart: Cart): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser || !cart) return false;
  
  const cartUserId = cart.user?.id || cart.userId;
  const currentUserId = currentUser.id || currentUser.userId;
  console.log("currentUserId et cartUserId",currentUserId,cartUserId)
  const isValid = String(cartUserId) === String(currentUserId);
  
  if (!isValid) {
    console.error('🚨 [CartAPI] ERREUR DE SÉCURITÉ: Panier d\'un autre utilisateur reçu!');
    console.error('   - Cart User:', cart.user);
    console.error('   - Current User:', currentUser);
  }
  
  return isValid;
};

// Intercepteur de requête pour ajouter le token d'authentification
cartApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter l'ID utilisateur dans les headers pour double vérification
    const currentUser = getCurrentUser();
    if (currentUser?.id) {
      config.headers['X-User-ID'] = currentUser.id;
    }
    
    console.log('📤 [CartAPI] Requête:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      userId: currentUser?.id,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globalement
cartApi.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('📥 [CartAPI] Réponse:', {
      status: response.status,
      url: response.config.url,
      dataType: typeof response.data
    });
    
    return response;
  },
  (error) => {
    console.error('❌ [CartAPI] Erreur HTTP:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      console.warn('🔓 [CartAPI] Session expirée - redirection vers login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      
      // Déclencher un événement pour notifier l'application
      window.dispatchEvent(new CustomEvent('auth-expired'));
      
      // Redirection vers login (optionnel, peut être géré par l'app)
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export class CartApiService {
  /**
   * Récupérer le panier de l'utilisateur avec validation
   */
  static async getCart(): Promise<Cart> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Utilisateur non authentifié');
    }

    console.log('🛒 [CartAPI] Récupération panier pour utilisateur:', currentUser.id);
    // ✅ Appel direct, l'ID vient du token côté backend
    const response = await cartApi.get<Cart>('/');
    console.log("bien",response.data)
    if (response.data && !validateCartResponse(response.data)) {
      return {
        id: `secure-${Date.now()}`,
        user: currentUser,
        items: [],
        totalPrice: 0
      };
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ [CartAPI] Erreur getCart:', error);
    throw new Error(
      error.response?.data?.message || 'Erreur lors de la récupération du panier'
    );
  }
}



  /**
   * Ajouter un produit au panier avec validation
   */
  static async addToCart(data: AddToCartDto): Promise<Cart> {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Vous devez être connecté pour ajouter des articles');
      }

      console.log('➕ [CartAPI] Ajout produit:', data);
      const response = await cartApi.post<Cart>('/', data);
      
      // Validation de sécurité
      if (!validateCartResponse(response.data)) {
        throw new Error('Erreur de synchronisation du panier');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [CartAPI] Erreur addToCart:', error);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de l\'ajout au panier'
      );
    }
  }

  /**
   * Mettre à jour la quantité d'un article avec validation
   */
  static async updateCartItem(itemId: string, data: UpdateCartItemDto): Promise<Cart> {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log(`🔄 [CartAPI] Mise à jour item ${itemId}:`, data);
      const response = await cartApi.put<Cart>(`/${itemId}`, data);
      
      // Validation de sécurité
      if (!validateCartResponse(response.data)) {
        throw new Error('Erreur de synchronisation du panier');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [CartAPI] Erreur updateCartItem:', error);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la mise à jour de l\'article'
      );
    }
  }

  /**
   * Supprimer un article du panier avec validation
   */
  static async removeCartItem(itemId: string): Promise<Cart> {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log(`🗑️ [CartAPI] Suppression item ${itemId}`);
      const response = await cartApi.delete<Cart>(`/${itemId}`);
      
      // Validation de sécurité
      if (!validateCartResponse(response.data)) {
        throw new Error('Erreur de synchronisation du panier');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [CartAPI] Erreur removeCartItem:', error);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la suppression de l\'article'
      );
    }
  }

  /**
   * Vider complètement le panier avec validation
   */
  static async clearCart(): Promise<Cart> {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log('🗑️ [CartAPI] Vidage complet du panier');
      const response = await cartApi.delete<Cart>('/');
      
      // Pour clearCart, accepter même si validation échoue car panier vide
      return response.data || {
        id: `empty-${Date.now()}`,
        user: currentUser,
        items: [],
        totalPrice: 0
      };
    } catch (error: any) {
      console.error('❌ [CartAPI] Erreur clearCart:', error);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la vidange du panier'
      );
    }
  }

  /**
   * Méthode utilitaire pour forcer un rafraîchissement sécurisé
   */
  static async secureRefresh(): Promise<Cart> {
    console.log('🔒 [CartAPI] Rafraîchissement sécurisé...');
    
    // Vérifier d'abord l'authentification
    const token = localStorage.getItem('authToken');
    const user = getCurrentUser();
    
    if (!token || !user) {
      throw new Error('Session expirée');
    }
    
    // Forcer une nouvelle requête
    return this.getCart();
  }
}