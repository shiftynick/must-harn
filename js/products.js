// Product Data Module
// Handles loading, filtering, sorting, and searching products

// Cache for loaded products
let productsCache = null;

/**
 * Load products from JSON file
 * @returns {Promise<Array>} Array of product objects
 */
async function loadProducts() {
  if (productsCache) {
    return productsCache;
  }

  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status}`);
    }
    const data = await response.json();
    productsCache = data.products;
    return productsCache;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

/**
 * Get a single product by its ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
async function getProductById(id) {
  const products = await loadProducts();
  return products.find(product => product.id === id) || null;
}

/**
 * Get all products in a specific category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products in the category
 */
async function getProductsByCategory(category) {
  const products = await loadProducts();
  return products.filter(product => product.category === category);
}

/**
 * Get all unique categories from products
 * @returns {Promise<Array>} Array of category names
 */
async function getCategories() {
  const products = await loadProducts();
  const categories = [...new Set(products.map(product => product.category))];
  return categories;
}

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching products
 */
async function searchProducts(query) {
  const products = await loadProducts();
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    return products;
  }

  return products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm);
    const descMatch = product.description.toLowerCase().includes(searchTerm);
    const categoryMatch = product.category.toLowerCase().includes(searchTerm);
    return nameMatch || descMatch || categoryMatch;
  });
}

/**
 * Sort products by a given criteria
 * @param {Array} products - Array of products to sort
 * @param {string} sortBy - Sort criteria: 'price-asc', 'price-desc', 'name', 'newest', 'best-sellers', 'rating', 'featured'
 * @returns {Array} Sorted array of products
 */
function sortProducts(products, sortBy = 'featured') {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    case 'best-sellers':
      sorted.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      // Featured: combination of salesCount and rating
      sorted.sort((a, b) => {
        const scoreA = a.salesCount * 0.5 + a.rating * 100;
        const scoreB = b.salesCount * 0.5 + b.rating * 100;
        return scoreB - scoreA;
      });
      break;
  }

  return sorted;
}

/**
 * Filter products based on multiple criteria
 * @param {Array} products - Array of products to filter
 * @param {Object} filters - Filter criteria
 * @param {Array<string>} [filters.categories] - Categories to include
 * @param {number} [filters.minPrice] - Minimum price
 * @param {number} [filters.maxPrice] - Maximum price
 * @param {Array<string>} [filters.colors] - Colors to include
 * @param {Array<string>} [filters.sizes] - Sizes to include
 * @param {boolean} [filters.inStockOnly] - Only show in-stock items
 * @returns {Array} Filtered array of products
 */
function filterProducts(products, filters = {}) {
  let filtered = [...products];

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(product =>
      filters.categories.includes(product.category)
    );
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice);
  }

  // Filter by colors
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter(product =>
      product.colors.some(color => filters.colors.includes(color))
    );
  }

  // Filter by sizes
  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter(product =>
      product.sizes.some(size => filters.sizes.includes(size))
    );
  }

  // Filter by stock availability
  if (filters.inStockOnly) {
    filtered = filtered.filter(product => product.inStock);
  }

  return filtered;
}

/**
 * Get all unique colors across all products
 * @returns {Promise<Array>} Array of color names
 */
async function getAllColors() {
  const products = await loadProducts();
  const colors = new Set();
  products.forEach(product => {
    product.colors.forEach(color => colors.add(color));
  });
  return [...colors].sort();
}

/**
 * Get all unique sizes across all products
 * @returns {Promise<Array>} Array of size names
 */
async function getAllSizes() {
  const products = await loadProducts();
  const sizes = new Set();
  products.forEach(product => {
    product.sizes.forEach(size => sizes.add(size));
  });
  // Custom sort order for sizes
  const sizeOrder = ['S', 'M', 'L', 'XL', 'One Size'];
  return [...sizes].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

/**
 * Get price range across all products
 * @returns {Promise<Object>} Object with min and max prices
 */
async function getPriceRange() {
  const products = await loadProducts();
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }
  const prices = products.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Get featured products (top sellers with high ratings)
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of featured products
 */
async function getFeaturedProducts(limit = 4) {
  const products = await loadProducts();
  const sorted = sortProducts(products, 'featured');
  return sorted.slice(0, limit);
}

/**
 * Get new products
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of new products
 */
async function getNewProducts(limit = 4) {
  const products = await loadProducts();
  const newProducts = products.filter(p => p.isNew);
  const sorted = sortProducts(newProducts, 'newest');
  return sorted.slice(0, limit);
}

/**
 * Get related products (same category, excluding the current product)
 * @param {string} productId - Current product ID to exclude
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of related products
 */
async function getRelatedProducts(productId, limit = 4) {
  const product = await getProductById(productId);
  if (!product) {
    return [];
  }

  const categoryProducts = await getProductsByCategory(product.category);
  const related = categoryProducts.filter(p => p.id !== productId);
  return related.slice(0, limit);
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
window.ProductsModule = {
  loadProducts,
  getProductById,
  getProductsByCategory,
  getCategories,
  searchProducts,
  sortProducts,
  filterProducts,
  getAllColors,
  getAllSizes,
  getPriceRange,
  getFeaturedProducts,
  getNewProducts,
  getRelatedProducts,
  formatPrice
};
