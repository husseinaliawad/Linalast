const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const buildPagination = require('../utils/pagination');

const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const [posts, reviews, products] = await Promise.all([
    Post.countDocuments({ author: id }),
    Review.countDocuments({ author: id }),
    Product.countDocuments({ seller: id }),
  ]);

  return sendSuccess(res, {
    user,
    stats: {
      posts,
      reviews,
      products,
      followers: user.followers.length,
      following: user.following.length,
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, avatar, bio, social } = req.body;

  if (username && username !== req.user.username) {
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Username already taken' });
    }
  }

  if (email && email !== req.user.email) {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
  }

  const updated = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: username ?? req.user.username,
        email: email ?? req.user.email,
        avatar: avatar ?? req.user.avatar,
        bio: bio ?? req.user.bio,
        social: social ?? req.user.social,
      },
    },
    { new: true }
  ).select('-password');

  return sendSuccess(res, { user: updated }, 'Profile updated');
});

const followUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
  }

  const target = await User.findById(id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: id } });
  await User.findByIdAndUpdate(id, { $addToSet: { followers: req.user._id } });

  return sendSuccess(res, { ok: true }, 'Followed user');
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id === String(req.user._id)) {
    return res.status(400).json({ success: false, message: 'Cannot unfollow yourself' });
  }

  const target = await User.findById(id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
  await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

  return sendSuccess(res, { ok: true }, 'Unfollowed user');
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, limit: safeLimit, page: safePage } = buildPagination(page, limit);
  const posts = await Post.find({ author: req.params.id })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);
  const total = await Post.countDocuments({ author: req.params.id });

  return sendSuccess(res, { items: posts, page: safePage, total });
});

const getUserReviews = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, limit: safeLimit, page: safePage } = buildPagination(page, limit);
  const reviews = await Review.find({ author: req.params.id })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);
  const total = await Review.countDocuments({ author: req.params.id });

  return sendSuccess(res, { items: reviews, page: safePage, total });
});

const getUserProducts = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, limit: safeLimit, page: safePage } = buildPagination(page, limit);
  const products = await Product.find({ seller: req.params.id })
    .populate('seller', 'username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);
  const total = await Product.countDocuments({ seller: req.params.id });

  return sendSuccess(res, { items: products, page: safePage, total });
});

const getSavedPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedPosts',
    populate: { path: 'author', select: 'username avatar' },
  });

  return sendSuccess(res, { items: user.savedPosts || [] });
});

const reportUser = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const target = await User.findById(req.params.id);
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await Report.create({
    reporter: req.user._id,
    targetType: 'user',
    targetId: target._id,
    reason,
  });

  return sendSuccess(res, { ok: true }, 'Report submitted');
});

module.exports = {
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getUserPosts,
  getUserReviews,
  getUserProducts,
  getSavedPosts,
  reportUser,
};
