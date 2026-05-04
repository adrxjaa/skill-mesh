const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const signToken = (userId, res) => {
  const payload = { user: { id: userId } };
  jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '7d' },
    (err, token) => {
      if (err) throw err;
      res.json({ token, user: formatUser(res.locals.user) });
    }
  );
};

function formatUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    title: user.title,
    location: user.location,
    avatar: user.avatar,
    availability: user.availability,
    socialLinks: user.socialLinks,
    skills: user.skills,
    experience: user.experience,
    profileComplete: user.profileComplete,
  };
}

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { fullName, email, password, skills } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ fullName, email, password, skills: skills || [] });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.locals.user = user;
    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: formatUser(user) });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: formatUser(user) });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: formatUser(user) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PATCH /api/auth/change-password
router.patch('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both fields are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect.' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
