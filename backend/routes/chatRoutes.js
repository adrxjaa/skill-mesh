const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * GET /api/chat/conversations
 *
 * Returns everything the Chat UI needs to render the sidebar:
 *   - projects: all active projects the user is a member of (with populated members)
 *   - dmUsers:  flat list of unique teammates the user can DM
 */
router.get('/conversations', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
      status: { $ne: 'archived' },
    })
      .populate('owner', 'fullName avatar title email')
      .populate('members', 'fullName avatar title email')
      .sort({ createdAt: -1 });

    // Build a unique set of teammates (from all projects) the user can DM
    const teammateMap = new Map();
    for (const project of projects) {
      for (const member of project.members) {
        const mid = member._id.toString();
        if (mid !== req.user.id && !teammateMap.has(mid)) {
          teammateMap.set(mid, {
            _id: member._id,
            fullName: member.fullName,
            avatar: member.avatar,
            title: member.title,
            email: member.email,
          });
        }
      }
    }

    res.json({
      projects,
      dmUsers: Array.from(teammateMap.values()),
    });
  } catch (err) {
    console.error('GET /api/chat/conversations error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
