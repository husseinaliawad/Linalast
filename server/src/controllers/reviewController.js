const Review = require('../models/Review');
const Comment = require('../models/Comment');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const buildPagination = require('../utils/pagination');

const createReview = asyncHandler(async (req, res) => {
  const { bookTitle, bookAuthor, rating, content, images } = req.body;
  const review = await Review.create({
    author: req.user._id,
    bookTitle,
    bookAuthor,
    rating,
    content,
    images: images || [],
  });
  await review.populate('author', 'username avatar');
  return sendSuccess(res, { review }, 'Review created');
});

const listReviews = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.query;
  const { skip, limit: safeLimit, page: safePage } = buildPagination(page, limit);

  const sortOption = sort === 'top' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };
  const reviews = await Review.find()
    .populate('author', 'username avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(safeLimit);
  const total = await Review.countDocuments();

  return sendSuccess(res, { items: reviews, page: safePage, total });
});

const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate('author', 'username avatar');
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  return sendSuccess(res, { review });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (String(review.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  review.bookTitle = req.body.bookTitle ?? review.bookTitle;
  review.bookAuthor = req.body.bookAuthor ?? review.bookAuthor;
  review.rating = req.body.rating ?? review.rating;
  review.content = req.body.content ?? review.content;
  review.images = req.body.images ?? review.images;
  await review.save();
  await review.populate('author', 'username avatar');

  return sendSuccess(res, { review }, 'Review updated');
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (String(review.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  await Comment.deleteMany({ parentType: 'review', parentId: review._id });
  await review.deleteOne();

  return sendSuccess(res, { ok: true }, 'Review deleted');
});

const likeReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  review.likesCount = review.likes.length;
  await review.save();

  return sendSuccess(res, { likesCount: review.likesCount }, 'Review liked');
});

const unlikeReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  review.likesCount = review.likes.length;
  await review.save();

  return sendSuccess(res, { likesCount: review.likesCount }, 'Review unliked');
});

const reportReview = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  await Report.create({
    reporter: req.user._id,
    targetType: 'review',
    targetId: review._id,
    reason,
  });

  review.reportsCount += 1;
  await review.save();

  return sendSuccess(res, { ok: true }, 'Report submitted');
});

module.exports = {
  createReview,
  listReviews,
  getReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  reportReview,
};
