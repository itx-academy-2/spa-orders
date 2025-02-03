const products = require("../data/mokedData");

let store = [];

const getCartItems = (req, res) => {
  const price = store.reduce((acc, item) => acc + (item.priceWithDiscount || item.calculatedPrice), 0);

  const responseBody = {
    totalPrice: price,
    items: store
  };

  res.status(200).json(responseBody);
};

const addToCart = (req, res) => {

  const item = products.find((product) => product.id === req.params.productId);

  if (store.find(item => item.productId === req.params.productId)) {
    return res.status(409).json();
  }

  const discount = item.discount || 0;

  const priceWithDiscount = item.price - (item.price * discount / 100);

  store.push({
    productId: item.id,
    image: item.image,
    name: item.name,
    productPrice: item.price,
    quantity: 1,
    calculatedPrice: item.price,
    discount: discount,
    priceWithDiscount: priceWithDiscount
  });

  res.json();
};

const removeFromCart = (req, res) => {
  store = store.filter((item) => item.productId !== req.params.productId);
  res.json();
};

const updateCartItemQuantity = (req, res) => {
  const item = store.find((item) => item.productId === req.params.productId);

  if (!item) {
    return res.status(404).json({ message: "The requested resource was not found" });
  }

  item.quantity = parseInt(req.query.quantity);
  item.calculatedPrice = item.productPrice * item.quantity;
  item.priceWithDiscount = (item.productPrice - (item.productPrice * item.discount / 100)) * item.quantity;

  res.status(200).json(item);
};

module.exports = { getCartItems, addToCart, removeFromCart, updateCartItemQuantity };
