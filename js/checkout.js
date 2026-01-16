// Checkout Module
// Handles form validation, order processing, and order history

const ORDERS_STORAGE_KEY = 'mh_orders';

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      valid: false,
      message: 'Email address is required.'
    };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: 'Email address is required.'
    };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      message: 'Please enter a valid email address.'
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @param {boolean} required - Whether the field is required
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validatePhone(phone, required = false) {
  if (!phone || typeof phone !== 'string') {
    if (required) {
      return {
        valid: false,
        message: 'Phone number is required.'
      };
    }
    return {
      valid: true,
      message: ''
    };
  }

  const trimmed = phone.trim();

  if (trimmed.length === 0) {
    if (required) {
      return {
        valid: false,
        message: 'Phone number is required.'
      };
    }
    return {
      valid: true,
      message: ''
    };
  }

  // Allow various phone formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
  const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (!phoneRegex.test(trimmed) || digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      valid: false,
      message: 'Please enter a valid phone number (10-15 digits).'
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Validate credit card number format (Luhn algorithm check)
 * @param {string} cardNumber - Credit card number to validate
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validateCreditCard(cardNumber) {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return {
      valid: false,
      message: 'Card number is required.'
    };
  }

  // Remove spaces and dashes
  const digitsOnly = cardNumber.replace(/[\s\-]/g, '');

  if (digitsOnly.length === 0) {
    return {
      valid: false,
      message: 'Card number is required.'
    };
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(digitsOnly)) {
    return {
      valid: false,
      message: 'Card number should contain only digits.'
    };
  }

  // Check length (13-19 digits for most card types)
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return {
      valid: false,
      message: 'Please enter a valid card number (13-19 digits).'
    };
  }

  // Luhn algorithm check
  if (!luhnCheck(digitsOnly)) {
    return {
      valid: false,
      message: 'Please enter a valid card number.'
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Luhn algorithm for credit card validation
 * @param {string} cardNumber - Card number (digits only)
 * @returns {boolean} Whether the card passes Luhn check
 */
function luhnCheck(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate expiry date (MM/YY format)
 * @param {string} expiry - Expiry date to validate
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validateExpiry(expiry) {
  if (!expiry || typeof expiry !== 'string') {
    return {
      valid: false,
      message: 'Expiry date is required.'
    };
  }

  const trimmed = expiry.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: 'Expiry date is required.'
    };
  }

  // Accept MM/YY or MM/YYYY format
  const expiryRegex = /^(0[1-9]|1[0-2])\/?(\d{2}|\d{4})$/;
  const match = trimmed.replace(/\s/g, '').match(expiryRegex);

  if (!match) {
    return {
      valid: false,
      message: 'Please enter expiry date in MM/YY format.'
    };
  }

  const month = parseInt(match[1], 10);
  let year = parseInt(match[2], 10);

  // Convert 2-digit year to 4-digit
  if (year < 100) {
    year += 2000;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Check if card has expired
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      valid: false,
      message: 'This card has expired.'
    };
  }

  // Check if expiry is too far in the future (more than 20 years)
  if (year > currentYear + 20) {
    return {
      valid: false,
      message: 'Please enter a valid expiry date.'
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Validate CVV (3-4 digits)
 * @param {string} cvv - CVV to validate
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validateCVV(cvv) {
  if (!cvv || typeof cvv !== 'string') {
    return {
      valid: false,
      message: 'CVV is required.'
    };
  }

  const trimmed = cvv.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: 'CVV is required.'
    };
  }

  // CVV should be 3-4 digits (3 for most cards, 4 for Amex)
  const cvvRegex = /^\d{3,4}$/;

  if (!cvvRegex.test(trimmed)) {
    return {
      valid: false,
      message: 'Please enter a valid CVV (3-4 digits).'
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validateRequired(value, fieldName) {
  if (!value || typeof value !== 'string') {
    return {
      valid: false,
      message: `${fieldName} is required.`
    };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: `${fieldName} is required.`
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Validate zip/postal code
 * @param {string} zipCode - Zip code to validate
 * @param {string} country - Country code for format validation
 * @returns {Object} Validation result { valid: boolean, message: string }
 */
function validateZipCode(zipCode, country = 'US') {
  if (!zipCode || typeof zipCode !== 'string') {
    return {
      valid: false,
      message: 'Zip/postal code is required.'
    };
  }

  const trimmed = zipCode.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: 'Zip/postal code is required.'
    };
  }

  // Country-specific validation patterns
  const patterns = {
    'US': /^\d{5}(-\d{4})?$/,  // 12345 or 12345-6789
    'CA': /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,  // A1A 1A1
    'UK': /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,  // SW1A 1AA
    'DEFAULT': /^[\dA-Za-z\s\-]{3,10}$/  // Generic pattern
  };

  const pattern = patterns[country] || patterns['DEFAULT'];

  if (!pattern.test(trimmed)) {
    if (country === 'US') {
      return {
        valid: false,
        message: 'Please enter a valid US zip code (e.g., 12345 or 12345-6789).'
      };
    } else if (country === 'CA') {
      return {
        valid: false,
        message: 'Please enter a valid Canadian postal code (e.g., A1A 1A1).'
      };
    }
    return {
      valid: false,
      message: 'Please enter a valid zip/postal code.'
    };
  }

  return {
    valid: true,
    message: ''
  };
}

/**
 * Validate entire checkout form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result { valid: boolean, errors: Object }
 */
function validateCheckoutForm(formData) {
  const errors = {};

  // Contact Information
  const emailResult = validateEmail(formData.email);
  if (!emailResult.valid) {
    errors.email = emailResult.message;
  }

  const phoneResult = validatePhone(formData.phone, false);
  if (!phoneResult.valid) {
    errors.phone = phoneResult.message;
  }

  // Shipping Address
  const firstNameResult = validateRequired(formData.firstName, 'First name');
  if (!firstNameResult.valid) {
    errors.firstName = firstNameResult.message;
  }

  const lastNameResult = validateRequired(formData.lastName, 'Last name');
  if (!lastNameResult.valid) {
    errors.lastName = lastNameResult.message;
  }

  const address1Result = validateRequired(formData.address1, 'Address');
  if (!address1Result.valid) {
    errors.address1 = address1Result.message;
  }

  const cityResult = validateRequired(formData.city, 'City');
  if (!cityResult.valid) {
    errors.city = cityResult.message;
  }

  const stateResult = validateRequired(formData.state, 'State/Province');
  if (!stateResult.valid) {
    errors.state = stateResult.message;
  }

  const zipResult = validateZipCode(formData.zipCode, formData.country);
  if (!zipResult.valid) {
    errors.zipCode = zipResult.message;
  }

  const countryResult = validateRequired(formData.country, 'Country');
  if (!countryResult.valid) {
    errors.country = countryResult.message;
  }

  // Payment Information
  const cardNumberResult = validateCreditCard(formData.cardNumber);
  if (!cardNumberResult.valid) {
    errors.cardNumber = cardNumberResult.message;
  }

  const cardNameResult = validateRequired(formData.cardName, 'Cardholder name');
  if (!cardNameResult.valid) {
    errors.cardName = cardNameResult.message;
  }

  const expiryResult = validateExpiry(formData.expiry);
  if (!expiryResult.valid) {
    errors.expiry = expiryResult.message;
  }

  const cvvResult = validateCVV(formData.cvv);
  if (!cvvResult.valid) {
    errors.cvv = cvvResult.message;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generate unique order confirmation number
 * @returns {string} Order confirmation number (e.g., MH-20240116-ABC123)
 */
function generateOrderNumber() {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MH-${datePart}-${randomPart}`;
}

/**
 * Get order history from localStorage
 * @returns {Array} Array of past orders
 */
function getOrderHistory() {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading order history from localStorage:', error);
    return [];
  }
}

/**
 * Save order to localStorage
 * @param {Object} order - Order data to save
 * @returns {Object} The saved order with order number
 */
function saveOrder(order) {
  const orderNumber = generateOrderNumber();
  const orderDate = new Date().toISOString();

  const orderRecord = {
    ...order,
    orderNumber,
    orderDate,
    status: 'confirmed'
  };

  try {
    const orders = getOrderHistory();
    orders.push(orderRecord);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return orderRecord;
  } catch (error) {
    console.error('Error saving order to localStorage:', error);
    throw new Error('Failed to save order. Please try again.');
  }
}

/**
 * Process checkout
 * @param {Object} formData - Checkout form data
 * @param {Array} cartItems - Items in the cart
 * @param {Object} cartSummary - Cart summary with totals
 * @returns {Object} Result { success: boolean, order: Object, errors: Object }
 */
function processCheckout(formData, cartItems, cartSummary) {
  // Validate form data
  const validation = validateCheckoutForm(formData);

  if (!validation.valid) {
    return {
      success: false,
      order: null,
      errors: validation.errors
    };
  }

  // Check if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return {
      success: false,
      order: null,
      errors: {
        cart: 'Your cart is empty.'
      }
    };
  }

  // Create order object
  const order = {
    items: cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image: item.image
    })),
    shipping: {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      address1: formData.address1.trim(),
      address2: formData.address2 ? formData.address2.trim() : '',
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      country: formData.country.trim()
    },
    contact: {
      email: formData.email.trim(),
      phone: formData.phone ? formData.phone.trim() : ''
    },
    payment: {
      // Only store masked card number for display
      cardLast4: formData.cardNumber.replace(/\D/g, '').slice(-4),
      cardName: formData.cardName.trim()
    },
    totals: {
      subtotal: cartSummary.subtotal,
      discount: cartSummary.discount,
      promoCode: cartSummary.promoCode,
      shipping: cartSummary.shipping,
      total: cartSummary.total
    }
  };

  try {
    // Save order to localStorage
    const savedOrder = saveOrder(order);

    // Clear cart after successful checkout
    if (window.CartModule && typeof window.CartModule.clearCart === 'function') {
      window.CartModule.clearCart();
    }

    return {
      success: true,
      order: savedOrder,
      errors: null
    };
  } catch (error) {
    return {
      success: false,
      order: null,
      errors: {
        general: error.message || 'An error occurred while processing your order.'
      }
    };
  }
}

/**
 * Get an order by order number
 * @param {string} orderNumber - Order number to find
 * @returns {Object|null} Order object or null if not found
 */
function getOrderByNumber(orderNumber) {
  const orders = getOrderHistory();
  return orders.find(order => order.orderNumber === orderNumber) || null;
}

/**
 * Format credit card number with spaces (for display during input)
 * @param {string} cardNumber - Raw card number
 * @returns {string} Formatted card number
 */
function formatCardNumber(cardNumber) {
  if (!cardNumber) return '';
  const digitsOnly = cardNumber.replace(/\D/g, '');
  const groups = digitsOnly.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digitsOnly;
}

/**
 * Format expiry date (for display during input)
 * @param {string} expiry - Raw expiry input
 * @returns {string} Formatted expiry (MM/YY)
 */
function formatExpiry(expiry) {
  if (!expiry) return '';
  const digitsOnly = expiry.replace(/\D/g, '');
  if (digitsOnly.length >= 2) {
    return digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
  }
  return digitsOnly;
}

/**
 * Mask card number for display (show only last 4 digits)
 * @param {string} cardNumber - Card number to mask
 * @returns {string} Masked card number (e.g., **** **** **** 1234)
 */
function maskCardNumber(cardNumber) {
  if (!cardNumber) return '';
  const digitsOnly = cardNumber.replace(/\D/g, '');
  const last4 = digitsOnly.slice(-4);
  return `**** **** **** ${last4}`;
}

// Export functions for use in other modules
window.CheckoutModule = {
  // Individual field validators
  validateEmail,
  validatePhone,
  validateCreditCard,
  validateExpiry,
  validateCVV,
  validateRequired,
  validateZipCode,

  // Form validation
  validateCheckoutForm,

  // Order processing
  processCheckout,
  generateOrderNumber,

  // Order history
  saveOrder,
  getOrderHistory,
  getOrderByNumber,

  // Formatting utilities
  formatCardNumber,
  formatExpiry,
  maskCardNumber
};
