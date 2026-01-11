const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  reportProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  auth,
  [
    body('title').isLength({ min: 1 }),
    body('description').isLength({ min: 1 }),
    body('price').isFloat({ min: 0 }),
    body('category').isLength({ min: 1 }),
  ],
  validate,
  createProduct
);

router.put(
  '/:id',
  auth,
  [
    body('title').optional().isLength({ min: 1 }),
    body('description').optional().isLength({ min: 1 }),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().isLength({ min: 1 }),
    body('stock').optional().isInt({ min: 0 }),
  ],
  validate,
  updateProduct
);

router.delete('/:id', auth, deleteProduct);

router.post(
  '/:id/reviews',
  auth,
  [body('rating').isInt({ min: 1, max: 5 }), body('comment').optional().isString()],
  validate,
  addProductReview
);

router.post(
  '/:id/report',
  auth,
  [body('reason').isLength({ min: 3 }).withMessage('Reason required')],
  validate,
  reportProduct
);

module.exports = router;
