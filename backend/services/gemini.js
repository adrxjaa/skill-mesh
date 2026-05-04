const { GoogleGenerativeAI } = require('@google/generative-ai');

const geminiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '')
  .split(',')
  .map(k => k.trim())
  .filter(Boolean);

const geminiClients = geminiKeys.map((key) => new GoogleGenerativeAI(key));
let geminiIndex = 0;
const EMBEDDING_URL = process.env.EMBEDDING_URL || 'http://127.0.0.1:8001/embed';

// ─── Cosine similarity ────────────────────────────────────────────────────────
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

// ─── Embed text → 768-dim vector via text-embedding-004 ──────────────────────
async function embedText(text) {
  try {
    const response = await fetch(EMBEDDING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Embedding service error: ${response.status} ${detail}`);
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.embedding)) {
      throw new Error('Embedding service returned invalid payload');
    }
    return data.embedding;
  } catch (err) {
    console.error('[embedding] Failed:', err.message);
    return [];
  }
}

function isRateLimitError(err) {
  const msg = (err && err.message) ? err.message : '';
  return msg.includes('429') || msg.includes('Too Many Requests') || msg.includes('quota') || msg.includes('Quota');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withGeminiPool(run, fallback) {
  if (geminiClients.length === 0) return fallback();
  if (geminiClients.length === 1) {
    try {
      return await run(geminiClients[0]);
    } catch (err) {
      console.warn('[gemini] Single key failed:', err.message);
      return fallback();
    }
  }

  const total = geminiClients.length;
  let lastErr = null;
  for (let i = 0; i < total; i++) {
    const client = geminiClients[geminiIndex];
    geminiIndex = (geminiIndex + 1) % total;
    try {
      return await run(client);
    } catch (err) {
      lastErr = err;
      if (!isRateLimitError(err)) break;
      await sleep(250);
    }
  }
  if (lastErr) console.warn('[gemini] Key pool exhausted:', lastErr.message);
  return fallback();
}

// ─── Expand a natural-language search query into rich skill concepts ──────────
// e.g. "someone good at making websites and AI backend"
//   → "web development, HTML, CSS, JavaScript, React, backend APIs, machine learning, Python, TensorFlow, REST APIs, system design"
async function expandQuery(rawQuery) {
  return withGeminiPool(async (client) => {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `You are a tech skill extractor for a developer collaboration platform.
    A user searched for: "${rawQuery}"

    Output ONLY a comma-separated list of relevant technical skills, tools, and domains that describe what this person is looking for.
    Be thorough and include related/implied skills. No explanations, no numbering, just the comma-separated list.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || rawQuery;
  }, () => rawQuery);
}

// ─── Build a skill fingerprint text from a user's profile ────────────────────
// Used to embed the profile for KNN matching
async function extractProfileText(user) {
  const expText = (user.experience || [])
    .map(e => `${e.position} at ${e.company}: ${e.description || ''}`)
    .join('. ');

  const raw = [
    user.title && `Title: ${user.title}`,
    user.bio && `Bio: ${user.bio}`,
    user.skills?.length && `Skills: ${user.skills.join(', ')}`,
    expText && `Experience: ${expText}`,
  ].filter(Boolean).join('\n');

  if (!raw.trim()) return user.skills?.join(', ') || '';

  const prompt = `You are a tech skill extractor for a developer collaboration platform.
  Based on this developer profile:
  ${raw}

  Output ONLY a comma-separated list of ALL technical skills, tools, domains, and areas of expertise this person has.
  Include both explicitly stated and implied skills. No explanations, no numbering, just the comma-separated list.`;

  return withGeminiPool(async (client) => {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || (user.skills?.join(', ') || raw);
  }, () => user.skills?.join(', ') || raw);
}

// ─── Suggest tags from bio/experience that aren't already in skills ───────────
async function suggestMissingTags(user) {
  const expText = (user.experience || [])
    .map(e => `${e.position} at ${e.company}: ${e.description || ''}`)
    .join('. ');

  const bio = user.bio || '';
  const existingSkills = (user.skills || []).map(s => s.toLowerCase());

  if (!bio && !expText) return [];

  const prompt = `You are a tech skill extractor for a developer collaboration platform.

  This developer's bio: "${bio}"
  Their experience: "${expText}"
  Skills they have already tagged: ${existingSkills.join(', ') || 'none'}

  Suggest up to 8 specific technical skills, tools, or domains implied by their bio and experience that are NOT already in their skill tags.
  Output ONLY a JSON array of short skill strings, e.g. ["React", "Node.js", "REST APIs"]
  No explanation, just the JSON array.`;

  return withGeminiPool(async (client) => {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip any markdown fences if present
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  }, () => []);
}

module.exports = { embedText, expandQuery, extractProfileText, suggestMissingTags, cosine };
