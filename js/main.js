// Main JavaScript - Core functionality
// Mustache Harnesses Co.

/**
 * Main Module - Core functionality for header, navigation, and cart updates
 * Provides: mobile menu toggle, cart badge updates, page initialization
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================

  /**
   * Initialize mobile menu toggle functionality
   */
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const navMobile = document.getElementById('nav-mobile');

    if (!toggle || !navMobile) return;

    toggle.addEventListener('click', function() {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      navMobile.classList.toggle('is-open', !isExpanded);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!toggle.contains(event.target) && !navMobile.contains(event.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('is-open');
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('is-open');
      }
    });
  }

  // ============================================
  // CART BADGE UPDATE
  // ============================================

  /**
   * Update the cart badge count in the header
   * Uses CartModule if available
   */
  function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    const mobileCartCount = document.querySelector('.mobile-cart-count');

    let count = 0;

    // Use CartModule if available
    if (typeof CartModule !== 'undefined' && CartModule.getCartItemCount) {
      count = CartModule.getCartItemCount();
    }

    // Update desktop cart badge
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.setAttribute('data-count', count);
      cartBadge.setAttribute('aria-label', count + ' items in cart');
    }

    // Update mobile cart count
    if (mobileCartCount) {
      mobileCartCount.textContent = count;
    }
  }

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================

  /**
   * Highlight the current page in navigation
   */
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Check if current path matches or contains the href
      const linkPath = href.replace(/^\.\.\//, '').replace(/^\.\//, '');
      if (currentPath.includes(linkPath) ||
          (currentPath.endsWith('/') && linkPath === 'index.html') ||
          (currentPath === '/' && linkPath === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ============================================
  // PAGE INITIALIZATION ROUTER
  // ============================================

  /**
   * Determine current page and run page-specific initialization
   */
  function initCurrentPage() {
    const path = window.location.pathname;

    // Page-specific initialization will be added as pages are built
    if (path.includes('shop.html')) {
      // Shop page init - to be implemented in US-012
    } else if (path.includes('product.html')) {
      // Product page init - to be implemented in US-013
    } else if (path.includes('cart.html')) {
      // Cart page init - to be implemented in US-014
    } else if (path.includes('checkout.html')) {
      // Checkout page init - to be implemented in US-015
    } else if (path.includes('confirmation.html')) {
      // Confirmation page init - to be implemented in US-016
    }
  }

  // ============================================
  // STAR RATING COMPONENT
  // ============================================

  /**
   * Create a star rating HTML string
   * @param {number} rating - Rating value (0-5)
   * @param {string} [size=''] - Size class: '', 'sm', 'lg', 'xl'
   * @returns {string} HTML string for star rating
   */
  function createStarRating(rating, size = '') {
    const sizeClass = size ? `star-rating-${size}` : '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    const starSVG = `<svg class="star-rating-star" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>`;

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += starSVG.replace('star-rating-star', 'star-rating-star filled');
    }
    if (hasHalf) {
      stars += starSVG.replace('star-rating-star', 'star-rating-star filled half');
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += starSVG;
    }

    return `<div class="star-rating ${sizeClass}" aria-label="Rating: ${rating} out of 5 stars">${stars}</div>`;
  }

  // ============================================
  // QUANTITY SELECTOR COMPONENT
  // ============================================

  /**
   * Initialize quantity selector functionality
   * @param {HTMLElement} container - Container element or selector
   */
  function initQuantitySelector(container) {
    const selectors = container ?
      container.querySelectorAll('.quantity-selector') :
      document.querySelectorAll('.quantity-selector');

    selectors.forEach(selector => {
      const minusBtn = selector.querySelector('[data-action="decrease"]');
      const plusBtn = selector.querySelector('[data-action="increase"]');
      const input = selector.querySelector('.quantity-input');

      if (!minusBtn || !plusBtn || !input) return;

      const min = parseInt(input.getAttribute('min')) || 1;
      const max = parseInt(input.getAttribute('max')) || 99;

      function updateValue(newValue) {
        const value = Math.max(min, Math.min(max, parseInt(newValue) || min));
        input.value = value;
        minusBtn.disabled = value <= min;
        plusBtn.disabled = value >= max;

        // Dispatch custom event
        const event = new CustomEvent('quantityChange', {
          detail: { value, element: selector },
          bubbles: true
        });
        selector.dispatchEvent(event);
      }

      minusBtn.addEventListener('click', () => {
        updateValue(parseInt(input.value) - 1);
      });

      plusBtn.addEventListener('click', () => {
        updateValue(parseInt(input.value) + 1);
      });

      input.addEventListener('change', () => {
        updateValue(input.value);
      });

      input.addEventListener('blur', () => {
        if (input.value === '' || isNaN(parseInt(input.value))) {
          updateValue(min);
        }
      });

      // Initialize button states
      updateValue(input.value);
    });
  }

  /**
   * Create quantity selector HTML
   * @param {number} [value=1] - Initial value
   * @param {number} [min=1] - Minimum value
   * @param {number} [max=99] - Maximum value
   * @param {string} [size=''] - Size class: '', 'sm', 'lg'
   * @returns {string} HTML string for quantity selector
   */
  function createQuantitySelector(value = 1, min = 1, max = 99, size = '') {
    const sizeClass = size ? `quantity-selector-${size}` : '';
    return `
      <div class="quantity-selector ${sizeClass}">
        <button type="button" class="quantity-btn" data-action="decrease" aria-label="Decrease quantity" ${value <= min ? 'disabled' : ''}>−</button>
        <input type="number" class="quantity-input" value="${value}" min="${min}" max="${max}" aria-label="Quantity">
        <button type="button" class="quantity-btn" data-action="increase" aria-label="Increase quantity" ${value >= max ? 'disabled' : ''}>+</button>
      </div>
    `;
  }

  // ============================================
  // TOAST NOTIFICATION COMPONENT
  // ============================================

  // Toast container reference
  let toastContainer = null;

  /**
   * Ensure toast container exists
   */
  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastContainer);
      }
    }
    return toastContainer;
  }

  /**
   * Show a toast notification
   * @param {Object} options - Toast options
   * @param {string} options.title - Toast title
   * @param {string} [options.message] - Toast message
   * @param {string} [options.type='success'] - Type: 'success', 'error', 'warning', 'info'
   * @param {number} [options.duration=4000] - Duration in ms (0 = no auto-dismiss)
   * @returns {HTMLElement} Toast element
   */
  function showToast({ title, message = '', type = 'success', duration = 4000 }) {
    const container = ensureToastContainer();

    const icons = {
      success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`,
      error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
      warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
      info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      ${icons[type] || icons.info}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => dismissToast(toast), duration);
    }

    return toast;
  }

  /**
   * Show "Added to cart" toast with product info
   * @param {Object} product - Product information
   * @param {string} product.name - Product name
   * @param {string} product.image - Product image URL
   * @param {string} [product.size] - Selected size
   * @param {string} [product.color] - Selected color
   * @param {number} [product.quantity=1] - Quantity added
   */
  function showAddedToCartToast(product) {
    const container = ensureToastContainer();

    const details = [];
    if (product.size) details.push(product.size);
    if (product.color) details.push(product.color);
    if (product.quantity && product.quantity > 1) details.push(`Qty: ${product.quantity}`);

    const toast = document.createElement('div');
    toast.className = 'toast toast-product';
    toast.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="toast-product-image">
      <div class="toast-product-info">
        <div class="toast-product-name">${product.name}</div>
        <div class="toast-product-details">Added to cart${details.length ? ' • ' + details.join(', ') : ''}</div>
      </div>
      <div class="toast-product-action">
        <a href="pages/cart.html" class="btn btn-sm btn-primary">View Cart</a>
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    setTimeout(() => dismissToast(toast), 5000);

    return toast;
  }

  /**
   * Dismiss a toast with animation
   * @param {HTMLElement} toast - Toast element to dismiss
   */
  function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-exit')) return;

    toast.classList.add('toast-exit');
    setTimeout(() => {
      toast.remove();
    }, 200);
  }

  // ============================================
  // MODAL COMPONENT
  // ============================================

  /**
   * Open a modal
   * @param {string|HTMLElement} modal - Modal element or selector
   */
  function openModal(modal) {
    const modalEl = typeof modal === 'string' ? document.querySelector(modal) : modal;
    if (!modalEl) return;

    const backdrop = modalEl.closest('.modal-backdrop') || modalEl;
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const focusable = modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    // Trap focus inside modal
    modalEl.addEventListener('keydown', trapFocus);
  }

  /**
   * Close a modal
   * @param {string|HTMLElement} modal - Modal element or selector
   */
  function closeModal(modal) {
    const modalEl = typeof modal === 'string' ? document.querySelector(modal) : modal;
    if (!modalEl) return;

    const backdrop = modalEl.closest('.modal-backdrop') || modalEl;
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';

    modalEl.removeEventListener('keydown', trapFocus);
  }

  /**
   * Trap focus inside modal
   * @param {KeyboardEvent} e - Keyboard event
   */
  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const modal = e.currentTarget;
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Initialize modal event listeners
   */
  function initModals() {
    // Handle modal open triggers
    document.addEventListener('click', function(e) {
      const trigger = e.target.closest('[data-modal-open]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-open');
        openModal(document.getElementById(modalId));
      }

      // Handle modal close buttons
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        e.preventDefault();
        const modal = closeBtn.closest('.modal-backdrop');
        closeModal(modal);
      }

      // Handle backdrop click
      if (e.target.classList.contains('modal-backdrop')) {
        closeModal(e.target);
      }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal-backdrop.is-open');
        openModals.forEach(modal => closeModal(modal));
      }
    });
  }

  /**
   * Create size guide modal HTML
   * @returns {string} HTML string for size guide modal
   */
  function createSizeGuideModal() {
    return `
      <div class="modal-backdrop" id="size-guide-modal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Size Guide</h3>
            <button class="modal-close" data-modal-close aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="mb-4">Select your size based on the upper lip width measurement below:</p>
            <table class="size-guide-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Upper Lip Width</th>
                  <th>Mustache Span</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>S</strong></td>
                  <td>4.0 - 4.5 cm</td>
                  <td>Up to 6 cm</td>
                  <td>Pencil, Petite</td>
                </tr>
                <tr>
                  <td><strong>M</strong></td>
                  <td>4.5 - 5.0 cm</td>
                  <td>6 - 8 cm</td>
                  <td>Classic, Natural</td>
                </tr>
                <tr>
                  <td><strong>L</strong></td>
                  <td>5.0 - 5.5 cm</td>
                  <td>8 - 10 cm</td>
                  <td>Chevron, Walrus</td>
                </tr>
                <tr>
                  <td><strong>XL</strong></td>
                  <td>5.5+ cm</td>
                  <td>10+ cm</td>
                  <td>Handlebar, Imperial</td>
                </tr>
                <tr>
                  <td><strong>One Size</strong></td>
                  <td>Adjustable</td>
                  <td>4 - 12 cm</td>
                  <td>Universal fit</td>
                </tr>
              </tbody>
            </table>
            <div class="size-guide-note">
              <strong>How to measure:</strong> Using a soft measuring tape, measure the width of your upper lip from corner to corner. For mustache span, measure from tip to tip at the widest point of your mustache.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" data-modal-close>Got It</button>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // PRODUCT CARD COMPONENT
  // ============================================

  /**
   * Create a product card HTML
   * @param {Object} product - Product data
   * @returns {string} HTML string for product card
   */
  function createProductCard(product) {
    const badges = [];
    if (product.isNew) {
      badges.push('<span class="badge badge-new">New</span>');
    }
    if (product.salesCount > 50) {
      badges.push('<span class="badge badge-bestseller">Bestseller</span>');
    }

    const outOfStockOverlay = !product.inStock ? `
      <div class="product-card-overlay">
        <span class="product-card-overlay-text">Out of Stock</span>
      </div>
    ` : '';

    const quickAddBtn = product.inStock ? `
      <div class="product-card-quick-add">
        <button class="btn btn-primary" data-quick-add="${product.id}">Add to Cart</button>
      </div>
    ` : '';

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card-image">
          ${badges.length ? `<div class="product-card-badges">${badges.join('')}</div>` : ''}
          <a href="pages/product.html?id=${product.id}">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          </a>
          ${outOfStockOverlay}
          ${quickAddBtn}
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-title">
            <a href="pages/product.html?id=${product.id}">${product.name}</a>
          </h3>
          <div class="product-card-rating">
            ${createStarRating(product.rating, 'sm')}
            <span class="product-card-rating-count">(${product.reviewCount})</span>
          </div>
          <div class="product-card-price">
            <span class="price">${formatCurrency(product.price)}</span>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Initialize quick add to cart functionality
   */
  function initQuickAddToCart() {
    document.addEventListener('click', async function(e) {
      const btn = e.target.closest('[data-quick-add]');
      if (!btn) return;

      e.preventDefault();
      const productId = btn.getAttribute('data-quick-add');

      // Disable button and show loading
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.innerHTML = '<span class="spinner spinner-sm"></span> Adding...';

      try {
        // Get product data
        if (typeof ProductsModule !== 'undefined') {
          const product = await ProductsModule.getProductById(productId);
          if (product && typeof CartModule !== 'undefined') {
            // Add with default options
            CartModule.addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              size: product.sizes[0],
              color: product.colors[0],
              quantity: 1,
              image: product.images[0]
            });

            // Update cart badge
            updateCartBadge();

            // Show toast
            showAddedToCartToast({
              name: product.name,
              image: product.images[0],
              size: product.sizes[0],
              color: product.colors[0]
            });

            // Dispatch cart updated event
            document.dispatchEvent(new CustomEvent('cartUpdated'));
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast({ title: 'Error', message: 'Could not add item to cart', type: 'error' });
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Debounce function to limit rapid function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function to limit function calls over time
   * @param {Function} func - Function to throttle
   * @param {number} limit - Minimum time between calls in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Format a number as currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Get URL query parameter value
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value or null
   */
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * Set URL query parameter
   * @param {string} param - Parameter name
   * @param {string} value - Parameter value
   * @param {boolean} [pushState=true] - Whether to push to history
   */
  function setQueryParam(param, value, pushState = true) {
    const url = new URL(window.location.href);
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(param);
    } else {
      url.searchParams.set(param, value);
    }

    if (pushState) {
      window.history.pushState({}, '', url.toString());
    } else {
      window.history.replaceState({}, '', url.toString());
    }
  }

  // ============================================
  // MAIN INITIALIZATION
  // ============================================

  /**
   * Main initialization function
   * Runs when DOM is fully loaded
   */
  function init() {
    // Initialize mobile menu
    initMobileMenu();

    // Update cart badge
    updateCartBadge();

    // Set active nav link
    setActiveNavLink();

    // Initialize modals
    initModals();

    // Initialize quantity selectors
    initQuantitySelector();

    // Initialize quick add to cart
    initQuickAddToCart();

    // Initialize current page
    initCurrentPage();

    console.log('Mustache Harnesses Co. initialized');
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);

  // Listen for custom cart update events
  document.addEventListener('cartUpdated', updateCartBadge);

  // ============================================
  // EXPORT TO GLOBAL SCOPE
  // ============================================

  window.MainModule = {
    // Cart badge
    updateCartBadge: updateCartBadge,
    // Utilities
    debounce: debounce,
    throttle: throttle,
    formatCurrency: formatCurrency,
    getQueryParam: getQueryParam,
    setQueryParam: setQueryParam,
    // Star rating
    createStarRating: createStarRating,
    // Quantity selector
    createQuantitySelector: createQuantitySelector,
    initQuantitySelector: initQuantitySelector,
    // Toast notifications
    showToast: showToast,
    showAddedToCartToast: showAddedToCartToast,
    dismissToast: dismissToast,
    // Modal
    openModal: openModal,
    closeModal: closeModal,
    createSizeGuideModal: createSizeGuideModal,
    // Product card
    createProductCard: createProductCard
  };

})();
