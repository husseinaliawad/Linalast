const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const updateCounts = async (parentType, parentId) => {
  if (parentType === 'post') {
    const count = await Comment.countDocuments({ parentType, parentId, isDeleted: false });
    await Post.findByIdAndUpdate(parentId, { commentsCount: count });
  }
  if (parentType === 'review') {
    const count = await Comment.countDocuments({ parentType, parentId, isDeleted: false });
    await Review.findByIdAndUpdate(parentId, { commentsCount: count });
  }
  if (parentType === 'product') {
    // Product comments are optional, no count needed yet.
    await Product.findById(parentId);
  }
};

const createComment = asyncHandler(async (req, res) => {
  const { parentType, parentId, content } = req.body;
  const comment = await Comment.create({
    author: req.user._id,
    parentType,
    parentId,
    content,
  });
  await comment.populate('author', 'username avatar');

  await updateCounts(parentType, parentId);
  return sendSuccess(res, { comment }, 'Comment added');
});

const listComments = asyncHandler(async (req, res) => {
  const { parentType, parentId } = req.query;
  const comments = await Comment.find({ parentType, parentId, isDeleted: false })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 });

  return sendSuccess(res, { items: comments });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  comment.content = req.body.content ?? comment.content;
  await comment.save();
  await comment.populate('author', 'username avatar');

  return sendSuccess(res, { comment }, 'Comment updated');
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  comment.isDeleted = true;
  await comment.save();
  await updateCounts(comment.parentType, comment.parentId);

  return sendSuccess(res, { ok: true }, 'Comment deleted');
});

const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }
  comment.likesCount = comment.likes.length;
  await comment.save();

  return sendSuccess(res, { likesCount: comment.likesCount }, 'Comment liked');
});

const unlikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }
  comment.likesCount = comment.likes.length;
  await comment.save();

  return sendSuccess(res, { likesCount: comment.likesCount }, 'Comment unliked');
});

const reportComment = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  await Report.create({
    reporter: req.user._id,
    targetType: 'comment',
    targetId: comment._id,
    reason,
  });

  return sendSuccess(res, { ok: true }, 'Report submitted');
});

module.exports = {
  createComment,
  listComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  reportComment,
};
