const { categoryFilter } = require("../utils/categoryFilter");

const { managerProducts, managerProduct } = require("../data/managerProducts");
const products = require("../data/mokedData");
const { sortProducts } = require("../utils/sortUtils");
const { filteredProductsBySearchQuery } = require("../utils/filterUtils");
const { parsePageable } = require("../utils/parsePageable");

const getAllProducts = (req, res) => {
  const { sort, tags: category } = req.query;
  const { limit, skip, size } = parsePageable(req, 10);

  let sortedProducts = sort ? sortProducts(products, sort) : products;

  const finalProducts = categoryFilter(category, sortedProducts);

  const slicedProducts = finalProducts.slice(skip, limit);

  const response = {
    content: slicedProducts,
    totalPages: Math.ceil(finalProducts.length / size),
    totalElements: finalProducts.length,
  };

  res.json(response);
};

const getProductById = (req, res) => {
  // @TODO: add lang param usage
  const { productId } = req.params;
  const product = products.find((product) => product.id === productId);

  if (!product) {
    res.status(404).json({ status: 404, message: "Product not found" });
    return;
  }

  const transformedProduct = {
    image: product.image,
    quantity: 10,
    price: product.price,
    tags: product.tags,
    name: product.name,
    description: product.description,
    discount: product.discount,
    priceWithDiscount: product.priceWithDiscount
  };

  res.json(transformedProduct);
};

const getAllManagerProducts = (req, res) => {
  const { limit, size, skip } = parsePageable(req);

  const slicedProducts = managerProducts.content.slice(skip, limit);

  const response = {
    ...managerProducts,
    content: slicedProducts,
    totalPages: Math.ceil(managerProducts.content.length / size),
    totalElements: managerProducts.content.length,
  };

  return res.json(response);
};

const getProductByIdForManager = (req, res) => {
  return res.json(managerProduct);
};

const createProduct = (req, res) => {
  const { image, price, discount = 0, status, quantity, category, productTranslations, } = req.body;

  if (price === undefined || price < 0) {
    return res.status(400).json({ status: 400, message: "Price is required and must be non-negative" });
  }

  const priceWithDiscount = price - (price * discount) / 100;

  const newProduct = {
    id: Math.floor(Math.random() * 1000) + 1,
    image,
    price,
    discount,
    status,
    quantity,
    category,
    productTranslations,
    priceWithDiscount
  };

  products.push(newProduct);

  res.status(201).json({ id: newProduct.id });
};

const searchProducts = (req, res) => {
  const { searchQuery, sort, page } = req.query;
  const { limit, size, skip } = parsePageable(req, 10);

  let filteredProducts = filteredProductsBySearchQuery(products, searchQuery);

  if (sort) {
    filteredProducts = sortProducts(filteredProducts, sort);
  }

  const paginatedProducts = filteredProducts.slice(skip, limit);

  const response = {
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    first: page === 0,
    last: limit >= filteredProducts.length,
    number: page,
    numberOfElements: paginatedProducts.length,
    size: size,
    empty: paginatedProducts.length === 0,
    content: paginatedProducts.map((product) => ({
      id: product.id,
      image: product.image,
      name: product.name,
    })),
  };

  res.json(response);
};

const updateProduct = (req, res) => {
  res.status(204).end();
};

const getSalesProducts = (req, res) => {
  const { sort, tags: category } = req.query;
  const { limit, skip, size } = parsePageable(req, 10);

  let sortedProducts = sort ? sortProducts(products, sort) : products;

  const saleProducts = sortedProducts.filter(
    (product) => product.priceWithDiscount && product.discount
  );

  const finalProducts = categoryFilter(category, saleProducts);

  const slicedProducts = finalProducts.slice(skip, limit);

  const response = {
    content: slicedProducts,
    totalPages: Math.ceil(finalProducts.length / size),
    totalElements: finalProducts.length,
  };

  res.json(response);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  getAllManagerProducts,
  searchProducts,
  getProductByIdForManager,
  updateProduct,
  getSalesProducts,
};
