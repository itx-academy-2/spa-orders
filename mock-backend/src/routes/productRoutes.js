const express = require("express");
const {
  getAllProducts,
  getProductById,
  getAllManagerProducts,
  createProduct,
  getProductByIdForManager,
  searchProducts,
  updateProduct,
  getSalesProducts
} = require("../controllers/productController");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/search", searchProducts);
router.get("/products/sales", getSalesProducts);
router.get("/products/:productId", getProductById);
router.get("/management/products", getAllManagerProducts);
router.get("/management/products/:id", getProductByIdForManager);
router.post("/management/products", createProduct);
router.patch("/management/products/:id", updateProduct);

module.exports = router;
