const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookTitle: { type: String, required: true, trim: true },
    bookAuthor: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, required: true, trim: true },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    reportsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
