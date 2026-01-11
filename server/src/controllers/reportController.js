const Report = require('../models/Report');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const listReports = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const reports = await Report.find(filter)
    .populate('reporter', 'username avatar')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { items: reports });
});

const resolveReport = asyncHandler(async (req, res) => {
  const { action, status, adminNote } = req.body;
  const report = await Report.findById(req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found' });
  }

  const finalStatus = status || 'resolved';
  report.status = finalStatus;
  report.action = action || report.action;
  report.adminNote = adminNote || report.adminNote;
  report.resolvedBy = req.user._id;
  await report.save();

  if (action === 'deleted') {
    if (report.targetType === 'post') {
      await Post.findByIdAndDelete(report.targetId);
    }
    if (report.targetType === 'review') {
      await Review.findByIdAndDelete(report.targetId);
    }
    if (report.targetType === 'comment') {
      await Comment.findByIdAndDelete(report.targetId);
    }
    if (report.targetType === 'product') {
      await Product.findByIdAndDelete(report.targetId);
    }
  }

  if (action === 'banned' && report.targetType === 'user') {
    await User.findByIdAndUpdate(report.targetId, { isBanned: true });
  }

  return sendSuccess(res, { report }, 'Report resolved');
});

module.exports = { listReports, resolveReport };
