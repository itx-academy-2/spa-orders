const { userOrders, adminOrders } = require("../data/mokedOrders");
const wait = require("../utils/wait");
const { filterOrders } = require("../utils/filterUtils");
const { sortOrders } = require("../utils/sortUtils");
const { parsePageable } = require("../utils/parsePageable");

const getUserOrders = (req, res) => {
  res.json(userOrders);
};

const getAdminOrderById = (req, res) => {
  const { orderId } = req.params;
  const order = adminOrders.content.find((order) => order.id === orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found", status: 404 });
  }

  res.json(order);
};

const getAdminOrders = (req, res) => {
  const { limit, skip, size } = parsePageable(req);

  const filteredOrders = filterOrders(adminOrders, req.query);

  const { sort = "createdAt,desc" } = req.query;

  const sortedAdminOrders = {
    ...filteredOrders,
    content: sort
      ? sortOrders(filteredOrders.content, sort)
      : filteredOrders.content,
  };

  const slicedAdminOrders = sortedAdminOrders.content.slice(skip, limit);

  const response = {
    ...sortedAdminOrders,
    content: slicedAdminOrders,
    totalPages: Math.ceil(adminOrders.content.length / size),
    totalElements: adminOrders.content.length,
  };

  res.json(response);
};

const changeOrderStatus = (req, res) => {
  return res.json();
};

const createOrder = async (req, res) => {
  const { body } = req;
  const newOrder = {
    id: Date.now(),
    ...body,
  };

  await wait(1000);

  res.json(newOrder.id);
};

module.exports = {
  getUserOrders,
  getAdminOrders,
  createOrder,
  getAdminOrderById,
  changeOrderStatus,
};
