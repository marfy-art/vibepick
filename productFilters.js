/**
 * Filters an array of products based on category, minimum price, and maximum price.
 * 
 * @param {Array<Object>} products - The array of product objects to filter.
 * @param {Object} filters - Dictionary of active filters.
 * @param {string} [filters.category] - Specific category to filter by.
 * @param {number} [filters.minPrice] - Minimum price (inclusive).
 * @param {number} [filters.maxPrice] - Maximum price (inclusive).
 * @returns {Array<Object>} - A new array containing the filtered products.
 */
function filterProducts(products, { category, minPrice, maxPrice } = {}) {
  return products.filter(product => {
    // 1. Filter by category
    if (category && product.category !== category) {
      return false;
    }
    
    // 2. Filter by minimum price
    if (minPrice !== undefined && product.price < minPrice) {
      return false;
    }
    
    // 3. Filter by maximum price
    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }

    return true; // Keep product if it passes all active filters
  });
}

// -------------
// Example Usage
// -------------

const mockProducts = [
  {
    id: "p_1",
    name: "Structured Wool Overcoat",
    category: "Outerwear",
    price: 840.00,
    images: ["https://example.com/overcoat.jpg"],
    stockStatus: "IN_STOCK",
    ratings: { average: 4.8, count: 12 }
  },
  {
    id: "p_2",
    name: "Raw Silk Blouse",
    category: "Tops",
    price: 320.00,
    images: ["https://example.com/blouse.jpg"],
    stockStatus: "PREORDER",
    ratings: { average: 4.9, count: 8 }
  },
  {
    id: "p_3",
    name: "Architectural Heel",
    category: "Footwear",
    price: 560.00,
    images: ["https://example.com/heels.jpg"],
    stockStatus: "OUT_OF_STOCK",
    ratings: { average: 4.5, count: 24 }
  }
];

// Returns only the Raw Silk Blouse: 
// filterProducts(mockProducts, { category: "Tops", maxPrice: 400 });

export { filterProducts };
