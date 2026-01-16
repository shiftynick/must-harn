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
  // FAQ ACCORDION
  // ============================================

  /**
   * Initialize FAQ accordion functionality
   */
  function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (!faqQuestions.length) return;

    faqQuestions.forEach(function(question) {
      question.addEventListener('click', function() {
        const faqItem = this.closest('.faq-item');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close all other accordions in the same section
        const parent = this.closest('.faq-accordion');
        if (parent) {
          parent.querySelectorAll('.faq-item').forEach(function(item) {
            if (item !== faqItem) {
              item.classList.remove('is-open');
              item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
          });
        }

        // Toggle current accordion
        this.setAttribute('aria-expanded', !isExpanded);
        if (faqItem) {
          faqItem.classList.toggle('is-open', !isExpanded);
        }
      });
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
   * Note: Checks for both with/without .html extension to support clean URLs
   */
  function initCurrentPage() {
    const path = window.location.pathname;

    // Helper to check if path matches a page (with or without .html)
    const isPage = (pageName) => path.includes(pageName + '.html') || path.endsWith('/' + pageName) || path.endsWith('/pages/' + pageName);

    // Page-specific initialization
    if (path.endsWith('/') || path.endsWith('index.html') || path === '' || path === '/index') {
      // Landing page init
      initLandingPage();
    } else if (isPage('shop')) {
      // Shop page init
      initShopPage();
    } else if (isPage('product')) {
      // Product page init
      initProductPage();
    } else if (isPage('cart')) {
      // Cart page init
      initCartPage();
    } else if (isPage('checkout')) {
      // Checkout page init
      initCheckoutPage();
    } else if (isPage('confirmation')) {
      // Confirmation page init
      initConfirmationPage();
    }
  }

  // ============================================
  // LANDING PAGE INITIALIZATION
  // ============================================

  /**
   * Initialize landing page functionality
   */
  async function initLandingPage() {
    // Load featured products
    await loadFeaturedProducts();

    // Initialize newsletter form
    initNewsletterForm();

    // Initialize promo code copy button
    initPromoCopyButton();
  }

  /**
   * Load and display featured products (4 best sellers)
   */
  async function loadFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid) return;

    try {
      // Load products using ProductsModule
      if (typeof ProductsModule !== 'undefined') {
        await ProductsModule.loadProducts();
        // Get featured products (sorted by sales count - best sellers)
        const featuredProducts = await ProductsModule.getFeaturedProducts(4);

        if (featuredProducts && featuredProducts.length > 0) {
          grid.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
        } else {
          grid.innerHTML = '<p class="text-center text-muted">No products available</p>';
        }
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      grid.innerHTML = '<p class="text-center text-muted">Unable to load products</p>';
    }
  }

  /**
   * Initialize newsletter form submission
   */
  function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const successMessage = document.getElementById('newsletter-success');

    if (!form || !successMessage) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Hide form and show success message
      form.hidden = true;
      successMessage.hidden = false;

      // Optional: Store that user "subscribed" in localStorage
      localStorage.setItem('mh_newsletter_subscribed', 'true');
    });
  }

  /**
   * Initialize promo code copy button
   */
  function initPromoCopyButton() {
    const copyBtn = document.querySelector('[data-copy]');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async function() {
      const code = this.getAttribute('data-copy');

      try {
        await navigator.clipboard.writeText(code);

        // Show feedback
        showToast({
          title: 'Copied!',
          message: 'Promo code copied to clipboard',
          type: 'success',
          duration: 2000
        });

        // Visual feedback on button
        const originalHTML = this.innerHTML;
        this.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          this.innerHTML = originalHTML;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        showToast({
          title: 'Error',
          message: 'Failed to copy code',
          type: 'error'
        });
      }
    });
  }

  // ============================================
  // SHOP PAGE INITIALIZATION
  // ============================================

  // Shop page state
  let shopState = {
    allProducts: [],
    filteredProducts: [],
    filters: null,
    filterOptions: null
  };

  /**
   * Initialize shop page functionality
   */
  async function initShopPage() {
    // Load products
    await loadShopProducts();

    // Initialize filter options
    await initShopFilterOptions();

    // Parse initial filters from URL
    shopState.filters = FiltersModule.parseFiltersFromURL();

    // Apply initial filters and render
    applyShopFilters();

    // Set up filter event listeners
    initShopFilterListeners();

    // Set up sort listeners
    initShopSortListeners();

    // Set up mobile filter toggle
    initMobileFilterToggle();

    // Set up history listener for back/forward
    FiltersModule.setupHistoryListener(handleHistoryNavigation);
  }

  /**
   * Load all products for shop page
   */
  async function loadShopProducts() {
    try {
      if (typeof ProductsModule !== 'undefined') {
        shopState.allProducts = await ProductsModule.loadProducts();
      }
    } catch (error) {
      console.error('Error loading shop products:', error);
      shopState.allProducts = [];
    }
  }

  /**
   * Initialize filter options from product data
   */
  async function initShopFilterOptions() {
    if (typeof FiltersModule === 'undefined' || typeof ProductsModule === 'undefined') {
      return;
    }

    try {
      shopState.filterOptions = await FiltersModule.getAvailableFilterOptions();

      // Populate category filters
      const categoryContainer = document.getElementById('category-filters');
      if (categoryContainer && shopState.filterOptions.categories) {
        const categoryCounts = FiltersModule.getCategoryProductCounts(shopState.allProducts);
        categoryContainer.innerHTML = shopState.filterOptions.categories.map(category => `
          <label class="filter-checkbox">
            <input type="checkbox" name="category" value="${category}">
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">${category}</span>
            <span class="checkbox-count">(${categoryCounts[category] || 0})</span>
          </label>
        `).join('');
      }

      // Populate color filters
      const colorContainer = document.getElementById('color-filters');
      if (colorContainer && shopState.filterOptions.colors) {
        colorContainer.innerHTML = shopState.filterOptions.colors.map(color => `
          <label class="filter-color" title="${color}">
            <input type="checkbox" name="color" value="${color}">
            <span class="filter-color-swatch" style="background-color: ${getColorHex(color)}"></span>
          </label>
        `).join('');
      }

      // Populate size filters
      const sizeContainer = document.getElementById('size-filters');
      if (sizeContainer && shopState.filterOptions.sizes) {
        sizeContainer.innerHTML = shopState.filterOptions.sizes.map(size => `
          <label class="filter-size">
            <input type="checkbox" name="size" value="${size}">
            <span class="filter-size-label">${size}</span>
          </label>
        `).join('');
      }
    } catch (error) {
      console.error('Error initializing filter options:', error);
    }
  }

  /**
   * Get hex color code from color name
   */
  function getColorHex(colorName) {
    const colorMap = {
      'Black': '#1a1a1a',
      'Mahogany': '#4e2528',
      'Silver': '#c0c0c0',
      'Onyx': '#353839',
      'Walnut': '#5d432c',
      'Chrome': '#dbe4eb',
      'Matte Black': '#28282B',
      'Rose Gold': '#b76e79',
      'Classic Black': '#1a1a1a',
      'Racing Red': '#d12836',
      'Ocean Blue': '#006994',
      'Neon Green': '#39ff14',
      'White': '#ffffff',
      'Pink': '#ffc0cb',
      'Camo': '#78866b',
      'Tie-Dye': 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      'Yellow': '#ffd93d',
      'Orange': '#ff6b35',
      'Professional Black': '#1a1a1a',
      'Executive Brown': '#654321',
      'Stealth Black': '#1a1a1a',
      'Champagne': '#f7e7ce',
      'Tan': '#d2b48c',
      'Gray': '#808080',
      'Midnight Blue': '#191970',
      'Lavender': '#e6e6fa',
      'Charcoal': '#36454f',
      'Navy': '#000080',
      'Silk White': '#fffff0',
      'Blush': '#de5d83',
      'Slate': '#708090'
    };
    return colorMap[colorName] || '#808080';
  }

  /**
   * Initialize filter event listeners
   */
  function initShopFilterListeners() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;

    // Handle checkbox changes
    filterForm.addEventListener('change', function(e) {
      if (e.target.type === 'checkbox') {
        updateFiltersFromForm();
        applyShopFilters();
      }
    });

    // Handle clear filters button
    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearShopFilters);
    }

    // Handle reset button in empty state
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', clearShopFilters);
    }
  }

  /**
   * Initialize sort dropdown listeners
   */
  function initShopSortListeners() {
    const sortDesktop = document.getElementById('sort-desktop');
    const sortMobile = document.getElementById('sort-mobile');

    function handleSortChange(e) {
      shopState.filters.sort = e.target.value;

      // Sync both dropdowns
      if (sortDesktop) sortDesktop.value = e.target.value;
      if (sortMobile) sortMobile.value = e.target.value;

      applyShopFilters();
    }

    if (sortDesktop) {
      sortDesktop.addEventListener('change', handleSortChange);
    }
    if (sortMobile) {
      sortMobile.addEventListener('change', handleSortChange);
    }
  }

  /**
   * Initialize mobile filter toggle
   */
  function initMobileFilterToggle() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterSidebar = document.getElementById('filter-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');

    if (!filterToggle || !filterSidebar) return;

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    function openSidebar() {
      filterSidebar.classList.add('is-open');
      overlay.classList.add('is-visible');
      filterToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      filterSidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      filterToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    filterToggle.addEventListener('click', openSidebar);

    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    overlay.addEventListener('click', closeSidebar);

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && filterSidebar.classList.contains('is-open')) {
        closeSidebar();
      }
    });
  }

  /**
   * Update filters state from form inputs
   */
  function updateFiltersFromForm() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;

    // Reset filter arrays
    shopState.filters.categories = [];
    shopState.filters.colors = [];
    shopState.filters.sizes = [];
    shopState.filters.minPrice = null;
    shopState.filters.maxPrice = null;
    shopState.filters.inStockOnly = false;

    // Get all checked category checkboxes
    const categoryChecks = filterForm.querySelectorAll('input[name="category"]:checked');
    categoryChecks.forEach(check => {
      shopState.filters.categories.push(check.value);
    });

    // Get price range selections
    const priceChecks = filterForm.querySelectorAll('input[name="priceRange"]:checked');
    if (priceChecks.length > 0) {
      let minPrices = [];
      let maxPrices = [];
      priceChecks.forEach(check => {
        const [min, max] = check.value.split('-').map(Number);
        minPrices.push(min);
        maxPrices.push(max);
      });
      shopState.filters.minPrice = Math.min(...minPrices);
      shopState.filters.maxPrice = Math.max(...maxPrices);
    }

    // Get color selections
    const colorChecks = filterForm.querySelectorAll('input[name="color"]:checked');
    colorChecks.forEach(check => {
      shopState.filters.colors.push(check.value);
    });

    // Get size selections
    const sizeChecks = filterForm.querySelectorAll('input[name="size"]:checked');
    sizeChecks.forEach(check => {
      shopState.filters.sizes.push(check.value);
    });

    // Get in-stock only
    const inStockCheck = document.getElementById('in-stock-filter');
    if (inStockCheck) {
      shopState.filters.inStockOnly = inStockCheck.checked;
    }
  }

  /**
   * Apply current filters and render products
   */
  function applyShopFilters() {
    if (typeof FiltersModule === 'undefined') return;

    // Apply filters to products
    shopState.filteredProducts = FiltersModule.applyFiltersToProducts(
      shopState.allProducts,
      shopState.filters
    );

    // Update URL
    FiltersModule.updateURLWithFilters(shopState.filters, true);

    // Render products
    renderShopProducts();

    // Update UI elements
    updateResultsCount();
    updateActiveFiltersDisplay();
    updateFilterCountBadge();
    syncFormWithFilters();
  }

  /**
   * Render products to the grid
   */
  function renderShopProducts() {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('shop-empty');

    if (!grid) return;

    if (shopState.filteredProducts.length === 0) {
      grid.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }

    grid.hidden = false;
    if (emptyState) emptyState.hidden = true;

    grid.innerHTML = shopState.filteredProducts.map(product => createProductCardShop(product)).join('');
  }

  /**
   * Create a product card HTML for shop page
   * Uses relative paths since we're in /pages/
   */
  function createProductCardShop(product) {
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

    // Use relative image path for pages folder
    const imagePath = product.images[0].startsWith('../') ? product.images[0] : '../' + product.images[0];

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card-image">
          ${badges.length ? `<div class="product-card-badges">${badges.join('')}</div>` : ''}
          <a href="product.html?id=${product.id}">
            <img src="${imagePath}" alt="${product.name}" loading="lazy">
          </a>
          ${outOfStockOverlay}
          ${quickAddBtn}
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
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
   * Update results count display
   */
  function updateResultsCount() {
    const countEl = document.getElementById('results-count');
    if (!countEl) return;

    const count = shopState.filteredProducts.length;
    const total = shopState.allProducts.length;

    if (count === total) {
      countEl.textContent = `Showing all ${total} products`;
    } else {
      countEl.textContent = `Showing ${count} of ${total} products`;
    }
  }

  /**
   * Update active filters display
   */
  function updateActiveFiltersDisplay() {
    const container = document.getElementById('active-filters');
    const list = document.getElementById('active-filters-list');

    if (!container || !list) return;

    if (!FiltersModule.hasActiveFilters(shopState.filters)) {
      container.hidden = true;
      return;
    }

    container.hidden = false;
    const tags = [];

    // Categories
    shopState.filters.categories.forEach(category => {
      tags.push(createActiveFilterTag('category', category, category));
    });

    // Price range
    if (shopState.filters.minPrice !== null || shopState.filters.maxPrice !== null) {
      const priceLabel = `$${shopState.filters.minPrice || 0} - $${shopState.filters.maxPrice || '∞'}`;
      tags.push(createActiveFilterTag('price', 'price', priceLabel));
    }

    // Colors
    shopState.filters.colors.forEach(color => {
      tags.push(createActiveFilterTag('color', color, color));
    });

    // Sizes
    shopState.filters.sizes.forEach(size => {
      tags.push(createActiveFilterTag('size', size, size));
    });

    // In stock only
    if (shopState.filters.inStockOnly) {
      tags.push(createActiveFilterTag('inStock', 'inStock', 'In Stock Only'));
    }

    list.innerHTML = tags.join('');

    // Add click handlers for removing filters
    list.querySelectorAll('.active-filter-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        const filterType = this.getAttribute('data-filter-type');
        const filterValue = this.getAttribute('data-filter-value');
        removeFilter(filterType, filterValue);
      });
    });
  }

  /**
   * Create active filter tag HTML
   */
  function createActiveFilterTag(type, value, label) {
    return `
      <span class="active-filter-tag">
        ${label}
        <button class="active-filter-remove" data-filter-type="${type}" data-filter-value="${value}" aria-label="Remove filter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </span>
    `;
  }

  /**
   * Remove a specific filter
   */
  function removeFilter(type, value) {
    switch (type) {
      case 'category':
        shopState.filters.categories = shopState.filters.categories.filter(c => c !== value);
        break;
      case 'price':
        shopState.filters.minPrice = null;
        shopState.filters.maxPrice = null;
        break;
      case 'color':
        shopState.filters.colors = shopState.filters.colors.filter(c => c !== value);
        break;
      case 'size':
        shopState.filters.sizes = shopState.filters.sizes.filter(s => s !== value);
        break;
      case 'inStock':
        shopState.filters.inStockOnly = false;
        break;
    }

    applyShopFilters();
  }

  /**
   * Update filter count badge on mobile toggle
   */
  function updateFilterCountBadge() {
    const badge = document.getElementById('filter-count');
    if (!badge) return;

    const count = FiltersModule.getActiveFilterCount(shopState.filters);
    if (count > 0) {
      badge.textContent = count;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }

  /**
   * Sync form checkboxes with current filter state
   */
  function syncFormWithFilters() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;

    // Reset all checkboxes first
    filterForm.querySelectorAll('input[type="checkbox"]').forEach(check => {
      check.checked = false;
    });

    // Check category boxes
    shopState.filters.categories.forEach(category => {
      const check = filterForm.querySelector(`input[name="category"][value="${category}"]`);
      if (check) check.checked = true;
    });

    // Check color boxes
    shopState.filters.colors.forEach(color => {
      const check = filterForm.querySelector(`input[name="color"][value="${color}"]`);
      if (check) check.checked = true;
    });

    // Check size boxes
    shopState.filters.sizes.forEach(size => {
      const check = filterForm.querySelector(`input[name="size"][value="${size}"]`);
      if (check) check.checked = true;
    });

    // Check in-stock
    const inStockCheck = document.getElementById('in-stock-filter');
    if (inStockCheck) {
      inStockCheck.checked = shopState.filters.inStockOnly;
    }

    // Sync sort dropdowns
    const sortDesktop = document.getElementById('sort-desktop');
    const sortMobile = document.getElementById('sort-mobile');
    if (sortDesktop) sortDesktop.value = shopState.filters.sort;
    if (sortMobile) sortMobile.value = shopState.filters.sort;
  }

  /**
   * Clear all filters
   */
  function clearShopFilters() {
    shopState.filters = FiltersModule.getDefaultFilters();
    applyShopFilters();
  }

  /**
   * Handle browser back/forward navigation
   */
  function handleHistoryNavigation(filters) {
    shopState.filters = filters;
    applyShopFilters();
  }

  // ============================================
  // PRODUCT PAGE INITIALIZATION
  // ============================================

  // Product page state
  let productState = {
    product: null,
    selectedColor: null,
    selectedSize: null,
    quantity: 1,
    activeTab: 'description'
  };

  /**
   * Initialize product page functionality
   */
  async function initProductPage() {
    // Get product ID from URL
    const productId = getQueryParam('id');

    if (!productId) {
      showProductError();
      return;
    }

    try {
      // Load product data
      await loadProductData(productId);

      if (!productState.product) {
        showProductError();
        return;
      }

      // Render product content
      renderProductPage();

      // Initialize product interactions
      initProductInteractions();

      // Load related products
      await loadRelatedProducts();

    } catch (error) {
      console.error('Error initializing product page:', error);
      showProductError();
    }
  }

  /**
   * Load product data by ID
   */
  async function loadProductData(productId) {
    if (typeof ProductsModule !== 'undefined') {
      await ProductsModule.loadProducts();
      productState.product = await ProductsModule.getProductById(productId);

      if (productState.product) {
        // Set defaults
        productState.selectedColor = productState.product.colors[0];
        productState.selectedSize = productState.product.sizes[0];
        productState.quantity = 1;
      }
    }
  }

  /**
   * Show product error state
   */
  function showProductError() {
    const loading = document.getElementById('product-loading');
    const error = document.getElementById('product-error');
    const content = document.getElementById('product-content');

    if (loading) loading.hidden = true;
    if (error) error.hidden = false;
    if (content) content.hidden = true;
  }

  /**
   * Render the product page content
   */
  function renderProductPage() {
    const product = productState.product;
    const loading = document.getElementById('product-loading');
    const error = document.getElementById('product-error');
    const content = document.getElementById('product-content');

    // Hide loading and error, show content
    if (loading) loading.hidden = true;
    if (error) error.hidden = true;
    if (content) content.hidden = false;

    // Update page title
    document.title = `${product.name} | Mustache Harnesses Co.`;

    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-product');
    if (breadcrumb) breadcrumb.textContent = product.name;

    // Render images
    renderProductImages();

    // Render product info
    renderProductInfo();

    // Render options
    renderColorOptions();
    renderSizeOptions();

    // Render tabs content
    renderProductTabs();
  }

  /**
   * Render product images and thumbnails
   */
  function renderProductImages() {
    const product = productState.product;
    const mainImage = document.getElementById('main-image');
    const thumbnailContainer = document.getElementById('product-thumbnails');

    // Set main image (use relative path)
    const mainImagePath = product.images[0].startsWith('/') ? '..' + product.images[0] : '../' + product.images[0];
    mainImage.src = mainImagePath;
    mainImage.alt = product.name;

    // Render thumbnails
    if (thumbnailContainer && product.images.length > 1) {
      thumbnailContainer.innerHTML = product.images.map((img, index) => {
        const imgPath = img.startsWith('/') ? '..' + img : '../' + img;
        return `
          <button class="product-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="View image ${index + 1}">
            <img src="${imgPath}" alt="${product.name} - Image ${index + 1}" loading="lazy">
          </button>
        `;
      }).join('');
    } else if (thumbnailContainer) {
      thumbnailContainer.style.display = 'none';
    }
  }

  /**
   * Render product info section
   */
  function renderProductInfo() {
    const product = productState.product;

    // Category
    const categoryEl = document.getElementById('product-category');
    if (categoryEl) categoryEl.textContent = product.category;

    // Title
    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = product.name;

    // Rating
    const ratingEl = document.getElementById('product-rating');
    if (ratingEl) ratingEl.innerHTML = createStarRating(product.rating, 'lg');

    // Review count
    const reviewCountEl = document.getElementById('product-review-count');
    if (reviewCountEl) reviewCountEl.textContent = `${product.reviewCount} reviews`;

    // Price
    const priceEl = document.getElementById('product-price');
    if (priceEl) {
      priceEl.innerHTML = `<span class="price-current">${formatCurrency(product.price)}</span>`;
    }

    // Short description (first 150 chars)
    const shortDescEl = document.getElementById('product-description-short');
    if (shortDescEl) {
      const shortDesc = product.description.length > 150
        ? product.description.substring(0, 150) + '...'
        : product.description;
      shortDescEl.textContent = shortDesc;
    }

    // Stock status
    renderStockStatus();
  }

  /**
   * Render stock status indicator
   */
  function renderStockStatus() {
    const product = productState.product;
    const stockEl = document.getElementById('product-stock');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    if (!stockEl) return;

    if (!product.inStock) {
      stockEl.className = 'product-stock out-of-stock';
      stockEl.innerHTML = '<span class="product-stock-dot"></span> Out of Stock';
      if (addToCartBtn) {
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Out of Stock';
      }
    } else if (product.stockCount <= 5) {
      stockEl.className = 'product-stock low-stock';
      stockEl.innerHTML = `<span class="product-stock-dot"></span> Only ${product.stockCount} left in stock`;
    } else {
      stockEl.className = 'product-stock in-stock';
      stockEl.innerHTML = '<span class="product-stock-dot"></span> In Stock';
    }
  }

  /**
   * Render color selection options
   */
  function renderColorOptions() {
    const product = productState.product;
    const colorSwatches = document.getElementById('color-swatches');
    const selectedColorEl = document.getElementById('selected-color');

    if (!colorSwatches) return;

    colorSwatches.innerHTML = product.colors.map(color => `
      <button
        class="product-color-swatch ${color === productState.selectedColor ? 'active' : ''}"
        data-color="${color}"
        style="background-color: ${getColorHex(color)}"
        aria-label="${color}"
        title="${color}">
      </button>
    `).join('');

    if (selectedColorEl) {
      selectedColorEl.textContent = productState.selectedColor;
    }
  }

  /**
   * Render size selection options
   */
  function renderSizeOptions() {
    const product = productState.product;
    const sizeButtons = document.getElementById('size-buttons');
    const selectedSizeEl = document.getElementById('selected-size');

    if (!sizeButtons) return;

    sizeButtons.innerHTML = product.sizes.map(size => `
      <button
        class="product-size-btn ${size === productState.selectedSize ? 'active' : ''}"
        data-size="${size}">
        ${size}
      </button>
    `).join('');

    if (selectedSizeEl) {
      selectedSizeEl.textContent = productState.selectedSize;
    }
  }

  /**
   * Render product tabs content
   */
  function renderProductTabs() {
    const product = productState.product;

    // Full description
    const descEl = document.getElementById('product-description-full');
    if (descEl) {
      descEl.innerHTML = `<p>${product.description}</p>`;
    }

    // Specifications
    const specsBody = document.getElementById('specifications-tbody');
    if (specsBody) {
      specsBody.innerHTML = `
        <tr>
          <th>Category</th>
          <td>${product.category}</td>
        </tr>
        <tr>
          <th>Available Sizes</th>
          <td>${product.sizes.join(', ')}</td>
        </tr>
        <tr>
          <th>Available Colors</th>
          <td>${product.colors.join(', ')}</td>
        </tr>
        <tr>
          <th>Materials</th>
          <td>Premium-grade polymer composite, medical-grade silicone, stainless steel hardware</td>
        </tr>
        <tr>
          <th>Care Instructions</th>
          <td>Wipe clean with a soft cloth. Do not submerge in water. Store in a cool, dry place.</td>
        </tr>
        <tr>
          <th>Warranty</th>
          <td>90-day manufacturer warranty against defects</td>
        </tr>
      `;
    }

    // Reviews tab count
    const reviewsTabCount = document.getElementById('reviews-tab-count');
    if (reviewsTabCount) {
      reviewsTabCount.textContent = `(${product.reviewCount})`;
    }

    // Reviews summary
    renderReviewsSummary();

    // Reviews list
    renderReviewsList();
  }

  /**
   * Render reviews summary with rating breakdown
   */
  function renderReviewsSummary() {
    const product = productState.product;

    // Rating number
    const ratingNumber = document.getElementById('reviews-rating-number');
    if (ratingNumber) ratingNumber.textContent = product.rating.toFixed(1);

    // Rating stars
    const ratingStars = document.getElementById('reviews-rating-stars');
    if (ratingStars) ratingStars.innerHTML = createStarRating(product.rating, 'lg');

    // Total reviews
    const totalReviews = document.getElementById('reviews-total');
    if (totalReviews) totalReviews.textContent = `Based on ${product.reviewCount} reviews`;

    // Rating breakdown (simulate distribution based on actual reviews)
    const breakdown = document.getElementById('reviews-breakdown');
    if (breakdown) {
      // Calculate distribution from actual reviews
      const reviews = product.reviews || [];
      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(r => {
        if (counts[r.rating] !== undefined) counts[r.rating]++;
      });

      // Scale to total review count
      const reviewedCount = reviews.length;
      const scale = reviewedCount > 0 ? product.reviewCount / reviewedCount : 1;

      breakdown.innerHTML = [5, 4, 3, 2, 1].map(rating => {
        const count = Math.round(counts[rating] * scale);
        const percentage = product.reviewCount > 0 ? (count / product.reviewCount) * 100 : 0;
        return `
          <div class="review-bar">
            <span class="review-bar-label">${rating} stars</span>
            <div class="review-bar-track">
              <div class="review-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <span class="review-bar-count">${count}</span>
          </div>
        `;
      }).join('');
    }
  }

  /**
   * Render individual reviews list
   */
  function renderReviewsList() {
    const product = productState.product;
    const reviewsList = document.getElementById('reviews-list');

    if (!reviewsList || !product.reviews) return;

    reviewsList.innerHTML = product.reviews.map(review => {
      const date = new Date(review.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return `
        <article class="review-card">
          <div class="review-header">
            <div>
              <h4 class="review-author">${review.name}</h4>
              <span class="review-date">${formattedDate}</span>
            </div>
            <div class="review-rating">
              ${createStarRating(review.rating, 'sm')}
            </div>
          </div>
          <p class="review-text">${review.text}</p>
        </article>
      `;
    }).join('');
  }

  /**
   * Load and render related products
   */
  async function loadRelatedProducts() {
    const product = productState.product;
    const grid = document.getElementById('related-products-grid');

    if (!grid || typeof ProductsModule === 'undefined') return;

    try {
      const related = await ProductsModule.getRelatedProducts(product.id, 4);

      if (related && related.length > 0) {
        grid.innerHTML = related.map(p => createProductCardShop(p)).join('');
      } else {
        // Hide related products section if none found
        const section = document.getElementById('related-products');
        if (section) section.style.display = 'none';
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  }

  /**
   * Initialize product page interactions
   */
  function initProductInteractions() {
    // Thumbnail clicks
    initThumbnailClicks();

    // Color swatch clicks
    initColorSwatchClicks();

    // Size button clicks
    initSizeButtonClicks();

    // Quantity selector
    initQuantitySelector(document.querySelector('.product-info'));

    // Add to cart button
    initAddToCartButton();

    // Tab navigation
    initProductTabs();
  }

  /**
   * Initialize thumbnail image switching
   */
  function initThumbnailClicks() {
    const thumbnailContainer = document.getElementById('product-thumbnails');
    if (!thumbnailContainer) return;

    thumbnailContainer.addEventListener('click', function(e) {
      const thumbnail = e.target.closest('.product-thumbnail');
      if (!thumbnail) return;

      const index = parseInt(thumbnail.dataset.index);
      const product = productState.product;

      // Update main image
      const mainImage = document.getElementById('main-image');
      if (mainImage && product.images[index]) {
        const imgPath = product.images[index].startsWith('/')
          ? '..' + product.images[index]
          : '../' + product.images[index];
        mainImage.src = imgPath;
      }

      // Update active thumbnail
      thumbnailContainer.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
      thumbnail.classList.add('active');
    });
  }

  /**
   * Initialize color swatch selection
   */
  function initColorSwatchClicks() {
    const colorSwatches = document.getElementById('color-swatches');
    if (!colorSwatches) return;

    colorSwatches.addEventListener('click', function(e) {
      const swatch = e.target.closest('.product-color-swatch');
      if (!swatch) return;

      const color = swatch.dataset.color;
      productState.selectedColor = color;

      // Update active state
      colorSwatches.querySelectorAll('.product-color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Update selected color text
      const selectedColorEl = document.getElementById('selected-color');
      if (selectedColorEl) selectedColorEl.textContent = color;
    });
  }

  /**
   * Initialize size button selection
   */
  function initSizeButtonClicks() {
    const sizeButtons = document.getElementById('size-buttons');
    if (!sizeButtons) return;

    sizeButtons.addEventListener('click', function(e) {
      const btn = e.target.closest('.product-size-btn');
      if (!btn) return;

      const size = btn.dataset.size;
      productState.selectedSize = size;

      // Update active state
      sizeButtons.querySelectorAll('.product-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update selected size text
      const selectedSizeEl = document.getElementById('selected-size');
      if (selectedSizeEl) selectedSizeEl.textContent = size;
    });
  }

  /**
   * Initialize add to cart button
   */
  function initAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', async function() {
      const product = productState.product;

      if (!product || !product.inStock) return;

      // Disable button and show loading
      addToCartBtn.disabled = true;
      const originalText = addToCartBtn.textContent;
      addToCartBtn.innerHTML = '<span class="spinner spinner-sm"></span> Adding...';

      // Get quantity
      const quantityInput = document.querySelector('#product-quantity .quantity-input');
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      try {
        if (typeof CartModule !== 'undefined') {
          // Get image path (use relative path)
          const imagePath = product.images[0].startsWith('/')
            ? '..' + product.images[0]
            : '../' + product.images[0];

          CartModule.addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            size: productState.selectedSize,
            color: productState.selectedColor,
            quantity: quantity,
            image: imagePath
          });

          // Update cart badge
          updateCartBadge();

          // Show toast
          showAddedToCartToast({
            name: product.name,
            image: imagePath,
            size: productState.selectedSize,
            color: productState.selectedColor,
            quantity: quantity
          });

          // Dispatch cart updated event
          document.dispatchEvent(new CustomEvent('cartUpdated'));
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast({ title: 'Error', message: 'Could not add item to cart', type: 'error' });
      } finally {
        addToCartBtn.disabled = false;
        addToCartBtn.textContent = originalText;
      }
    });
  }

  /**
   * Initialize product tabs
   */
  function initProductTabs() {
    const tabButtons = document.querySelectorAll('.product-tab-btn');
    const tabPanels = document.querySelectorAll('.product-tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const tabId = this.getAttribute('aria-controls');

        // Update button states
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Update panel visibility
        tabPanels.forEach(panel => {
          panel.classList.remove('active');
          panel.hidden = true;
        });

        const activePanel = document.getElementById(tabId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.hidden = false;
        }
      });
    });

    // Handle anchor link to reviews tab
    if (window.location.hash === '#product-reviews') {
      const reviewsBtn = document.getElementById('tab-btn-reviews');
      if (reviewsBtn) reviewsBtn.click();
    }
  }

  // ============================================
  // CART PAGE INITIALIZATION
  // ============================================

  /**
   * Initialize cart page functionality
   */
  function initCartPage() {
    // Render cart items
    renderCartPage();

    // Initialize promo code functionality
    initPromoCode();

    // Listen for cart updates
    document.addEventListener('cartUpdated', renderCartPage);
  }

  /**
   * Render the entire cart page
   */
  function renderCartPage() {
    const loading = document.getElementById('cart-loading');
    const emptyState = document.getElementById('cart-empty');
    const itemsContainer = document.getElementById('cart-items');
    const summarySection = document.getElementById('cart-summary');
    const continueSection = document.getElementById('cart-continue');

    // Get cart data
    if (typeof CartModule === 'undefined') {
      if (loading) loading.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }

    const cart = CartModule.getCart();
    const summary = CartModule.getCartSummary();

    // Hide loading
    if (loading) loading.hidden = true;

    // Update header count
    const headerCount = document.getElementById('cart-header-count');
    if (headerCount) {
      const itemCount = summary.itemCount;
      headerCount.textContent = itemCount === 1 ? '1 item' : `${itemCount} items`;
    }

    // Show empty state or cart items
    if (cart.length === 0) {
      if (emptyState) emptyState.hidden = false;
      if (itemsContainer) itemsContainer.hidden = true;
      if (summarySection) summarySection.hidden = true;
      if (continueSection) continueSection.hidden = true;
      return;
    }

    // Show cart items
    if (emptyState) emptyState.hidden = true;
    if (itemsContainer) itemsContainer.hidden = false;
    if (summarySection) summarySection.hidden = false;
    if (continueSection) continueSection.hidden = false;

    // Render cart items
    renderCartItems(cart);

    // Render summary
    renderCartSummary(summary);

    // Update promo display
    updatePromoDisplay();
  }

  /**
   * Render cart items list
   * @param {Array} cart - Cart items array
   */
  function renderCartItems(cart) {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = cart.map(item => createCartItemHTML(item)).join('');

    // Initialize quantity selectors
    container.querySelectorAll('.quantity-selector').forEach(selector => {
      initCartItemQuantity(selector);
    });

    // Initialize remove buttons
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', handleRemoveItem);
    });
  }

  /**
   * Create HTML for a single cart item
   * @param {Object} item - Cart item data
   * @returns {string} HTML string
   */
  function createCartItemHTML(item) {
    const lineTotal = item.price * item.quantity;

    // Adjust image path for pages directory
    let imagePath = item.image;
    if (!imagePath.startsWith('../') && !imagePath.startsWith('http')) {
      imagePath = '../' + imagePath;
    }

    return `
      <article class="cart-item" data-cart-id="${item.cartId}">
        <div class="cart-item-image">
          <a href="product.html?id=${item.productId}">
            <img src="${imagePath}" alt="${item.name}" loading="lazy">
          </a>
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">
            <a href="product.html?id=${item.productId}">${item.name}</a>
          </h3>
          <p class="cart-item-variant">${item.color} / ${item.size}</p>
          <p class="cart-item-price-mobile">${formatCurrency(item.price)}</p>
          <div class="cart-item-actions">
            <div class="cart-item-quantity">
              <div class="quantity-selector quantity-selector-sm" data-cart-id="${item.cartId}">
                <button type="button" class="quantity-btn" data-action="decrease" aria-label="Decrease quantity" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" aria-label="Quantity">
                <button type="button" class="quantity-btn" data-action="increase" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button type="button" class="cart-item-remove" data-cart-id="${item.cartId}" aria-label="Remove ${item.name} from cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </button>
          </div>
        </div>
        <div class="cart-item-pricing">
          <span class="cart-item-line-price">${formatCurrency(lineTotal)}</span>
          ${item.quantity > 1 ? `<span class="cart-item-unit-price">${formatCurrency(item.price)} each</span>` : ''}
        </div>
      </article>
    `;
  }

  /**
   * Initialize quantity selector for cart item
   * @param {HTMLElement} selector - Quantity selector element
   */
  function initCartItemQuantity(selector) {
    const minusBtn = selector.querySelector('[data-action="decrease"]');
    const plusBtn = selector.querySelector('[data-action="increase"]');
    const input = selector.querySelector('.quantity-input');
    const cartId = selector.dataset.cartId;

    if (!minusBtn || !plusBtn || !input || !cartId) return;

    function updateCartQuantity(newValue) {
      const value = Math.max(1, Math.min(99, parseInt(newValue) || 1));
      input.value = value;
      minusBtn.disabled = value <= 1;
      plusBtn.disabled = value >= 99;

      // Update cart
      if (typeof CartModule !== 'undefined') {
        CartModule.updateQuantity(cartId, value);
        updateCartBadge();
        renderCartSummary(CartModule.getCartSummary());

        // Update line price for this item
        const cartItem = selector.closest('.cart-item');
        if (cartItem) {
          const item = CartModule.getCart().find(i => i.cartId === cartId);
          if (item) {
            const linePrice = cartItem.querySelector('.cart-item-line-price');
            const unitPrice = cartItem.querySelector('.cart-item-unit-price');
            if (linePrice) linePrice.textContent = formatCurrency(item.price * value);
            if (unitPrice) {
              if (value > 1) {
                unitPrice.textContent = `${formatCurrency(item.price)} each`;
                unitPrice.style.display = '';
              } else {
                unitPrice.style.display = 'none';
              }
            }
          }
        }
      }
    }

    minusBtn.addEventListener('click', () => {
      updateCartQuantity(parseInt(input.value) - 1);
    });

    plusBtn.addEventListener('click', () => {
      updateCartQuantity(parseInt(input.value) + 1);
    });

    input.addEventListener('change', () => {
      updateCartQuantity(input.value);
    });

    input.addEventListener('blur', () => {
      if (input.value === '' || isNaN(parseInt(input.value))) {
        updateCartQuantity(1);
      }
    });
  }

  /**
   * Handle remove item button click
   * @param {Event} e - Click event
   */
  function handleRemoveItem(e) {
    const btn = e.currentTarget;
    const cartId = btn.dataset.cartId;
    const cartItem = btn.closest('.cart-item');

    if (!cartId || typeof CartModule === 'undefined') return;

    // Add exit animation
    if (cartItem) {
      cartItem.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(-20px)';
    }

    setTimeout(() => {
      CartModule.removeFromCart(cartId);
      updateCartBadge();
      renderCartPage();
    }, 200);
  }

  /**
   * Render cart summary section
   * @param {Object} summary - Cart summary data
   */
  function renderCartSummary(summary) {
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    const headerCount = document.getElementById('cart-header-count');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(summary.subtotal);

    if (discountRow && discountEl) {
      if (summary.discount > 0) {
        discountRow.hidden = false;
        discountEl.textContent = `-${formatCurrency(summary.discount)}`;
      } else {
        discountRow.hidden = true;
      }
    }

    if (totalEl) totalEl.textContent = formatCurrency(summary.total);

    if (headerCount) {
      headerCount.textContent = summary.itemCount === 1 ? '1 item' : `${summary.itemCount} items`;
    }
  }

  /**
   * Initialize promo code functionality
   */
  function initPromoCode() {
    const input = document.getElementById('promo-code');
    const applyBtn = document.getElementById('apply-promo');
    const removeBtn = document.getElementById('remove-promo');

    if (applyBtn) {
      applyBtn.addEventListener('click', handleApplyPromo);
    }

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleApplyPromo();
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', handleRemovePromo);
    }
  }

  /**
   * Handle apply promo code
   */
  function handleApplyPromo() {
    const input = document.getElementById('promo-code');
    const messageEl = document.getElementById('promo-message');

    if (!input || typeof CartModule === 'undefined') return;

    const code = input.value.trim();
    if (!code) {
      showPromoMessage('Please enter a promo code', 'error');
      return;
    }

    const result = CartModule.applyPromoCode(code);

    if (result.success) {
      showPromoMessage('', '');
      updatePromoDisplay();
      renderCartSummary(CartModule.getCartSummary());
      input.value = '';
    } else {
      showPromoMessage(result.message || 'Invalid promo code', 'error');
    }
  }

  /**
   * Handle remove promo code
   */
  function handleRemovePromo() {
    if (typeof CartModule === 'undefined') return;

    CartModule.removePromoCode();
    updatePromoDisplay();
    renderCartSummary(CartModule.getCartSummary());
    showPromoMessage('', '');
  }

  /**
   * Show promo code message
   * @param {string} message - Message text
   * @param {string} type - 'success' or 'error'
   */
  function showPromoMessage(message, type) {
    const messageEl = document.getElementById('promo-message');
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.className = 'cart-promo-message';
    if (type) {
      messageEl.classList.add(type);
    }
  }

  /**
   * Update promo display based on applied promo
   */
  function updatePromoDisplay() {
    const inputGroup = document.querySelector('.cart-promo-input-group');
    const appliedSection = document.getElementById('promo-applied');
    const appliedCodeText = document.getElementById('applied-code-text');

    if (typeof CartModule === 'undefined') return;

    const promo = CartModule.getAppliedPromo();

    if (promo) {
      if (inputGroup) inputGroup.style.display = 'none';
      if (appliedSection) appliedSection.hidden = false;
      if (appliedCodeText) appliedCodeText.textContent = promo.toUpperCase();
    } else {
      if (inputGroup) inputGroup.style.display = 'flex';
      if (appliedSection) appliedSection.hidden = true;
    }
  }

  // ============================================
  // CHECKOUT PAGE INITIALIZATION
  // ============================================

  // Checkout page state
  let checkoutState = {
    cartItems: [],
    summary: null
  };

  const checkoutRequiredFields = [
    'email',
    'firstName',
    'lastName',
    'address1',
    'city',
    'state',
    'zipCode',
    'country'
  ];

  /**
   * Initialize checkout page functionality
   */
  function initCheckoutPage() {
    const emptyState = document.getElementById('checkout-empty');
    const layout = document.getElementById('checkout-layout');
    const form = document.getElementById('checkout-form');

    if (!form) return;

    if (typeof CartModule === 'undefined') {
      if (emptyState) emptyState.hidden = false;
      if (layout) layout.hidden = true;
      return;
    }

    checkoutState.cartItems = CartModule.getCart();
    checkoutState.summary = CartModule.getCartSummary();

    if (!checkoutState.cartItems.length) {
      if (emptyState) emptyState.hidden = false;
      if (layout) layout.hidden = true;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (layout) layout.hidden = false;

    renderCheckoutSummary(checkoutState.cartItems, checkoutState.summary);
    initCheckoutForm(form);
    updateCheckoutSubmitState(getCheckoutFormData());
  }

  /**
   * Initialize checkout form listeners
   * @param {HTMLFormElement} form - Checkout form element
   */
  function initCheckoutForm(form) {
    form.addEventListener('input', handleCheckoutFieldChange);
    form.addEventListener('change', handleCheckoutFieldChange);
    form.addEventListener('submit', handleCheckoutSubmit);
  }

  /**
   * Handle live field validation
   * @param {Event} event - Input/change event
   */
  function handleCheckoutFieldChange(event) {
    const target = event.target;
    if (!target || !target.name) return;

    const formData = getCheckoutFormData();
    validateCheckoutField(target.name, formData, true);
    updateCheckoutSubmitState(formData);
  }

  /**
   * Handle checkout form submission
   * @param {Event} event - Submit event
   */
  function handleCheckoutSubmit(event) {
    event.preventDefault();

    const formData = getCheckoutFormData();
    const isValid = validateCheckoutFormData(formData, true);

    if (!isValid) {
      const firstInvalid = document.querySelector('.checkout-form .is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    processCheckoutOrder(formData);
  }

  /**
   * Get checkout form data
   * @returns {Object} Form data object
   */
  function getCheckoutFormData() {
    return {
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      firstName: document.getElementById('firstName')?.value || '',
      lastName: document.getElementById('lastName')?.value || '',
      address1: document.getElementById('address1')?.value || '',
      address2: document.getElementById('address2')?.value || '',
      city: document.getElementById('city')?.value || '',
      state: document.getElementById('state')?.value || '',
      zipCode: document.getElementById('zipCode')?.value || '',
      country: document.getElementById('country')?.value || '',
      deliveryNotes: document.getElementById('deliveryNotes')?.value || ''
    };
  }

  /**
   * Validate the entire checkout form
   * @param {Object} formData - Form data object
   * @param {boolean} showErrors - Whether to display errors
   * @returns {boolean} Whether the form is valid
   */
  function validateCheckoutFormData(formData, showErrors) {
    let isValid = true;

    checkoutRequiredFields.forEach(field => {
      const fieldValid = validateCheckoutField(field, formData, showErrors);
      if (!fieldValid) isValid = false;
    });

    // Optional phone field validation
    const phoneValid = validateCheckoutField('phone', formData, showErrors);
    if (!phoneValid) isValid = false;

    return isValid;
  }

  /**
   * Validate a single checkout field
   * @param {string} fieldName - Field name
   * @param {Object} formData - Form data
   * @param {boolean} showErrors - Whether to show error messages
   * @returns {boolean} Whether the field is valid
   */
  function validateCheckoutField(fieldName, formData, showErrors) {
    const input = document.getElementById(fieldName);
    if (!input || typeof CheckoutModule === 'undefined') return true;

    let result = { valid: true, message: '' };

    switch (fieldName) {
      case 'email':
        result = CheckoutModule.validateEmail(formData.email);
        break;
      case 'phone':
        result = CheckoutModule.validatePhone(formData.phone, false);
        break;
      case 'firstName':
        result = CheckoutModule.validateRequired(formData.firstName, 'First name');
        break;
      case 'lastName':
        result = CheckoutModule.validateRequired(formData.lastName, 'Last name');
        break;
      case 'address1':
        result = CheckoutModule.validateRequired(formData.address1, 'Address');
        break;
      case 'city':
        result = CheckoutModule.validateRequired(formData.city, 'City');
        break;
      case 'state':
        result = CheckoutModule.validateRequired(formData.state, 'State/Province');
        break;
      case 'zipCode':
        result = CheckoutModule.validateZipCode(formData.zipCode, formData.country);
        break;
      case 'country':
        result = CheckoutModule.validateRequired(formData.country, 'Country');
        break;
      default:
        result = { valid: true, message: '' };
    }

    if (showErrors) {
      updateCheckoutFieldUI(input, fieldName, result);
    }

    return result.valid;
  }

  /**
   * Update field UI with validation state
   * @param {HTMLElement} input - Input element
   * @param {string} fieldName - Field name
   * @param {Object} result - Validation result
   */
  function updateCheckoutFieldUI(input, fieldName, result) {
    const errorEl = document.getElementById(`error-${fieldName}`);

    if (result.valid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorEl) errorEl.textContent = '';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = result.message || 'This field is required.';
    }
  }

  /**
   * Update submit button state
   * @param {Object} formData - Form data
   */
  function updateCheckoutSubmitState(formData) {
    const submitBtn = document.getElementById('place-order-btn');
    if (!submitBtn) return;

    const isValid = validateCheckoutFormData(formData, false);
    submitBtn.disabled = !isValid;
  }

  /**
   * Render checkout summary sidebar
   * @param {Array} items - Cart items
   * @param {Object} summary - Cart summary
   */
  function renderCheckoutSummary(items, summary) {
    const itemsContainer = document.getElementById('checkout-items');
    if (itemsContainer) {
      itemsContainer.innerHTML = items.map(item => createCheckoutItemHTML(item)).join('');
    }

    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const discountRow = document.getElementById('checkout-discount-row');
    const discountEl = document.getElementById('checkout-discount');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(summary.subtotal);
    if (totalEl) totalEl.textContent = formatCurrency(summary.total);

    if (discountRow && discountEl) {
      if (summary.discount > 0) {
        discountRow.hidden = false;
        discountEl.textContent = `-${formatCurrency(summary.discount)}`;
      } else {
        discountRow.hidden = true;
      }
    }
  }

  /**
   * Create checkout summary item HTML
   * @param {Object} item - Cart item
   * @returns {string} HTML string
   */
  function createCheckoutItemHTML(item) {
    let imagePath = item.image;
    if (!imagePath.startsWith('../') && !imagePath.startsWith('http')) {
      imagePath = '../' + imagePath;
    }

    return `
      <div class="checkout-item">
        <div class="checkout-item-image">
          <img src="${imagePath}" alt="${item.name}" loading="lazy">
        </div>
        <div class="checkout-item-details">
          <div class="checkout-item-name">${item.name}</div>
          <div class="checkout-item-meta">${item.color} / ${item.size}</div>
          <div class="checkout-item-qty">Qty: ${item.quantity}</div>
        </div>
        <div class="checkout-item-price">${formatCurrency(item.price * item.quantity)}</div>
      </div>
    `;
  }

  /**
   * Process checkout order and redirect to confirmation
   * @param {Object} formData - Form data
   */
  function processCheckoutOrder(formData) {
    const submitBtn = document.getElementById('place-order-btn');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner spinner-sm"></span> Processing...';
    }

    try {
      const cartItems = checkoutState.cartItems || [];
      const summary = checkoutState.summary || (CartModule ? CartModule.getCartSummary() : null);

      if (!summary || cartItems.length === 0) {
        showToast({ title: 'Cart Empty', message: 'Please add items to your cart.', type: 'warning' });
        return;
      }

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
          country: formData.country.trim(),
          notes: formData.deliveryNotes ? formData.deliveryNotes.trim() : ''
        },
        contact: {
          email: formData.email.trim(),
          phone: formData.phone ? formData.phone.trim() : ''
        },
        payment: {
          method: 'Invoice on Delivery',
          cardLast4: '0000',
          cardName: 'Invoice on Delivery'
        },
        totals: {
          subtotal: summary.subtotal,
          discount: summary.discount,
          promoCode: summary.promoCode,
          shipping: summary.shipping,
          total: summary.total
        }
      };

      let savedOrder = order;
      if (window.CheckoutModule && typeof window.CheckoutModule.saveOrder === 'function') {
        savedOrder = window.CheckoutModule.saveOrder(order);
      }

      if (window.CartModule && typeof window.CartModule.clearCart === 'function') {
        window.CartModule.clearCart();
      }

      updateCartBadge();

      const orderNumber = savedOrder.orderNumber || '';
      const targetUrl = orderNumber ? `confirmation.html?order=${encodeURIComponent(orderNumber)}` : 'confirmation.html';
      window.location.href = targetUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      showToast({ title: 'Checkout failed', message: 'Please try again.', type: 'error' });
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  }

  // ============================================
  // CONFIRMATION PAGE INITIALIZATION
  // ============================================

  /**
   * Initialize confirmation page functionality
   */
  function initConfirmationPage() {
    const loadingEl = document.getElementById('confirmation-loading');
    const errorEl = document.getElementById('confirmation-error');
    const contentEl = document.getElementById('confirmation-content');

    if (!loadingEl || !errorEl || !contentEl) return;

    // Get order number from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('order');

    if (!orderNumber) {
      showConfirmationError(loadingEl, errorEl, contentEl);
      return;
    }

    // Try to get order from localStorage
    if (typeof CheckoutModule === 'undefined' || !CheckoutModule.getOrderByNumber) {
      showConfirmationError(loadingEl, errorEl, contentEl);
      return;
    }

    const order = CheckoutModule.getOrderByNumber(orderNumber);

    if (!order) {
      showConfirmationError(loadingEl, errorEl, contentEl);
      return;
    }

    // Render order details
    renderConfirmationPage(order, loadingEl, errorEl, contentEl);
  }

  /**
   * Show confirmation error state
   * @param {HTMLElement} loadingEl - Loading element
   * @param {HTMLElement} errorEl - Error element
   * @param {HTMLElement} contentEl - Content element
   */
  function showConfirmationError(loadingEl, errorEl, contentEl) {
    loadingEl.hidden = true;
    errorEl.hidden = false;
    contentEl.hidden = true;
  }

  /**
   * Render confirmation page with order data
   * @param {Object} order - Order object
   * @param {HTMLElement} loadingEl - Loading element
   * @param {HTMLElement} errorEl - Error element
   * @param {HTMLElement} contentEl - Content element
   */
  function renderConfirmationPage(order, loadingEl, errorEl, contentEl) {
    // Hide loading, show content
    loadingEl.hidden = true;
    errorEl.hidden = true;
    contentEl.hidden = false;

    // Populate order number
    const orderNumberEl = document.getElementById('order-number');
    if (orderNumberEl) {
      orderNumberEl.textContent = order.orderNumber;
    }

    // Populate email
    const orderEmailEl = document.getElementById('order-email');
    if (orderEmailEl && order.contact) {
      orderEmailEl.textContent = order.contact.email;
    }

    // Populate shipping address
    const shippingAddressEl = document.getElementById('shipping-address');
    if (shippingAddressEl && order.shipping) {
      const s = order.shipping;
      shippingAddressEl.innerHTML = `
        <div class="confirmation-address-name">${s.firstName} ${s.lastName}</div>
        <div>${s.address1}</div>
        ${s.address2 ? `<div>${s.address2}</div>` : ''}
        <div>${s.city}, ${s.state} ${s.zipCode}</div>
        <div>${getCountryName(s.country)}</div>
      `;
    }

    // Populate payment method
    const paymentMethodEl = document.getElementById('payment-method');
    if (paymentMethodEl && order.payment) {
      const p = order.payment;
      if (p.method === 'Invoice on Delivery' || p.cardLast4 === '0000') {
        paymentMethodEl.innerHTML = `
          <div class="confirmation-payment-method">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Invoice on Delivery
          </div>
          <div class="confirmation-payment-card">Payment due upon receipt</div>
        `;
      } else {
        paymentMethodEl.innerHTML = `
          <div class="confirmation-payment-method">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Credit Card
          </div>
          <div class="confirmation-payment-card">**** **** **** ${p.cardLast4}</div>
        `;
      }
    }

    // Populate order items
    const orderItemsEl = document.getElementById('order-items');
    if (orderItemsEl && order.items) {
      orderItemsEl.innerHTML = order.items.map(item => createConfirmationItemHTML(item)).join('');
    }

    // Populate totals
    if (order.totals) {
      const subtotalEl = document.getElementById('order-subtotal');
      const totalEl = document.getElementById('order-total');
      const discountRow = document.getElementById('discount-row');
      const discountEl = document.getElementById('order-discount');
      const promoCodeEl = document.getElementById('order-promo-code');

      if (subtotalEl) subtotalEl.textContent = formatCurrency(order.totals.subtotal);
      if (totalEl) totalEl.textContent = formatCurrency(order.totals.total);

      if (discountRow && order.totals.discount > 0) {
        discountRow.hidden = false;
        if (discountEl) discountEl.textContent = `-${formatCurrency(order.totals.discount)}`;
        if (promoCodeEl) promoCodeEl.textContent = order.totals.promoCode || 'PROMO';
      }
    }
  }

  /**
   * Create confirmation item HTML
   * @param {Object} item - Order item
   * @returns {string} HTML string
   */
  function createConfirmationItemHTML(item) {
    let imagePath = item.image || '';
    if (imagePath && !imagePath.startsWith('../') && !imagePath.startsWith('http')) {
      imagePath = '../' + imagePath;
    }

    return `
      <div class="confirmation-item">
        <div class="confirmation-item-image">
          <img src="${imagePath}" alt="${item.name}" loading="lazy">
        </div>
        <div class="confirmation-item-details">
          <div class="confirmation-item-name">${item.name}</div>
          <div class="confirmation-item-meta">${item.color} / ${item.size}</div>
          <div class="confirmation-item-qty">Qty: ${item.quantity}</div>
        </div>
        <div class="confirmation-item-price">${formatCurrency(item.price * item.quantity)}</div>
      </div>
    `;
  }

  /**
   * Get country name from country code
   * @param {string} code - Country code
   * @returns {string} Country name
   */
  function getCountryName(code) {
    const countries = {
      'US': 'United States',
      'CA': 'Canada',
      'UK': 'United Kingdom',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'NL': 'Netherlands',
      'OTHER': 'International'
    };
    return countries[code] || code || 'United States';
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

    // Initialize FAQ accordion
    initFaqAccordion();

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
    createProductCard: createProductCard,
    // Landing page
    initLandingPage: initLandingPage,
    loadFeaturedProducts: loadFeaturedProducts,
    // Shop page
    initShopPage: initShopPage,
    // Product page
    initProductPage: initProductPage,
    // Cart page
    initCartPage: initCartPage
  };

})();
