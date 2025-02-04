const products = require("../data/mokedData");

let store = [];

const getCartItems = (req, res) => {
  const price = store.reduce((acc, item) => {
    const itemTotal = item.priceWithDiscount !== null ? item.priceWithDiscount * item.quantity : item.productPrice * item.quantity;
    return acc + itemTotal;
  }, 0);

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

  const quantity = parseInt(req.query.quantity);
  if (isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  item.quantity = quantity;

  const effectivePrice = item.discount > 0 ? item.priceWithDiscount : item.productPrice;

  item.calculatedPrice = effectivePrice * quantity;

  res.status(200).json({ item });
};

module.exports = { getCartItems, addToCart, removeFromCart, updateCartItemQuantity };
