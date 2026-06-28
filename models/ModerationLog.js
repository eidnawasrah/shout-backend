const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['Post', 'User', 'Yell'] },
  action: { type: String, required: true },
  reason: String,
  flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAppealed: { type: Boolean, default: false },
  appealedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appealReason: String,
  isPublic: { type: Boolean, default: true },
  contentSnippet: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ModerationLog', moderationLogSchema);
