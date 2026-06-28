const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const ModerationLog = require('../models/ModerationLog');
const auth = require('../middleware/auth');

router.post('/report', auth, async (req, res) => {
  try {
    const { targetId, reason } = req.body;
    const log = new ModerationLog({
      targetId,
      targetType: 'Post',
      action: 'reported',
      reason,
      flaggedBy: req.user.id,
      isPublic: true,
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error('Error reporting:', err);
    res.status(500).json({ error: 'Failed to report' });
  }
});

router.post('/appeal', auth, async (req, res) => {
  try {
    const { logId, appealReason } = req.body;
    const log = await ModerationLog.findByIdAndUpdate(
      logId,
      { isAppealed: true, appealedBy: req.user.id, appealReason },
      { new: true }
    );
    res.json(log);
  } catch (err) {
    console.error('Error appealing:', err);
    res.status(500).json({ error: 'Failed to appeal' });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const { targetId } = req.query;
    const logs = await ModerationLog.find({ targetId }).populate('flaggedBy', 'username');
    res.json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

router.get('/public-log', async (req, res) => {
  try {
    const logs = await ModerationLog.find({ isPublic: true }).populate('flaggedBy', 'username');
    res.json(logs);
  } catch (err) {
    console.error('Error fetching public log:', err);
    res.status(500).json({ error: 'Failed to fetch public log' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await ModerationLog.countDocuments();
    res.json({ totalModeratedPosts: stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
