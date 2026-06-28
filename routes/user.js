const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, avatar, location, website } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile: { bio, avatar, location, website } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.following.includes(req.params.userId)) {
      currentUser.following.pull(req.params.userId);
      targetUser.followers.pull(req.user.id);
    } else {
      currentUser.following.push(req.params.userId);
      targetUser.followers.push(req.user.id);
    }

    currentUser.followingCount = currentUser.following.length;
    targetUser.followersCount = targetUser.followers.length;

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Follow status updated' });
  } catch (err) {
    console.error('Error following user:', err);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

router.get('/:userId/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('followers', 'username avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.followers);
  } catch (err) {
    console.error('Error fetching followers:', err);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

router.get('/:userId/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('following', 'username avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.following);
  } catch (err) {
    console.error('Error fetching following:', err);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

module.exports = router;
