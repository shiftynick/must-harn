// Cart Module
// Handles shopping cart functionality with localStorage persistence

const CART_STORAGE_KEY = 'mh_cart';
const PROMO_STORAGE_KEY = 'mh_promo';

// Valid promo codes and their discounts
const PROMO_CODES = {
  'AIFORHUMANS': 0.10  // 10% off
};

/**
 * Initialize cart from localStorage
 * @returns {Array} Array of cart items
 */
function initCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Array of cart items
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/**
 * Get the current cart
 * @returns {Array} Array of cart items
 */
function getCart() {
  return initCart();
}

/**
 * Add item to cart
 * @param {Object} item - Item to add
 * @param {string} item.productId - Product ID
 * @param {string} item.name - Product name
 * @param {number} item.price - Unit price
 * @param {string} item.size - Selected size
 * @param {string} item.color - Selected color
 * @param {number} item.quantity - Quantity to add
 * @param {string} item.image - Product image URL
 * @returns {Array} Updated cart
 */
function addToCart(item) {
  const cart = getCart();

  // Check if item with same product, size, and color already exists
  const existingIndex = cart.findIndex(cartItem =>
    cartItem.productId === item.productId &&
    cartItem.size === item.size &&
    cartItem.color === item.color
  );

  if (existingIndex !== -1) {
    // Update quantity of existing item
    cart[existingIndex].quantity += item.quantity;
  } else {
    // Add new item with unique cart ID
    cart.push({
      ...item,
      cartId: generateCartId()
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Generate unique cart item ID
 * @returns {string} Unique ID
 */
function generateCartId() {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Remove item from cart by cart ID
 * @param {string} cartId - Cart item ID to remove
 * @returns {Array} Updated cart
 */
function removeFromCart(cartId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.cartId !== cartId);
  saveCart(updatedCart);
  return updatedCart;
}

/**
 * Update item quantity in cart
 * @param {string} cartId - Cart item ID
 * @param {number} quantity - New quantity (0 removes the item)
 * @returns {Array} Updated cart
 */
function updateQuantity(cartId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(cartId);
  }

  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.cartId === cartId);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

/**
 * Calculate cart subtotal (before discounts)
 * @returns {number} Subtotal amount
 */
function calculateSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get the currently applied promo code
 * @returns {string|null} Promo code or null if none applied
 */
function getAppliedPromo() {
  try {
    return localStorage.getItem(PROMO_STORAGE_KEY);
  } catch (error) {
    console.error('Error getting promo from localStorage:', error);
    return null;
  }
}

/**
 * Validate a promo code
 * @param {string} code - Promo code to validate
 * @returns {Object} Validation result { valid: boolean, discount: number, message: string }
 */
function validatePromoCode(code) {
  if (!code || typeof code !== 'string') {
    return {
      valid: false,
      discount: 0,
      message: 'Please enter a promo code.'
    };
  }

  const normalizedCode = code.trim().toUpperCase();

  if (PROMO_CODES.hasOwnProperty(normalizedCode)) {
    return {
      valid: true,
      discount: PROMO_CODES[normalizedCode],
      message: `Promo code applied! ${PROMO_CODES[normalizedCode] * 100}% off your order.`
    };
  }

  return {
    valid: false,
    discount: 0,
    message: 'Invalid promo code. Please try again.'
  };
}

/**
 * Apply a promo code
 * @param {string} code - Promo code to apply
 * @returns {Object} Result { success: boolean, message: string }
 */
function applyPromoCode(code) {
  const validation = validatePromoCode(code);

  if (validation.valid) {
    try {
      const normalizedCode = code.trim().toUpperCase();
      localStorage.setItem(PROMO_STORAGE_KEY, normalizedCode);
      return {
        success: true,
        message: validation.message
      };
    } catch (error) {
      console.error('Error saving promo to localStorage:', error);
      return {
        success: false,
        message: 'Error applying promo code. Please try again.'
      };
    }
  }

  return {
    success: false,
    message: validation.message
  };
}

/**
 * Remove the applied promo code
 */
function removePromoCode() {
  try {
    localStorage.removeItem(PROMO_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing promo from localStorage:', error);
  }
}

/**
 * Calculate discount amount based on applied promo code
 * @returns {number} Discount amount
 */
function calculateDiscount() {
  const promoCode = getAppliedPromo();

  if (!promoCode || !PROMO_CODES.hasOwnProperty(promoCode)) {
    return 0;
  }

  const subtotal = calculateSubtotal();
  return subtotal * PROMO_CODES[promoCode];
}

/**
 * Calculate order total (subtotal - discount)
 * @returns {number} Total amount
 */
function calculateTotal() {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  return subtotal - discount;
}

/**
 * Get cart summary with all calculated values
 * @returns {Object} Cart summary
 */
function getCartSummary() {
  const subtotal = calculateSubtotal();
  const promoCode = getAppliedPromo();
  const discount = calculateDiscount();
  const total = subtotal - discount;

  return {
    subtotal,
    promoCode,
    discount,
    total,
    shipping: 0,  // Free shipping
    itemCount: getCartItemCount()
  };
}

/**
 * Clear all items from cart
 */
function clearCart() {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PROMO_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

/**
 * Get total number of items in cart (sum of all quantities)
 * @returns {number} Total item count
 */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Check if cart is empty
 * @returns {boolean} True if cart is empty
 */
function isCartEmpty() {
  const cart = getCart();
  return cart.length === 0;
}

/**
 * Format price for display
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Export functions for use in other modules
window.CartModule = {
  // Core cart operations
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,

  // Calculations
  calculateSubtotal,
  calculateDiscount,
  calculateTotal,
  getCartSummary,

  // Promo code operations
  getAppliedPromo,
  validatePromoCode,
  applyPromoCode,
  removePromoCode,

  // Utilities
  getCartItemCount,
  isCartEmpty,
  formatPrice
};
