const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getUserPosts,
  getUserReviews,
  getUserProducts,
  getSavedPosts,
  reportUser,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/me/saved', auth, getSavedPosts);

router.put(
  '/me',
  auth,
  [
    body('username').optional().isLength({ min: 3 }),
    body('email').optional().isEmail(),
    body('avatar').optional().isString(),
    body('bio').optional().isString(),
    body('social').optional().isObject(),
  ],
  validate,
  updateProfile
);

router.post('/:id/follow', auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);
router.post(
  '/:id/report',
  auth,
  [body('reason').isLength({ min: 3 }).withMessage('Reason required')],
  validate,
  reportUser
);
router.get('/:id/posts', getUserPosts);
router.get('/:id/reviews', getUserReviews);
router.get('/:id/products', getUserProducts);
router.get('/:id', getProfile);

module.exports = router;
