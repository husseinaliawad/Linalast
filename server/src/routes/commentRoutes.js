const express = require('express');
const { body } = require('express-validator');
const {
  createComment,
  listComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  reportComment,
} = require('../controllers/commentController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', listComments);

router.post(
  '/',
  auth,
  [
    body('parentType').isIn(['post', 'review', 'product']),
    body('parentId').isString(),
    body('content').isLength({ min: 1 }),
  ],
  validate,
  createComment
);

router.put(
  '/:id',
  auth,
  [body('content').isLength({ min: 1 })],
  validate,
  updateComment
);

router.delete('/:id', auth, deleteComment);
router.post('/:id/like', auth, likeComment);
router.post('/:id/unlike', auth, unlikeComment);
router.post(
  '/:id/report',
  auth,
  [body('reason').isLength({ min: 3 }).withMessage('Reason required')],
  validate,
  reportComment
);

module.exports = router;
