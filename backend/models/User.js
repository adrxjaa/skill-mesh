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

  bio: { type: String, default: '' },
  title: { type: String, default: '' },            
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },           
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


  //embeddings for vec
  embedding: { type: [Number], default: [], select: false },
  normalizedTags: { type: [String], default: [] },          

  profileComplete: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);

