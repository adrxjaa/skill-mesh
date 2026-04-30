/**
 * Mock feed posts for the Dashboard page.
 *
 * Each post mirrors the structure that the backend API would return,
 * so swapping this for a real API call requires zero structural changes.
 *
 * `type` determines which card component renders the post:
 *   - "requirement" → RequirementPostCard (standout orange-border card)
 *   - "community"   → CommunityPostCard   (standard card)
 */

const mockPosts = [
  {
    id: "post-1",
    type: "requirement",
    author: {
      id: "u4",
      displayName: "Arjun Krishnan",
      initials: "AK",
      title: "UX Designer",
    },
    title: "Need a UX Designer for a FinTech MVP",
    body: "Building a new micro-investment platform aimed at students. The backend is solid (Node/Postgres), but I need someone to help design an intuitive, high-trust onboarding flow. Equity split available.",
    tags: ["UX Design", "FinTech", "Figma"],
    matchTag: "Wireframing",
    label: "Looking for Team",
    openToWork: true,
    likes: 12,
    comments: 1,
    createdAt: "2026-04-30T08:00:00Z",
    imageUrl: null,
    linkUrl: null,
  },
  {
    id: "post-2",
    type: "community",
    author: {
      id: "u5",
      displayName: "Priya Rajan",
      initials: "PR",
      title: "Full-Stack Developer",
    },
    title: null,
    body: "Just published a new case study on improving retention in SaaS products through micro-interactions. The key takeaway? Don't underestimate the power of a well-timed state change animation. Thoughts?",
    tags: [],
    matchTag: null,
    label: "Update",
    openToWork: false,
    likes: 45,
    comments: 1,
    createdAt: "2026-04-30T05:00:00Z",
    imageUrl: null,
    linkUrl: "https://priyarajan.dev/case-study-saas-retention",
  },
  {
    id: "post-3",
    type: "requirement",
    author: {
      id: "u2",
      displayName: "Rahul Menon",
      initials: "RM",
      title: "Backend Engineer",
    },
    title: "Looking for React Dev — Student Budget Tracker",
    body: "I've built a REST API with Node + Express for a student budget tracking app. Need a React developer to build the frontend — dashboard with charts, auth flows, and a clean mobile-responsive layout.",
    tags: ["React", "Charts", "REST API"],
    matchTag: "React",
    label: "Looking for Team",
    openToWork: true,
    likes: 8,
    comments: 0,
    createdAt: "2026-04-29T18:00:00Z",
    imageUrl: null,
    linkUrl: null,
  },
  {
    id: "post-4",
    type: "community",
    author: {
      id: "u3",
      displayName: "Neha Sharma",
      initials: "NS",
      title: "AI/ML Engineer",
    },
    title: null,
    body: "Spent the weekend fine-tuning a sentiment analysis model for Hindi tweets. Accuracy jumped from 72% to 86% after switching to a multilingual transformer. Happy to share my findings if anyone's working on similar NLP projects!",
    tags: [],
    matchTag: null,
    label: "Update",
    openToWork: false,
    likes: 32,
    comments: 0,
    createdAt: "2026-04-29T14:00:00Z",
    imageUrl: null,
    linkUrl: null,
  },
  {
    id: "post-5",
    type: "requirement",
    author: {
      id: "u7",
      displayName: "Divya Iyer",
      initials: "DI",
      title: "Data Engineer",
    },
    title: "Need Frontend Help for a Data Viz Project",
    body: "I have the backend pipeline ready — real-time sales data flowing through Kafka into Postgres. Looking for someone skilled in D3.js or Chart.js to build an interactive analytics dashboard.",
    tags: ["D3.js", "Chart.js", "Data Viz"],
    matchTag: null,
    label: "Looking for Team",
    openToWork: false,
    likes: 15,
    comments: 0,
    createdAt: "2026-04-29T10:00:00Z",
    imageUrl: null,
    linkUrl: null,
  },
  {
    id: "post-6",
    type: "community",
    author: {
      id: "u6",
      displayName: "Karthik Nair",
      initials: "KN",
      title: "Mobile Developer",
    },
    title: null,
    body: "CampusConnect just crossed 1,000 student users! 🎉 Huge thanks to everyone who helped beta test. Next milestone: expanding to 3 more universities. If your campus needs a study group + events app, DM me.",
    tags: [],
    matchTag: null,
    label: "Milestone",
    openToWork: false,
    likes: 67,
    comments: 2,
    createdAt: "2026-04-28T22:00:00Z",
    imageUrl: null,
    linkUrl: null,
  },
];

/**
 * Seed comments for demo posts.
 * Keys are post IDs, values are arrays of comment objects.
 */
export const mockComments = {
  "post-1": [
    {
      id: "c1",
      authorId: "u2",
      authorName: "Rahul Menon",
      authorInitials: "RM",
      text: "I know a great UX designer — sending you a DM!",
      createdAt: "2026-04-30T09:30:00Z",
    },
  ],
  "post-2": [
    {
      id: "c2",
      authorId: "u4",
      authorName: "Arjun Krishnan",
      authorInitials: "AK",
      text: "Great insights! Micro-interactions are often the difference between a good product and a great one.",
      createdAt: "2026-04-30T06:00:00Z",
    },
  ],
  "post-6": [
    {
      id: "c3",
      authorId: "u1",
      authorName: "Ananya Bhat",
      authorInitials: "AB",
      text: "Congrats Karthik! Would love to help with the web dashboard if you need one. 🚀",
      createdAt: "2026-04-29T00:00:00Z",
    },
    {
      id: "c4",
      authorId: "u3",
      authorName: "Neha Sharma",
      authorInitials: "NS",
      text: "Amazing milestone! Any plans to add an ML-based study group recommender?",
      createdAt: "2026-04-29T02:00:00Z",
    },
  ],
};

export default mockPosts;
