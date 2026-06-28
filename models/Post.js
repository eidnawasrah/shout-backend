const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  mediaUrls: [String],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  echoed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replyCount: { type: Number, default: 0 },
  reportedCount: { type: Number, default: 0 },
  reportedReason: String,
  isRemoved: { type: Boolean, default: false },
  removalReason: String,
  isAppealed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
