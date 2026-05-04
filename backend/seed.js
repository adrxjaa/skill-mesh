/**
 * Seed script — creates 3 demo users and 1 demo project.
 *
 * Usage:  node backend/seed.js
 *
 * Idempotent: skips creation if the users / project already exist.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillmesh';

const DEMO_PASSWORD = 'password123';

const DEMO_USERS = [
  {
    fullName: 'Ananya Bhat',
    email: 'ananya@demo.skillmesh',
    bio: 'Frontend developer helping founders shape polished product experiences.',
    title: 'Frontend Developer',
    location: 'Bengaluru, India',
    availability: 'open-to-work',
    skills: ['React', 'CSS', 'Figma', 'TypeScript', 'Tailwind CSS'],
    profileComplete: true,
  },
  {
    fullName: 'Rohan Kapoor',
    email: 'rohan@demo.skillmesh',
    bio: 'Full-stack engineer passionate about building scalable web applications.',
    title: 'Full Stack Developer',
    location: 'Mumbai, India',
    availability: 'freelancing',
    skills: ['Node.js', 'React', 'MongoDB', 'Docker', 'Python'],
    profileComplete: true,
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya@demo.skillmesh',
    bio: 'UI/UX designer crafting delightful interfaces that users love.',
    title: 'UI/UX Designer',
    location: 'Delhi, India',
    availability: 'open-to-work',
    skills: ['Figma', 'Adobe XD', 'CSS', 'User Research', 'Prototyping'],
    profileComplete: true,
  },
];

const DEMO_PROJECT = {
  title: 'SkillMesh v2.0',
  description:
    'Next-generation collaboration platform with real-time messaging, project management, and skill-based matching. We are building a complete redesign with improved UX, WebSocket chat, and a revamped discovery engine.',
  docsLink: 'https://docs.google.com/document/d/1BxiMkMeaningfulPlaceholder/edit?usp=sharing',
  status: 'active',
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

    const userIds = [];

    for (const userData of DEMO_USERS) {
      let user = await User.findOne({ email: userData.email });
      if (user) {
        console.log(`   User "${userData.fullName}" already exists (${user._id})`);
      } else {
        user = new User({ ...userData, password: hashedPassword });
        await user.save();
        console.log(`   ✅ Created user "${userData.fullName}" (${user._id})`);
      }
      userIds.push(user._id);
    }

    // Create project
    let project = await Project.findOne({ title: DEMO_PROJECT.title });
    if (project) {
      console.log(`   Project "${project.title}" already exists (${project._id})`);
    } else {
      project = new Project({
        ...DEMO_PROJECT,
        owner: userIds[0], // Ananya is the owner
        members: userIds,  // all 3 are members
      });
      await project.save();
      console.log(`   ✅ Created project "${project.title}" (${project._id})`);
    }

    console.log('\n🎉 Seed complete!');
    console.log('\nDemo logins (password: password123):');
    DEMO_USERS.forEach((u) => console.log(`   • ${u.email}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
