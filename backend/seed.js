/**
 * Seed script — creates demo users and 1 demo project.
 *
 * Usage:  node backend/seed.js
 *
 * Idempotent: upserts users and project.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const { embedText, extractProfileText } = require('./services/gemini');

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
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Framer Motion'],
    experience: [
      { company: 'Studio Atlas', position: 'Frontend Engineer', startYear: '2022', endYear: 'Present', description: 'Built React design system and UI performance improvements.' },
    ],
    profileComplete: true,
  },
  {
    fullName: 'Rohan Kapoor',
    email: 'rohan@demo.skillmesh',
    bio: 'Full-stack engineer building realtime collaboration platforms and APIs.',
    title: 'Full Stack Developer',
    location: 'Mumbai, India',
    availability: 'freelancing',
    skills: ['Node.js', 'React', 'MongoDB', 'Docker', 'Redis'],
    experience: [
      { company: 'CollabWorks', position: 'Full Stack Engineer', startYear: '2021', endYear: 'Present', description: 'Built WebSocket chat, REST APIs, and CI/CD pipelines.' },
    ],
    profileComplete: true,
  },
  {
    fullName: 'Priya Sharma',
    email: 'priya@demo.skillmesh',
    bio: 'UI/UX designer crafting delightful interfaces and design systems.',
    title: 'UI/UX Designer',
    location: 'Delhi, India',
    availability: 'open-to-work',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    experience: [
      { company: 'Northwind Labs', position: 'Product Designer', startYear: '2020', endYear: 'Present', description: 'Led UX research and high-fidelity prototypes for B2B apps.' },
    ],
    profileComplete: true,
  },
  {
    fullName: 'Vikram Iyer',
    email: 'vikram@demo.skillmesh',
    bio: 'React + Firebase engineer shipping fast MVPs for startups.',
    title: 'Frontend Engineer',
    location: 'Pune, India',
    availability: 'open-to-work',
    skills: ['React', 'Firebase', 'Firestore', 'Cloud Functions', 'Vite'],
    profileComplete: true,
  },
  {
    fullName: 'Meera Nair',
    email: 'meera@demo.skillmesh',
    bio: 'Backend engineer focused on Node.js, GraphQL, and scalable microservices.',
    title: 'Backend Engineer',
    location: 'Chennai, India',
    availability: 'freelancing',
    skills: ['Node.js', 'Express', 'GraphQL', 'PostgreSQL', 'Redis'],
    profileComplete: true,
  },
  {
    fullName: 'Arjun Rao',
    email: 'arjun@demo.skillmesh',
    bio: 'Next.js + Prisma builder delivering clean, SEO-friendly web apps.',
    title: 'Full Stack Engineer',
    location: 'Hyderabad, India',
    availability: 'open-to-work',
    skills: ['Next.js', 'Prisma', 'PostgreSQL', 'TypeScript', 'Vercel'],
    profileComplete: true,
  },
  {
    fullName: 'Zara Khan',
    email: 'zara@demo.skillmesh',
    bio: 'Machine learning engineer working on NLP, RAG pipelines, and evaluation.',
    title: 'ML Engineer',
    location: 'Bengaluru, India',
    availability: 'open-to-work',
    skills: ['Python', 'PyTorch', 'Transformers', 'RAG', 'Vector Databases'],
    profileComplete: true,
  },
  {
    fullName: 'Neel Desai',
    email: 'neel@demo.skillmesh',
    bio: 'Data engineer building pipelines with Spark, Airflow, and Kafka.',
    title: 'Data Engineer',
    location: 'Ahmedabad, India',
    availability: 'freelancing',
    skills: ['Apache Spark', 'Airflow', 'Kafka', 'Python', 'AWS Glue'],
    profileComplete: true,
  },
  {
    fullName: 'Sanya Bose',
    email: 'sanya@demo.skillmesh',
    bio: 'Mobile developer shipping Flutter apps with Firebase backend.',
    title: 'Mobile Developer',
    location: 'Kolkata, India',
    availability: 'open-to-work',
    skills: ['Flutter', 'Dart', 'Firebase', 'Cloud Messaging', 'Riverpod'],
    profileComplete: true,
  },
  {
    fullName: 'Aditya Menon',
    email: 'aditya@demo.skillmesh',
    bio: 'Android engineer focusing on Kotlin, Jetpack Compose, and performance.',
    title: 'Android Developer',
    location: 'Bengaluru, India',
    availability: 'not-available',
    skills: ['Kotlin', 'Jetpack Compose', 'Room', 'Retrofit', 'Firebase'],
    profileComplete: true,
  },
  {
    fullName: 'Isha Roy',
    email: 'isha@demo.skillmesh',
    bio: 'DevOps engineer automating infra with Terraform, Docker, and Kubernetes.',
    title: 'DevOps Engineer',
    location: 'Noida, India',
    availability: 'freelancing',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions'],
    profileComplete: true,
  },
  {
    fullName: 'Kabir Singh',
    email: 'kabir@demo.skillmesh',
    bio: 'QA engineer writing robust E2E test suites and CI coverage.',
    title: 'QA Engineer',
    location: 'Jaipur, India',
    availability: 'open-to-work',
    skills: ['Playwright', 'Cypress', 'Jest', 'CI/CD', 'Postman'],
    profileComplete: true,
  },
  {
    fullName: 'Ritika Das',
    email: 'ritika@demo.skillmesh',
    bio: 'Product manager turned builder, focuses on analytics and growth.',
    title: 'Product Manager',
    location: 'Gurgaon, India',
    availability: 'open-to-work',
    skills: ['Product Strategy', 'SQL', 'Mixpanel', 'A/B Testing', 'Notion'],
    profileComplete: true,
  },
  {
    fullName: 'Faiz Ahmed',
    email: 'faiz@demo.skillmesh',
    bio: 'Security engineer focused on web app hardening and threat modeling.',
    title: 'Security Engineer',
    location: 'Pune, India',
    availability: 'freelancing',
    skills: ['OWASP', 'Burp Suite', 'Penetration Testing', 'JWT', 'Zero Trust'],
    profileComplete: true,
  },
  {
    fullName: 'Nisha Verma',
    email: 'nisha@demo.skillmesh',
    bio: 'Solidity developer building DeFi protocols and smart contracts.',
    title: 'Blockchain Engineer',
    location: 'Remote',
    availability: 'open-to-work',
    skills: ['Solidity', 'Hardhat', 'Ethers.js', 'Smart Contracts', 'DeFi'],
    profileComplete: true,
  },
  {
    fullName: 'Rahul Jain',
    email: 'rahul@demo.skillmesh',
    bio: 'iOS developer crafting polished SwiftUI apps and SDK integrations.',
    title: 'iOS Developer',
    location: 'Chandigarh, India',
    availability: 'not-available',
    skills: ['Swift', 'SwiftUI', 'CoreData', 'Combine', 'Firebase'],
    profileComplete: true,
  },
  {
    fullName: 'Kavya Pillai',
    email: 'kavya@demo.skillmesh',
    bio: 'Growth marketer who codes landing pages and analytics dashboards.',
    title: 'Growth Engineer',
    location: 'Remote',
    availability: 'freelancing',
    skills: ['Webflow', 'GA4', 'SQL', 'Amplitude', 'React'],
    profileComplete: true,
  },
  {
    fullName: 'Dev Malhotra',
    email: 'dev@demo.skillmesh',
    bio: 'AR/VR developer building immersive prototypes in Unity and Blender.',
    title: 'AR/VR Developer',
    location: 'Bengaluru, India',
    availability: 'open-to-work',
    skills: ['Unity', 'C#', 'Blender', 'ARCore', 'XR Interaction Toolkit'],
    profileComplete: true,
  },
  {
    fullName: 'Sneha Kulkarni',
    email: 'sneha@demo.skillmesh',
    bio: 'GIS engineer mapping real-world data with Mapbox and PostGIS.',
    title: 'GIS Engineer',
    location: 'Nagpur, India',
    availability: 'open-to-work',
    skills: ['Mapbox', 'PostGIS', 'GeoJSON', 'Leaflet', 'Python'],
    profileComplete: true,
  },
  {
    fullName: 'Omar Siddiqui',
    email: 'omar@demo.skillmesh',
    bio: 'Game developer working on multiplayer gameplay systems.',
    title: 'Game Developer',
    location: 'Mumbai, India',
    availability: 'freelancing',
    skills: ['Unity', 'C#', 'Photon', 'Game Design', '3D Physics'],
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

async function buildEmbedding(userData) {
  try {
    const profileText = await extractProfileText(userData);
    if (!profileText || !profileText.trim()) return { embedding: [], normalizedTags: [] };
    const vector = await embedText(profileText);
    const normalizedTags = profileText.split(',').map(t => t.trim()).filter(Boolean);
    return { embedding: vector, normalizedTags };
  } catch (err) {
    console.warn('   ⚠️  Embedding skipped:', err.message);
    return { embedding: [], normalizedTags: [] };
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

    const userIds = [];

    for (const userData of DEMO_USERS) {
      const { embedding, normalizedTags } = await buildEmbedding(userData);
      const payload = {
        ...userData,
        password: hashedPassword,
        embedding,
        normalizedTags,
      };
      const user = await User.findOneAndUpdate(
        { email: userData.email },
        { $set: payload },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      console.log(`   ✅ Seeded user "${userData.fullName}" (${user._id})`);
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
    console.log('\nTry these search queries:');
    [
      'react firebase',
      'next.js prisma postgres',
      'ml engineer rag vector database',
      'flutter firebase mobile',
      'devops terraform kubernetes aws',
      'data engineer kafka airflow spark',
      'solidity smart contracts defi',
      'qa playwright cypress',
      'unity c# game developer',
      'mapbox postgis geojson',
    ].forEach((q) => console.log(`   • ${q}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
