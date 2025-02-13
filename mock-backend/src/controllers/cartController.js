const products = require("../data/mokedData");

let store = [];

const getCartItems = (req, res) => {
  const totalPrice = store.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);

  const totalPriceWithDiscount = store.reduce(
    (acc, item) => acc + ((item.priceWithDiscount ?? item.productPrice) * item.quantity),
    0
  );

  const responseBody = {
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    totalPriceWithDiscount: parseFloat(totalPriceWithDiscount.toFixed(2)),

    items: store.map(item => {
      const discount = item.discount ? item.discount / 100 : 0;
      const calculatedDiscountedPrice = parseFloat(
        (item.productPrice - item.productPrice * discount).toFixed(2)
      );
      return {
        ...item,
        productPrice: parseFloat(item.productPrice.toFixed(2)),
        discount: item.discount ? parseFloat(item.discount.toFixed(2)) : 0,
        calculatedPrice: parseFloat((item.productPrice * item.quantity).toFixed(2)),
        priceWithDiscount: calculatedDiscountedPrice,
        calculatedPriceWithDiscount: parseFloat(((item.priceWithDiscount ?? item.productPrice) * item.quantity).toFixed(2))
      };
    }),
  };

  res.status(200).json(responseBody);
};

const addToCart = (req, res) => {
  const { productId } = req.params;
  const item = products.find(product => product.id === productId);

  if (!item) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (store.some(product => product.productId === productId)) {
    return res.status(409).json({ message: "Item already in cart" });
  }

  const discount = item.discount || 0;
  const priceWithDiscount = item.price - (item.price * discount) / 100;

  const newItem = {
    productId: item.id,
    image: item.image,
    name: item.name,
    productPrice: parseFloat(item.price.toFixed(2)),
    productPriceWithDiscount: parseFloat(priceWithDiscount.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    quantity: 1,
    calculatedPrice: parseFloat((item.price * 1).toFixed(2)),
    calculatedPriceWithDiscount: parseFloat((priceWithDiscount * 1).toFixed(2))
  };

  store.push(newItem);

  res.status(201).json(newItem);
};

const removeFromCart = (req, res) => {
  const { productId } = req.params;
  const itemIndex = store.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  store.splice(itemIndex, 1);

  res.status(200).json({ message: "Item removed successfully" });
};

const updateCartItemQuantity = (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || isNaN(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity. Must be at least 1." });
  }

  const itemIndex = store.findIndex(item => item.productId === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  store[itemIndex].quantity = parseInt(quantity, 10);

  const discount = store[itemIndex].discount ? store[itemIndex].discount / 100 : 0;
  const effectivePrice = store[itemIndex].productPrice - store[itemIndex].productPrice * discount;

  store[itemIndex].calculatedPrice = parseFloat((store[itemIndex].productPrice * store[itemIndex].quantity).toFixed(2));
  store[itemIndex].calculatedPriceWithDiscount = parseFloat((effectivePrice * store[itemIndex].quantity).toFixed(2));

  res.status(200).json({ item: store[itemIndex] });
};

module.exports = { getCartItems, addToCart, removeFromCart, updateCartItemQuantity };
