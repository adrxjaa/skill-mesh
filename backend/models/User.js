const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startYear: { type: String, required: true },
  endYear: { type: String, default: 'Present' },
  description: { type: String, default: '' },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  // Profile fields
  bio: { type: String, default: '' },
  title: { type: String, default: '' },            // e.g. "Senior Full-Stack Engineer"
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },           // relative URL: /uploads/<file>
  availability: {
    type: String,
    enum: ['open-to-work', 'freelancing', 'not-available'],
    default: 'open-to-work',
  },
  socialLinks: {
    portfolio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  skills: { type: [String], default: [] },
  experience: { type: [ExperienceSchema], default: [] },

  profileComplete: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);

