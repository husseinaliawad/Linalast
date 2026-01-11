const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Report = require('../models/Report');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const buildPagination = require('../utils/pagination');

const createPost = asyncHandler(async (req, res) => {
  const { content, images } = req.body;
  const post = await Post.create({
    author: req.user._id,
    content,
    images: images || [],
  });
  await post.populate('author', 'username avatar');
  return sendSuccess(res, { post }, 'Post created');
});

const listPosts = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.query;
  const { skip, limit: safeLimit, page: safePage } = buildPagination(page, limit);

  const sortOption = sort === 'top' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };
  const posts = await Post.find()
    .populate('author', 'username avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(safeLimit);
  const total = await Post.countDocuments();

  return sendSuccess(res, { items: posts, page: safePage, total });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username avatar');
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  return sendSuccess(res, { post });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  post.content = req.body.content ?? post.content;
  post.images = req.body.images ?? post.images;
  await post.save();
  await post.populate('author', 'username avatar');

  return sendSuccess(res, { post }, 'Post updated');
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed' });
  }

  await Comment.deleteMany({ parentType: 'post', parentId: post._id });
  await post.deleteOne();

  return sendSuccess(res, { ok: true }, 'Post deleted');
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  );
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  post.likesCount = post.likes.length;
  await post.save();

  return sendSuccess(res, { likesCount: post.likesCount }, 'Post liked');
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  );
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  post.likesCount = post.likes.length;
  await post.save();

  return sendSuccess(res, { likesCount: post.likesCount }, 'Post unliked');
});

const savePost = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedPosts: req.params.id } });
  return sendSuccess(res, { ok: true }, 'Post saved');
});

const unsavePost = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: req.params.id } });
  return sendSuccess(res, { ok: true }, 'Post unsaved');
});

const reportPost = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  await Report.create({
    reporter: req.user._id,
    targetType: 'post',
    targetId: post._id,
    reason,
  });

  post.reportsCount += 1;
  await post.save();

  return sendSuccess(res, { ok: true }, 'Report submitted');
});

module.exports = {
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
};
