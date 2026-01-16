// Filter Module
// Handles URL query parameters for filter state management on the shop page

/**
 * Default filter state
 * @returns {Object} Default filter state object
 */
function getDefaultFilters() {
  return {
    categories: [],
    minPrice: null,
    maxPrice: null,
    colors: [],
    sizes: [],
    inStockOnly: false,
    sort: 'featured',
    search: ''
  };
}

/**
 * Parse URL query parameters into filter state
 * @param {string} [queryString] - Optional query string (defaults to window.location.search)
 * @returns {Object} Filter state object
 */
function parseFiltersFromURL(queryString = window.location.search) {
  const params = new URLSearchParams(queryString);
  const filters = getDefaultFilters();

  // Parse categories (comma-separated)
  const categoriesParam = params.get('categories');
  if (categoriesParam) {
    filters.categories = categoriesParam.split(',').filter(c => c.trim());
  }

  // Parse price range
  const minPrice = params.get('minPrice');
  if (minPrice !== null && minPrice !== '') {
    const parsed = parseFloat(minPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      filters.minPrice = parsed;
    }
  }

  const maxPrice = params.get('maxPrice');
  if (maxPrice !== null && maxPrice !== '') {
    const parsed = parseFloat(maxPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      filters.maxPrice = parsed;
    }
  }

  // Parse colors (comma-separated)
  const colorsParam = params.get('colors');
  if (colorsParam) {
    filters.colors = colorsParam.split(',').filter(c => c.trim());
  }

  // Parse sizes (comma-separated)
  const sizesParam = params.get('sizes');
  if (sizesParam) {
    filters.sizes = sizesParam.split(',').filter(s => s.trim());
  }

  // Parse in-stock only
  const inStockParam = params.get('inStock');
  if (inStockParam === 'true' || inStockParam === '1') {
    filters.inStockOnly = true;
  }

  // Parse sort option
  const sortParam = params.get('sort');
  const validSorts = ['featured', 'price-asc', 'price-desc', 'name', 'newest', 'best-sellers', 'rating'];
  if (sortParam && validSorts.includes(sortParam)) {
    filters.sort = sortParam;
  }

  // Parse search query
  const searchParam = params.get('search');
  if (searchParam) {
    filters.search = searchParam.trim();
  }

  return filters;
}

/**
 * Build URL query string from filter state
 * @param {Object} filters - Filter state object
 * @returns {string} Query string (without leading '?')
 */
function buildURLFromFilters(filters) {
  const params = new URLSearchParams();

  // Add categories
  if (filters.categories && filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','));
  }

  // Add price range
  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    params.set('maxPrice', filters.maxPrice.toString());
  }

  // Add colors
  if (filters.colors && filters.colors.length > 0) {
    params.set('colors', filters.colors.join(','));
  }

  // Add sizes
  if (filters.sizes && filters.sizes.length > 0) {
    params.set('sizes', filters.sizes.join(','));
  }

  // Add in-stock only
  if (filters.inStockOnly) {
    params.set('inStock', 'true');
  }

  // Add sort (only if not default)
  if (filters.sort && filters.sort !== 'featured') {
    params.set('sort', filters.sort);
  }

  // Add search
  if (filters.search && filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  return params.toString();
}

/**
 * Update URL with new filter state (using pushState for browser history)
 * @param {Object} filters - Filter state object
 * @param {boolean} [replaceState=false] - Use replaceState instead of pushState
 */
function updateURLWithFilters(filters, replaceState = false) {
  const queryString = buildURLFromFilters(filters);
  const newURL = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

  if (replaceState) {
    window.history.replaceState({ filters }, '', newURL);
  } else {
    window.history.pushState({ filters }, '', newURL);
  }
}

/**
 * Combine multiple filter states (later filters override earlier ones)
 * @param {...Object} filterStates - Filter state objects to combine
 * @returns {Object} Combined filter state
 */
function combineFilters(...filterStates) {
  const combined = getDefaultFilters();

  for (const filters of filterStates) {
    if (!filters) continue;

    // Merge arrays (union, not replace)
    if (filters.categories && filters.categories.length > 0) {
      combined.categories = [...new Set([...combined.categories, ...filters.categories])];
    }
    if (filters.colors && filters.colors.length > 0) {
      combined.colors = [...new Set([...combined.colors, ...filters.colors])];
    }
    if (filters.sizes && filters.sizes.length > 0) {
      combined.sizes = [...new Set([...combined.sizes, ...filters.sizes])];
    }

    // Override scalar values
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      combined.minPrice = filters.minPrice;
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      combined.maxPrice = filters.maxPrice;
    }
    if (filters.inStockOnly !== undefined) {
      combined.inStockOnly = filters.inStockOnly;
    }
    if (filters.sort) {
      combined.sort = filters.sort;
    }
    if (filters.search !== undefined) {
      combined.search = filters.search;
    }
  }

  return combined;
}

/**
 * Reset filters to default state
 * @param {boolean} [updateURL=true] - Whether to update the URL
 * @returns {Object} Default filter state
 */
function resetFilters(updateURL = true) {
  const defaults = getDefaultFilters();
  if (updateURL) {
    updateURLWithFilters(defaults);
  }
  return defaults;
}

/**
 * Check if any filters are active (non-default)
 * @param {Object} filters - Filter state object
 * @returns {boolean} True if any filters are active
 */
function hasActiveFilters(filters) {
  const defaults = getDefaultFilters();

  if (filters.categories && filters.categories.length > 0) return true;
  if (filters.minPrice !== null && filters.minPrice !== undefined) return true;
  if (filters.maxPrice !== null && filters.maxPrice !== undefined) return true;
  if (filters.colors && filters.colors.length > 0) return true;
  if (filters.sizes && filters.sizes.length > 0) return true;
  if (filters.inStockOnly) return true;
  if (filters.search && filters.search.trim()) return true;
  // Note: sort is not considered an "active filter" for display purposes

  return false;
}

/**
 * Get count of active filter types
 * @param {Object} filters - Filter state object
 * @returns {number} Number of active filter types
 */
function getActiveFilterCount(filters) {
  let count = 0;

  if (filters.categories && filters.categories.length > 0) count++;
  if (filters.minPrice !== null || filters.maxPrice !== null) count++;
  if (filters.colors && filters.colors.length > 0) count++;
  if (filters.sizes && filters.sizes.length > 0) count++;
  if (filters.inStockOnly) count++;
  if (filters.search && filters.search.trim()) count++;

  return count;
}

/**
 * Get available filter options from product data
 * Uses ProductsModule functions to get available options
 * @returns {Promise<Object>} Object containing available filter options
 */
async function getAvailableFilterOptions() {
  // Ensure ProductsModule is available
  if (!window.ProductsModule) {
    console.error('ProductsModule not loaded');
    return {
      categories: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 0 }
    };
  }

  const [categories, colors, sizes, priceRange] = await Promise.all([
    window.ProductsModule.getCategories(),
    window.ProductsModule.getAllColors(),
    window.ProductsModule.getAllSizes(),
    window.ProductsModule.getPriceRange()
  ]);

  return {
    categories,
    colors,
    sizes,
    priceRange
  };
}

/**
 * Get category product counts for filter display
 * @param {Array} products - Array of all products
 * @returns {Object} Object mapping category names to product counts
 */
function getCategoryProductCounts(products) {
  const counts = {};
  for (const product of products) {
    counts[product.category] = (counts[product.category] || 0) + 1;
  }
  return counts;
}

/**
 * Apply filters and sorting to products
 * Convenience function that combines ProductsModule.filterProducts and sortProducts
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter state object
 * @returns {Array} Filtered and sorted products
 */
function applyFiltersToProducts(products, filters) {
  if (!window.ProductsModule) {
    console.error('ProductsModule not loaded');
    return products;
  }

  // First filter
  let result = window.ProductsModule.filterProducts(products, {
    categories: filters.categories,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    colors: filters.colors,
    sizes: filters.sizes,
    inStockOnly: filters.inStockOnly
  });

  // Apply search if present
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim();
    result = result.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const descMatch = product.description.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      return nameMatch || descMatch || categoryMatch;
    });
  }

  // Then sort
  result = window.ProductsModule.sortProducts(result, filters.sort);

  return result;
}

/**
 * Toggle a value in a filter array (add if not present, remove if present)
 * @param {Object} filters - Current filter state
 * @param {string} filterKey - Key of the array filter (categories, colors, sizes)
 * @param {string} value - Value to toggle
 * @returns {Object} New filter state with toggled value
 */
function toggleFilterValue(filters, filterKey, value) {
  const newFilters = { ...filters };
  const array = [...(filters[filterKey] || [])];

  const index = array.indexOf(value);
  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }

  newFilters[filterKey] = array;
  return newFilters;
}

/**
 * Set up popstate listener for browser back/forward navigation
 * @param {Function} callback - Function to call with new filters when navigation occurs
 */
function setupHistoryListener(callback) {
  window.addEventListener('popstate', (event) => {
    // Get filters from state or parse from URL
    const filters = event.state?.filters || parseFiltersFromURL();
    if (callback && typeof callback === 'function') {
      callback(filters);
    }
  });
}

/**
 * Create a shareable URL for current filter state
 * @param {Object} filters - Filter state object
 * @param {string} [baseURL] - Base URL (defaults to current origin + pathname)
 * @returns {string} Full shareable URL
 */
function createShareableURL(filters, baseURL = null) {
  const base = baseURL || `${window.location.origin}${window.location.pathname}`;
  const queryString = buildURLFromFilters(filters);
  return queryString ? `${base}?${queryString}` : base;
}

// Export functions for use in other modules
window.FiltersModule = {
  getDefaultFilters,
  parseFiltersFromURL,
  buildURLFromFilters,
  updateURLWithFilters,
  combineFilters,
  resetFilters,
  hasActiveFilters,
  getActiveFilterCount,
  getAvailableFilterOptions,
  getCategoryProductCounts,
  applyFiltersToProducts,
  toggleFilterValue,
  setupHistoryListener,
  createShareableURL
};
