const products = require("../data/mokedData");

const wishlist = new Map();

const getUserWishlist = (req, res) => {
  const userId = req.user.id;
  const productIds = Array.from(wishlist.get(userId) || []);

  const wishlistProducts = productIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  res.json({ content: wishlistProducts, totalElements: wishlistProducts.length, });
};

const toggleWishlistItem = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  if (!wishlist.has(userId)) {
    wishlist.set(userId, new Set());
  }

  const userWishlist = wishlist.get(userId);

  if (userWishlist.has(productId)) {
    userWishlist.delete(productId);
  } else {
    userWishlist.add(productId);
  }

  res.status(204).end();
};

const removeWishlistItem = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const userWishlist = wishlist.get(userId);
  if (userWishlist) {
    userWishlist.delete(productId);
  }

  res.status(204).end();
};

module.exports = {
  getUserWishlist,
  toggleWishlistItem,
  removeWishlistItem,
};
