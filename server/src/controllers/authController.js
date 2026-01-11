const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sanitizeUser = (user) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hash,
  });

  const token = createToken(user);

  return sendSuccess(res, { token, user: sanitizeUser(user) }, 'Account created');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (user.isBanned) {
    return res.status(403).json({ success: false, message: 'Account is banned' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = createToken(user);
  return sendSuccess(res, { token, user: sanitizeUser(user) }, 'Welcome back');
});

const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user });
});

const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, { ok: true }, 'Logged out');
});

module.exports = { register, login, me, logout };
