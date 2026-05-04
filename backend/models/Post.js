const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['community', 'requirement'], default: 'community' },
  title: { type: String, default: null },
  body: { type: String, required: true },
  tags: { type: [String], default: [] },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  openToWork: { type: Boolean, default: false },
  imageUrl: { type: String, default: null },
  linkUrl: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
