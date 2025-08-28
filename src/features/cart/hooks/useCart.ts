// src/features/cart/hooks/useCart.ts - Version CORRIGÉE

import { useState, useEffect, useCallback, useRef } from "react";
import { CartState, AddToCartDto } from "../types";
import { CartApiService } from "../services";

// Fonction utilitaire pour récupérer les informations utilisateur - CORRIGÉE
const getCurrentUser = () => {
  try {
    let userStr = localStorage.getItem("user") ||
      localStorage.getItem("currentUser") ||
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("user") ||
      sessionStorage.getItem("currentUser");

    if (!userStr) {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          if (base64Url) {
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            console.log("👤 [useCart] Utilisateur extrait du token:", decoded);
            return decoded;
          }
        } catch (e) {
          console.warn("⚠️ [useCart] Impossible de décoder le token JWT:", e);
        }
      }

      console.warn("⚠️ [useCart] Aucun utilisateur trouvé dans le stockage");
      return null;
    }

    const user = JSON.parse(userStr);
    console.log("👤 [useCart] Utilisateur courant trouvé:", user);
    return user;
  } catch (error) {
    console.error("❌ [useCart] Erreur parsing utilisateur:", error);
    return null;
  }
};

const isUserAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const token = localStorage.getItem("authToken");

  const isAuthenticated = !!(user && token);
  console.log("🔐 [useCart] Vérification authentification:", {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated,
    userId: user?.id || user?.userId
  });

  return isAuthenticated;
};

const isCartOwnedByCurrentUser = (cart: any, currentUser: any): boolean => {
  if (!cart || !currentUser) return false;

  const cartUserId = cart.user?.id || cart.user?.userId || cart.userId;
  const currentUserId = currentUser.id || currentUser.userId;

  console.log("🔍 [useCart] Vérification propriétaire:");
  console.log(" - Cart User ID:", cartUserId);
  console.log(" - Current User ID:", currentUserId);

  return String(cartUserId) === String(currentUserId);
};

export const useCart = () => {
  const [state, setState] = useState<CartState>({
    cart: null,
    loading: false,
    error: null,
  });

  const fetchingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  // ✅ NOUVEAU : Ref pour empêcher les refetch après clear
  const preventFetchAfterClearRef = useRef(false);

  const updateState = useCallback((updates: Partial<CartState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchCart = useCallback(async (force: boolean = false) => {
    // ✅ SOLUTION : Empêcher fetch après clear pendant 2 secondes
    if (preventFetchAfterClearRef.current && !force) {
      console.log("🚫 [useCart] Fetch bloqué après clear récent");
      return;
    }

    if (fetchingRef.current && !force) {
      console.log("🔄 [useCart] Récupération déjà en cours, ignorée");
      return;
    }

    const now = Date.now();
    if (!force && now - lastFetchRef.current < 1000) {
      console.log("🔄 [useCart] Appel trop récent, ignoré");
      return;
    }

    console.log("🔄 [useCart] Récupération du panier...");
    fetchingRef.current = true;
    lastFetchRef.current = now;
    updateState({ loading: true, error: null });

    try {
      if (!isUserAuthenticated()) {
        console.warn("⚠️ [useCart] Utilisateur non authentifié - panier vide");
        updateState({
          cart: { id: "", user: null, items: [], totalPrice: 0 },
          loading: false,
        });
        return;
      }

      const currentUser = getCurrentUser();
      console.log("📞 [useCart] Appel API avec utilisateur:", currentUser?.id);

      const cart = await CartApiService.getCart();
      console.log("📦 [useCart] Panier reçu:", cart);

      if (cart && !isCartOwnedByCurrentUser(cart, currentUser)) {
        console.warn(
          "🚨 [useCart] ATTENTION: Le panier ne correspond pas à l'utilisateur courant!"
        );

        const emptyCart = {
          id: `secure-${Date.now()}`,
          user: currentUser,
          items: [],
          totalPrice: 0,
        };

        updateState({ cart: emptyCart, loading: false });
        return;
      }

      updateState({ cart, loading: false });
    } catch (error: any) {
      console.error("❌ [useCart] Erreur:", error);

      if (error.status === 401 || error.status === 403 ||
        error.message?.includes("401") || error.message?.includes("403")) {
        console.warn("🔐 [useCart] Session expirée - nettoyage");

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("loggedInUser");

        updateState({
          cart: { id: "", user: null, items: [], totalPrice: 0 },
          loading: false,
          error: "Session expirée, veuillez vous reconnecter",
        });

        window.dispatchEvent(new CustomEvent('auth-expired'));
        return;
      }

      updateState({
        loading: false,
        error: error.message || "Erreur lors de la récupération du panier",
      });
    } finally {
      fetchingRef.current = false;
    }
  }, [updateState]);

  const addToCart = useCallback(
    async (data: AddToCartDto) => {
      console.log("➕ [useCart] Ajout au panier:", data);

      if (!isUserAuthenticated()) {
        console.error("❌ [useCart] Utilisateur non authentifié pour ajout");
        updateState({
          error: "Vous devez être connecté pour ajouter des articles au panier",
        });
        return false;
      }

      const currentUser = getCurrentUser();
      updateState({ loading: true, error: null });

      try {
        const updatedCart = await CartApiService.addToCart(data);
        console.log("✅ [useCart] Produit ajouté:", updatedCart);

        if (!isCartOwnedByCurrentUser(updatedCart, currentUser)) {
          console.error(
            "🚨 [useCart] ERREUR: Le panier retourné ne correspond pas à l'utilisateur!"
          );
          updateState({
            loading: false,
            error: "Erreur de synchronisation du panier",
          });
          return false;
        }

        updateState({ cart: updatedCart, loading: false });

        window.dispatchEvent(new CustomEvent('cart-updated', {
          detail: { cart: updatedCart, action: 'add' }
        }));

        return true;
      } catch (error: any) {
        console.error("❌ [useCart] Erreur ajout:", error);
        updateState({
          loading: false,
          error: error.message || "Erreur lors de l'ajout au panier",
        });
        return false;
      }
    },
    [updateState]
  );

  // ✅ SOLUTION COMPLÈTE : clearCart avec blocage de fetch
  const clearCart = useCallback(async () => {
    console.log("🗑️ [useCart] Vidage du panier...");

    if (!isUserAuthenticated()) {
      console.error("❌ [useCart] Utilisateur non authentifié pour vidage");
      return false;
    }

    const currentUser = getCurrentUser();
    updateState({ loading: true, error: null });

    try {
      // ✅ 1. Appel API pour vider le panier
      const apiResult = await CartApiService.clearCart();
      console.log("✅ [useCart] API clearCart réussie:", apiResult);

      // ✅ 2. Créer un panier vide local immédiatement
      const emptyCart = {
        id: apiResult?.id || `empty-${Date.now()}`,
        user: currentUser,
        items: [],
        totalPrice: 0
      };

      // ✅ 3. Mettre à jour l'état local IMMÉDIATEMENT
      updateState({ cart: emptyCart, loading: false });
      console.log("🔄 [useCart] État local vidé immédiatement");

      // ✅ 4. CRITIQUE : Empêcher les fetch pendant 2 secondes
      preventFetchAfterClearRef.current = true;
      setTimeout(() => {
        preventFetchAfterClearRef.current = false;
        console.log("✅ [useCart] Protection anti-fetch désactivée");
      }, 2000);

      // ✅ 5. Déclencher les événements pour synchroniser tous les composants
      window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: { cart: emptyCart, action: 'clear' }
      }));
      window.dispatchEvent(new CustomEvent('cart-cleared', {
        detail: { cart: emptyCart }
      }));

      console.log("📢 [useCart] Événements de synchronisation déclenchés");
      return true;

    } catch (error: any) {
      console.error("❌ [useCart] Erreur vidage:", error);
      updateState({
        loading: false,
        error: error.message || "Erreur lors de la vidange du panier",
      });
      return false;
    }
  }, [updateState]);

  const itemCount =
    state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const totalPrice = state.cart?.totalPrice || 0;

  const isEmpty = itemCount === 0;

  // Initialisation
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Surveillance des changements d'authentification
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("🔐 [useCart] Changement d'authentification détecté");
      // ✅ Ne pas fetch si clear récent
      if (!preventFetchAfterClearRef.current) {
        fetchCart(true);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "user" ||
        e.key === "currentUser" ||
        e.key === "loggedInUser" ||
        e.key === "authToken"
      ) {
        console.log(`📦 [useCart] Changement détecté dans localStorage: ${e.key}`);
        setTimeout(handleAuthChange, 100);
      }
    };

    window.addEventListener("user-changed", handleAuthChange);
    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("login", handleAuthChange);
    window.addEventListener("logout", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("user-changed", handleAuthChange);
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("login", handleAuthChange);
      window.removeEventListener("logout", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchCart]);

  // ✅ AMÉLIORATION : Gestion des événements avec logique clear améliorée
  useEffect(() => {
    const handleCartUpdate = (e: CustomEvent) => {
      console.log("🔄 [useCart] Événement de mise à jour reçu:", e.detail);

      // ✅ Pour les actions clear, forcer la mise à jour de l'état local
      if (e.detail?.action === 'clear') {
        console.log("🗑️ [useCart] Action clear - mise à jour forcée");
        const emptyCart = e.detail.cart || {
          id: `empty-${Date.now()}`,
          user: getCurrentUser(),
          items: [],
          totalPrice: 0
        };
        updateState({ cart: emptyCart, loading: false });
        return;
      }

      // Pour les autres actions, faire un refetch seulement si pas de clear récent
      if (!preventFetchAfterClearRef.current) {
        setTimeout(() => fetchCart(true), 200);
      }
    };

    const handleCartCleared = (e: CustomEvent) => {
      console.log("🗑️ [useCart] Événement cart-cleared reçu:", e.detail);
      // Force la mise à jour avec le panier vide
      if (e.detail?.cart) {
        updateState({ cart: e.detail.cart, loading: false });
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate as EventListener);
    window.addEventListener("cart-cleared", handleCartCleared as EventListener);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate as EventListener);
      window.removeEventListener("cart-cleared", handleCartCleared as EventListener);
    };
  }, [fetchCart, updateState]);

  return {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    itemCount,
    totalPrice,
    isEmpty,
    isAuthenticated: isUserAuthenticated(),
    currentUser: getCurrentUser(),
    actions: {
      fetchCart: (force?: boolean) => fetchCart(force),
      addToCart,
      clearCart,
      clearError: () => updateState({ error: null }),
    },
  };
};