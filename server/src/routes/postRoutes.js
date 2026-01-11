const express = require('express');
const { body } = require('express-validator');
const {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  reportPost,
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', listPosts);
router.get('/:id', getPost);

router.post(
  '/',
  auth,
  [body('content').isLength({ min: 1 }).withMessage('Content required')],
  validate,
  createPost
);

router.put(
  '/:id',
  auth,
  [body('content').optional().isLength({ min: 1 })],
  validate,
  updatePost
);

router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/unlike', auth, unlikePost);
router.post('/:id/save', auth, savePost);
router.post('/:id/unsave', auth, unsavePost);
router.post(
  '/:id/report',
  auth,
  [body('reason').isLength({ min: 3 }).withMessage('Reason required')],
  validate,
  reportPost
);

module.exports = router;
