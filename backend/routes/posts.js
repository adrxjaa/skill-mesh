const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/posts — feed with optional ?type= and ?search= filters
router.get('/', auth, async (req, res) => {
  try {
    const { type, search } = req.query;
    const filter = {};

    if (type === 'community' || type === 'requirement') {
      filter.type = type;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { body: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'fullName avatar title')
      .populate('project', 'title')
      .populate('comments.author', 'fullName avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error('GET /api/posts error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/posts — create a post
router.post('/', auth, async (req, res) => {
  const { body, type, title, tags, openToWork, imageUrl, linkUrl, projectId } = req.body;

  if (!body || !body.trim()) {
    return res.status(400).json({ message: 'Post body is required' });
  }

  // Requirement posts MUST have a valid project
  if (type === 'requirement') {
    if (!projectId) {
      return res.status(400).json({ message: 'A project is required for requirement posts' });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(400).json({ message: 'Invalid project' });
    }
    // Only the project owner or a member can post for this project
    const isMember =
      project.owner.toString() === req.user.id ||
      project.members.map(String).includes(req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'You must be a member of this project' });
    }
  }

  try {
    const post = new Post({
      author: req.user.id,
      type: type || 'community',
      title: type === 'requirement' ? title || null : null,
      body: body.trim(),
      tags: tags || [],
      project: type === 'requirement' ? projectId : null,
      openToWork: type === 'requirement' ? !!openToWork : false,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
    });

    await post.save();
    await post.populate('author', 'fullName avatar title');
    if (post.project) {
      await post.populate('project', 'title');
    }

    res.status(201).json(post);
  } catch (err) {
    console.error('POST /api/posts error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/posts/:id — delete own post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('DELETE /api/posts/:id error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const index = post.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    console.error('POST /api/posts/:id/like error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/posts/:id/comment — add a comment
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ author: req.user.id, text: text.trim() });
    await post.save();

    // Return the newly created comment with populated author
    const updated = await Post.findById(post._id).populate('comments.author', 'fullName avatar');
    const newComment = updated.comments[updated.comments.length - 1];

    res.status(201).json(newComment);
  } catch (err) {
    console.error('POST /api/posts/:id/comment error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/posts/:id/comments — get all comments for a post
router.get('/:id/comments', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.author', 'fullName avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post.comments);
  } catch (err) {
    console.error('GET /api/posts/:id/comments error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
