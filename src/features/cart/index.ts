// src/features/cart/index.ts

// Types
export type {
  User,
  Product,
  CartItemType,
  Cart,
  AddToCartDto,
  UpdateCartItemDto,
  CartApiResponse,
  CartState
} from './types';

// Services
export { CartApiService } from './services';

// Hooks
export { useCart, useCartItem } from './hooks';

// Components
export {
  CartIcon,
  CartItem,
  CartSummary,
  AddToCartButton
} from './components';

// Pages
export { CartPage } from './pages';

// Default export for the main cart functionality
export { useCart as default } from './hooks';