const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: {
      type: String,
      enum: ['post', 'comment', 'review', 'product', 'user'],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['open', 'resolved', 'dismissed'],
      default: 'open',
    },
    action: {
      type: String,
      enum: ['none', 'deleted', 'warned', 'banned'],
      default: 'none',
    },
    adminNote: { type: String, default: '' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
