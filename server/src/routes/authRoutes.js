const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { register, login, me, logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many auth attempts, please try later',
});

router.post(
  '/register',
  authLimiter,
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username is too short'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password too short'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty()],
  validate,
  login
);

router.get('/me', auth, me);
router.post('/logout', auth, logout);

module.exports = router;
