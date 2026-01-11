const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = products.find((p) => String(p._id) === String(item.productId));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for ${product.title}`,
      });
    }

    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    });

    total += product.price * item.quantity;
  }

  const order = await Order.create({
    buyer: req.user._id,
    items: orderItems,
    total,
    status: 'paid',
  });

  return sendSuccess(res, { order }, 'Order placed');
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
  return sendSuccess(res, { items: orders });
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
  const sellerProductIds = sellerProducts.map((product) => product._id);

  const orders = await Order.find({ 'items.product': { $in: sellerProductIds } })
    .populate('buyer', 'username avatar')
    .sort({ createdAt: -1 });

  return sendSuccess(res, { items: orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
  const sellerProductIds = sellerProducts.map((product) => String(product._id));
  const isSellerOrder = order.items.some((item) => sellerProductIds.includes(String(item.product)));

  if (!isSellerOrder && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  order.status = status;
  await order.save();

  return sendSuccess(res, { order }, 'Order updated');
});

module.exports = {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
};
