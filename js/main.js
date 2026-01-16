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
    updateCartBadge: updateCartBadge,
    debounce: debounce,
    throttle: throttle,
    formatCurrency: formatCurrency,
    getQueryParam: getQueryParam,
    setQueryParam: setQueryParam
  };

})();
