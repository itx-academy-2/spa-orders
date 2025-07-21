const express = require("express");
const {
  getUserWishlist,
  toggleWishlistItem,
  removeWishlistItem,
} = require("../controllers/wishlistController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/wishlist", getUserWishlist);
router.put("/wishlist/:productId", toggleWishlistItem);
router.delete("/wishlist/:productId", removeWishlistItem);

module.exports = router;
