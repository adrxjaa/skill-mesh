const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
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

// GET /api/profile/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(publicUser(user));
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PATCH /api/profile/me
router.patch('/me', auth, async (req, res) => {
  const allowedFields = [
    'fullName', 'bio', 'title', 'location', 'avatar',
    'availability', 'socialLinks', 'skills', 'experience', 'profileComplete',
  ];
  const update = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(publicUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET /api/profile/:id  — public profile view
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if viewer shares a project with this user
    const sharedProject = await Project.findOne({
      members: { $all: [req.user.id, req.params.id] },
      status: 'active',
    });

    res.json({
      ...publicUser(user),
      isSelf: req.user.id === req.params.id,
      canReview: !!sharedProject && req.user.id !== req.params.id,
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET /api/profile/:id/reviews
router.get('/:id/reviews', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ target: req.params.id })
      .populate('author', 'fullName avatar title')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/profile/:id/review
router.post('/:id/review', auth, async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: 'Cannot review yourself' });
  }
  try {
    // Verify shared project
    const sharedProject = await Project.findOne({
      members: { $all: [req.user.id, req.params.id] },
      status: 'active',
    });
    if (!sharedProject) {
      return res.status(403).json({ message: 'You must share a project to leave a review' });
    }

    const existing = await Review.findOne({ author: req.user.id, target: req.params.id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this person' });
    }

    const review = new Review({
      author: req.user.id,
      target: req.params.id,
      project: sharedProject._id,
      rating: req.body.rating,
      text: req.body.text,
    });
    await review.save();
    await review.populate('author', 'fullName avatar title');
    await review.populate('project', 'title');
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
