const express = require('express');
const router = express.Router();
const Yell = require('../models/Yell');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.post('/:parentId', auth, async (req, res) => {
  try {
    const { content, mediaUrls } = req.body;
    const parentId = req.params.parentId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Yell content is required' });
    }

    const yell = new Yell({
      author: req.user.id,
      content,
      parentId,
      mediaUrls: mediaUrls || [],
      createdAt: new Date(),
    });

    await yell.save();
    await Post.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });

    res.status(201).json(yell);
  } catch (err) {
    console.error('Error creating yell:', err);
    res.status(500).json({ error: 'Failed to create yell' });
  }
});

router.get('/:parentId', async (req, res) => {
  try {
    const yells = await Yell.find({ parentId: req.params.parentId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(yells);
  } catch (err) {
    console.error('Error fetching yells:', err);
    res.status(500).json({ error: 'Failed to fetch yells' });
  }
});

router.delete('/:yellId', auth, async (req, res) => {
  try {
    const yell = await Yell.findById(req.params.yellId);
    if (!yell) return res.status(404).json({ error: 'Yell not found' });
    if (yell.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Yell.findByIdAndDelete(req.params.yellId);
    res.json({ message: 'Yell deleted' });
  } catch (err) {
    console.error('Error deleting yell:', err);
    res.status(500).json({ error: 'Failed to delete yell' });
  }
});

router.post('/:yellId/like', auth, async (req, res) => {
  try {
    const yell = await Yell.findById(req.params.yellId);
    if (!yell) return res.status(404).json({ error: 'Yell not found' });

    if (yell.likedBy.includes(req.user.id)) {
      yell.likedBy.pull(req.user.id);
    } else {
      yell.likedBy.push(req.user.id);
    }

    await yell.save();
    res.json({ likeCount: yell.likedBy.length });
  } catch (err) {
    console.error('Error liking yell:', err);
    res.status(500).json({ error: 'Failed to like yell' });
  }
});

module.exports = router;
