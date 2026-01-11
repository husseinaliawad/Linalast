const express = require('express');
const {
  listUsers,
  toggleBan,
  deletePost,
  deleteReview,
  deleteComment,
  deleteProduct,
  analytics,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth, admin);

router.get('/users', listUsers);
router.put('/users/:id/ban', toggleBan);
router.get('/analytics', analytics);
router.delete('/posts/:id', deletePost);
router.delete('/reviews/:id', deleteReview);
router.delete('/comments/:id', deleteComment);
router.delete('/products/:id', deleteProduct);

module.exports = router;
