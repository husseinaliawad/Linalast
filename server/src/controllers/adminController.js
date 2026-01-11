const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Comment = require('../models/Comment');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const listUsers = asyncHandler(async (req, res) => {
  const { q, role } = req.query;
  const filter = {};
  if (role) {
    filter.role = role;
  }
  if (q) {
    filter.$or = [
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  return sendSuccess(res, { items: users });
});

const toggleBan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  return sendSuccess(res, { user }, user.isBanned ? 'User banned' : 'User unbanned');
});

const deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  return sendSuccess(res, { ok: true }, 'Post removed');
});

const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  return sendSuccess(res, { ok: true }, 'Review removed');
});

const deleteComment = asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  return sendSuccess(res, { ok: true }, 'Comment removed');
});

const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return sendSuccess(res, { ok: true }, 'Product removed');
});

const countByDay = async (Model) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const results = await Model.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return results;
};

const analytics = asyncHandler(async (req, res) => {
  const [
    usersCount,
    postsCount,
    reviewsCount,
    productsCount,
    ordersCount,
    commentsCount,
    userSeries,
    postSeries,
    reviewSeries,
    orderSeries,
    topAuthors,
    topProducts,
  ] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Review.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Comment.countDocuments(),
    countByDay(User),
    countByDay(Post),
    countByDay(Review),
    countByDay(Order),
    Post.aggregate([
      { $group: { _id: '$author', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: { username: '$user.username', total: 1 } },
    ]),
    Product.find().sort({ ratingsAverage: -1, ratingsCount: -1 }).limit(5),
  ]);

  return sendSuccess(res, {
    counts: {
      users: usersCount,
      posts: postsCount,
      reviews: reviewsCount,
      products: productsCount,
      orders: ordersCount,
      comments: commentsCount,
    },
    series: {
      users: userSeries,
      posts: postSeries,
      reviews: reviewSeries,
      orders: orderSeries,
    },
    topAuthors,
    topProducts,
  });
});

module.exports = {
  listUsers,
  toggleBan,
  deletePost,
  deleteReview,
  deleteComment,
  deleteProduct,
  analytics,
};
