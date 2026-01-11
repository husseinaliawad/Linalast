const express = require('express');
const { body } = require('express-validator');
const {
  createReview,
  listReviews,
  getReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  reportReview,
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', listReviews);
router.get('/:id', getReview);

router.post(
  '/',
  auth,
  [
    body('bookTitle').isLength({ min: 1 }),
    body('bookAuthor').isLength({ min: 1 }),
    body('rating').isInt({ min: 1, max: 5 }),
    body('content').isLength({ min: 1 }),
  ],
  validate,
  createReview
);

router.put(
  '/:id',
  auth,
  [
    body('bookTitle').optional().isLength({ min: 1 }),
    body('bookAuthor').optional().isLength({ min: 1 }),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('content').optional().isLength({ min: 1 }),
  ],
  validate,
  updateReview
);

router.delete('/:id', auth, deleteReview);
router.post('/:id/like', auth, likeReview);
router.post('/:id/unlike', auth, unlikeReview);
router.post(
  '/:id/report',
  auth,
  [body('reason').isLength({ min: 3 }).withMessage('Reason required')],
  validate,
  reportReview
);

module.exports = router;
