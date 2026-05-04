const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { embedText, expandQuery, extractProfileText, suggestMissingTags, cosine } = require('../services/gemini');

const RATE_WINDOW_MS = 15000;
const lastRequestAt = new Map();

function rateKey(prefix, userId) {
  return `${prefix}:${userId}`;
}

function checkRateLimit(key) {
  const now = Date.now();
  const last = lastRequestAt.get(key) || 0;
  const elapsed = now - last;
  if (elapsed < RATE_WINDOW_MS) {
    return Math.ceil((RATE_WINDOW_MS - elapsed) / 1000);
  }
  lastRequestAt.set(key, now);
  return 0;
}


async function reEmbedUser(userId) {
  const retryAfter = checkRateLimit(rateKey('embed', userId));
  if (retryAfter) {
    console.warn(`[embed] Rate limited for user ${userId} (${retryAfter}s)`);
    return;
  }
  const user = await User.findById(userId);
  if (!user) return;

  try {
    const profileText = await extractProfileText(user);
    if (!profileText.trim()) return;

    const vector = await embedText(profileText);
    const normalizedTags = profileText.split(',').map(t => t.trim()).filter(Boolean);

    await User.findByIdAndUpdate(userId, {
      embedding: vector,
      normalizedTags,
    });
  } catch (err) {
    console.error('[embed] Failed to embed user:', err.message);
  }
}



router.post('/embed-self', auth, async (req, res) => {
  try {
    await reEmbedUser(req.user.id);
    const user = await User.findById(req.user.id).select('normalizedTags');
    res.json({ ok: true, normalizedTags: user.normalizedTags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Embedding failed' });
  }
});



router.get('/top', auth, async (req, res) => {
  const N = parseInt(req.query.n) || 3;
  try {
    
    const self = await User.findById(req.user.id).select('+embedding');
    if (!self || !self.embedding || self.embedding.length === 0) {
      
      await reEmbedUser(req.user.id);
      const refreshed = await User.findById(req.user.id).select('+embedding');
      if (!refreshed || !refreshed.embedding || refreshed.embedding.length === 0) {
        return res.json([]); 
      }
      self.embedding = refreshed.embedding;
    }

    
    const others = await User.find({
      _id: { $ne: req.user.id },
      embedding: { $exists: true, $not: { $size: 0 } },
    }).select('+embedding fullName title bio avatar skills normalizedTags availability');

    if (others.length === 0) return res.json([]);

    
    const scored = others
      .map(u => ({
        id: u._id,
        fullName: u.fullName,
        title: u.title,
        bio: u.bio,
        avatar: u.avatar,
        skills: u.skills,
        normalizedTags: u.normalizedTags,
        availability: u.availability,
        score: cosine(self.embedding, u.embedding),
      }))
      .filter(u => u.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, N)
      .map(u => ({ ...u, matchPercent: Math.round(u.score * 100) }));

    res.json(scored);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'KNN failed' });
  }
});



router.get('/search', auth, async (req, res) => {
  const { q = '' } = req.query;
  const N = parseInt(req.query.n) || 10;

  if (!q.trim()) return res.json([]);

  const retryAfter = checkRateLimit(rateKey('search', req.user.id));
  if (retryAfter) {
    return res.status(429).json({ message: 'Search rate limit exceeded', retryAfter });
  }

  try {
    
    const expandedText = await expandQuery(q);

    
    const queryVec = await embedText(expandedText);

    
    const users = await User.find({
      _id: { $ne: req.user.id },
      embedding: { $exists: true, $not: { $size: 0 } },
    }).select('+embedding fullName title bio avatar skills normalizedTags availability');

    if (users.length === 0) return res.json({ results: [], expandedQuery: expandedText });

    
    const results = users
      .map(u => ({
        id: u._id,
        fullName: u.fullName,
        title: u.title,
        bio: u.bio,
        avatar: u.avatar,
        skills: u.skills,
        normalizedTags: u.normalizedTags,
        availability: u.availability,
        score: cosine(queryVec, u.embedding),
      }))
      .filter(u => u.score > 0.3) 
      .sort((a, b) => b.score - a.score)
      .slice(0, N)
      .map(u => ({ ...u, matchPercent: Math.round(u.score * 100) }));

    res.json({ results, expandedQuery: expandedText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});



router.get('/suggest-tags', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const suggestions = await suggestMissingTags(user);
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Tag suggestion failed', error: err.message });
  }
});

module.exports = { router, reEmbedUser };
