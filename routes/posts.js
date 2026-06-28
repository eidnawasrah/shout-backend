const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { content, mediaUrls } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = new Post({
      author: req.user.id,
      content,
      mediaUrls: mediaUrls || [],
      createdAt: new Date(),
    });

    await post.save();
    const populatedPost = await post.populate('author', 'username avatar');
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching feed:', err);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.likedBy.includes(req.user.id)) {
      post.likedBy.pull(req.user.id);
    } else {
      post.likedBy.push(req.user.id);
    }

    await post.save();
    res.json({ likeCount: post.likedBy.length });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

router.post('/:id/echo', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.echoed.includes(req.user.id)) {
      post.echoed.pull(req.user.id);
    } else {
      post.echoed.push(req.user.id);
    }

    await post.save();
    res.json({ echoCount: post.echoed.length });
  } catch (err) {
    console.error('Error echoing post:', err);
    res.status(500).json({ error: 'Failed to echo post' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username avatar');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/:id/report', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.reportedCount = (post.reportedCount || 0) + 1;
    post.reportedReason = reason || 'No reason provided';
    await post.save();

    res.json({ message: 'Post reported' });
  } catch (err) {
    console.error('Error reporting post:', err);
    res.status(500).json({ error: 'Failed to report post' });
  }
});

module.exports = router;
