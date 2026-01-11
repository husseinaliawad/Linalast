const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  auth,
  [body('items').isArray({ min: 1 })],
  validate,
  createOrder
);

router.get('/my', auth, getMyOrders);
router.get('/seller', auth, getSellerOrders);

router.put(
  '/:id/status',
  auth,
  [body('status').isIn(['pending', 'paid', 'shipped', 'completed', 'canceled'])],
  validate,
  updateOrderStatus
);

module.exports = router;
