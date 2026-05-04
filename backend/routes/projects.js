const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/projects — my active projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
      status: { $ne: 'archived' },
    })
      .populate('owner', 'fullName avatar')
      .populate('members', 'fullName avatar')
      .populate('invites.user', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET /api/projects/invites — pending invites for me
router.get('/invites', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      'invites.user': req.user.id,
      'invites.status': 'pending',
    })
      .populate('owner', 'fullName avatar')
      .sort({ createdAt: -1 });

    const invites = projects.map((p) => {
      const invite = p.invites.find(
        (i) => i.user.toString() === req.user.id && i.status === 'pending'
      );
      return { project: p, invite };
    });
    res.json(invites);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/projects — create a project
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const project = new Project({
      title,
      description: description || '',
      owner: req.user.id,
      members: [req.user.id],
    });
    await project.save();
    await project.populate('owner', 'fullName avatar');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET /api/projects/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'fullName avatar title')
      .populate('members', 'fullName avatar title')
      .populate('invites.user', 'fullName avatar');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/projects/:id/invite — invite a user to a project
router.post('/:id/invite', auth, async (req, res) => {
  const { targetUserId, sourcePost } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project owner can invite' });
    }
    // Already a member?
    if (project.members.map(String).includes(targetUserId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    // Already invited?
    const existingInvite = project.invites.find(
      (i) => i.user.toString() === targetUserId && i.status === 'pending'
    );
    if (existingInvite) {
      return res.status(400).json({ message: 'User already has a pending invite' });
    }

    project.invites.push({ user: targetUserId, sourcePost: sourcePost || null });
    await project.save();
    res.json({ message: 'Invite sent' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/projects/:id/respond — accept or decline an invite
router.post('/:id/respond', auth, async (req, res) => {
  const { action } = req.body; // 'accept' | 'decline'
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const invite = project.invites.find(
      (i) => i.user.toString() === req.user.id && i.status === 'pending'
    );
    if (!invite) return res.status(404).json({ message: 'No pending invite found' });

    if (action === 'accept') {
      invite.status = 'accepted';
      if (!project.members.map(String).includes(req.user.id)) {
        project.members.push(req.user.id);
      }
    } else {
      invite.status = 'declined';
    }
    await project.save();
    res.json({ message: `Invite ${action}ed` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/projects/:id/request-join — express interest / request to join a project
router.post('/:id/request-join', auth, async (req, res) => {
  const { sourcePost } = req.body; // optional: the post that triggered this
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Already a member?
    if (project.members.map(String).includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member of this project' });
    }

    // Already have a pending request/invite?
    const existingInvite = project.invites.find(
      (i) => i.user.toString() === req.user.id && i.status === 'pending'
    );
    if (existingInvite) {
      return res.status(400).json({ message: 'You already have a pending request for this project' });
    }

    project.invites.push({
      user: req.user.id,
      sourcePost: sourcePost || null,
      status: 'pending',
    });
    await project.save();
    res.json({ message: 'Interest expressed — the project owner will be notified' });
  } catch (err) {
    console.error('POST /api/projects/:id/request-join error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/projects/:id/requests/:userId/respond — owner accepts/declines a join request
router.post('/:id/requests/:userId/respond', auth, async (req, res) => {
  const { action } = req.body; // 'accept' | 'decline'
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project owner can respond to requests' });
    }

    const invite = project.invites.find(
      (i) => i.user.toString() === req.params.userId && i.status === 'pending'
    );
    if (!invite) return res.status(404).json({ message: 'No pending request found for this user' });

    if (action === 'accept') {
      invite.status = 'accepted';
      if (!project.members.map(String).includes(req.params.userId)) {
        project.members.push(req.params.userId);
      }
    } else {
      invite.status = 'declined';
    }
    await project.save();
    res.json({ message: `Request ${action}ed` });
  } catch (err) {
    console.error('POST /api/projects/:id/requests/:userId/respond error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
