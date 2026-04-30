/**
 * Mock user profiles for the Discover (swipe) page.
 *
 * Each object mirrors the User schema from IMPLEMENTATION.md so that
 * swapping this array for a real API response requires zero structural changes.
 */

const mockUsers = [
  {
    id: "u1",
    displayName: "Ananya Bhat",
    username: "ananyabuilds",
    avatar: "",
    initials: "AB",
    bio: "Frontend developer helping founders shape polished product experiences.",
    aboutMe:
      "I am a frontend-focused builder who enjoys turning rough ideas into polished, human-centered experiences. I usually collaborate with startup teams and student founders who need interface systems, clearer product flows, and quick iteration while validating their projects.",
    location: "Bengaluru, India",
    website: "https://ananyabuilds.dev",
    socialLinks: {
      github: "github.com/ananyabuilds",
      linkedin: "linkedin.com/in/ananyabuilds",
      portfolio: "ananyabuilds.dev",
    },
    skills: ["React", "CSS", "Figma", "TypeScript", "Tailwind CSS"],
    availability: "open-to-work",
    experience: [
      {
        company: "SkillMesh Community",
        position: "Product Designer + Frontend Developer",
        employmentType: "freelance",
        location: "Remote",
        startDate: "2024-01-01",
        endDate: null,
        isCurrent: true,
        description:
          "Designing clean community workflows, profile systems, and collaboration spaces for student builders.",
        skills: ["React", "Figma", "Tailwind CSS"],
      },
      {
        company: "Independent Projects",
        position: "Freelance UI Developer",
        employmentType: "freelance",
        location: "Remote",
        startDate: "2022-06-01",
        endDate: "2023-12-31",
        isCurrent: false,
        description:
          "Built landing pages, startup MVPs, and polished profile flows for early-stage teams.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
      },
    ],
    projects: [
      {
        title: "Student Skill Exchange App",
        description:
          "A platform that matches students based on complementary skills for project collaboration.",
        role: "Lead Frontend Developer",
        techStack: ["React", "Node.js", "MongoDB"],
        status: "ongoing",
        highlights: [
          "Designed the matching algorithm UI",
          "Built the onboarding flow",
        ],
      },
      {
        title: "Portfolio Builder Tool",
        description:
          "Drag-and-drop portfolio site builder for non-technical creators.",
        role: "Solo Developer",
        techStack: ["React", "Firebase", "Tailwind CSS"],
        status: "completed",
        highlights: [
          "500+ users in first month",
          "Featured on ProductHunt",
        ],
      },
    ],
    stats: { projects: 18, connections: 46, responseRate: 93 },
    openTo: ["Startup MVPs", "Hackathon teams", "UI audits", "Frontend collaboration"],
    posts: [
      {
        title: "Looking for a backend collaborator",
        description:
          "Building a student skill exchange app and need help refining the matching logic and API structure.",
        tag: "Open for collaboration",
      },
    ],
    reviews: [
      {
        reviewerId: "u2",
        reviewerName: "Rahul Menon",
        reviewerInitials: "RM",
        rating: 5,
        text: "Ananya turned my rough API specs into a beautiful, intuitive frontend in under a week. Her eye for detail and speed of execution are remarkable.",
        project: "Student Skill Exchange App",
        date: "2025-11-15",
      },
      {
        reviewerId: "u4",
        reviewerName: "Arjun Krishnan",
        reviewerInitials: "AK",
        rating: 5,
        text: "One of the best frontend developers I've collaborated with. She understood the design intent perfectly and added micro-interactions I hadn't even considered.",
        project: "Portfolio Builder Tool",
        date: "2025-08-22",
      },
      {
        reviewerId: "u6",
        reviewerName: "Karthik Nair",
        reviewerInitials: "KN",
        rating: 4,
        text: "Great collaborator — responsive, communicative, and ships clean code. Would definitely work with her again on future projects.",
        project: "CampusConnect UI Redesign",
        date: "2025-06-10",
      },
    ],
  },

  {
    id: "u2",
    displayName: "Rahul Menon",
    username: "rahuldev",
    avatar: "",
    initials: "RM",
    bio: "Backend engineer obsessed with clean APIs and scalable architecture.",
    aboutMe:
      "I love designing REST and GraphQL APIs that are a joy to consume. Currently deep into microservices, event-driven patterns, and database optimisation. Looking for frontend partners to bring ideas to life.",
    location: "Chennai, India",
    website: "https://rahulmenon.dev",
    socialLinks: {
      github: "github.com/rahulmenon",
      linkedin: "linkedin.com/in/rahulmenon",
      portfolio: "rahulmenon.dev",
    },
    skills: ["Node.js", "MongoDB", "Express", "PostgreSQL", "Docker"],
    availability: "open-to-work",
    experience: [
      {
        company: "Zoho Corp",
        position: "Backend Developer Intern",
        employmentType: "internship",
        location: "Chennai, India",
        startDate: "2024-05-01",
        endDate: "2024-08-31",
        isCurrent: false,
        description:
          "Built internal tooling APIs and optimised database queries reducing response times by 40%.",
        skills: ["Node.js", "PostgreSQL", "Redis"],
      },
    ],
    projects: [
      {
        title: "TaskFlow API",
        description:
          "A RESTful task management API with JWT auth, role-based access, and pagination.",
        role: "Solo Developer",
        techStack: ["Express", "MongoDB", "JWT"],
        status: "completed",
        highlights: [
          "Full CRUD with filtering and sorting",
          "Comprehensive test coverage",
        ],
      },
    ],
    stats: { projects: 12, connections: 31, responseRate: 87 },
    openTo: ["API development", "Backend systems", "Database design", "Code reviews"],
    posts: [
      {
        title: "Open to mentoring junior devs",
        description:
          "Happy to pair-program on backend projects and help with system design concepts.",
        tag: "Mentorship",
      },
    ],
    reviews: [
      {
        reviewerId: "u1",
        reviewerName: "Ananya Bhat",
        reviewerInitials: "AB",
        rating: 5,
        text: "Rahul built the entire backend for our skill exchange app in record time. His API design is incredibly clean and well-documented.",
        project: "Student Skill Exchange App",
        date: "2025-12-01",
      },
      {
        reviewerId: "u8",
        reviewerName: "Siddharth Rao",
        reviewerInitials: "SR",
        rating: 4,
        text: "Solid backend engineer who thinks about scalability from day one. Helped me optimise our deployment pipeline with well-structured API endpoints.",
        project: "TaskFlow API",
        date: "2025-09-18",
      },
    ],
  },

  {
    id: "u3",
    displayName: "Neha Sharma",
    username: "nehaml",
    avatar: "",
    initials: "NS",
    bio: "AI/ML enthusiast building intelligent systems that solve real problems.",
    aboutMe:
      "I work at the intersection of machine learning and product development. My focus is on NLP, recommendation systems, and making AI accessible to non-technical users through clean interfaces.",
    location: "Hyderabad, India",
    website: "",
    socialLinks: {
      github: "github.com/nehasharma-ml",
      linkedin: "linkedin.com/in/nehasharma",
      portfolio: "",
    },
    skills: ["Python", "TensorFlow", "NLP", "scikit-learn", "FastAPI"],
    availability: "freelancing",
    experience: [
      {
        company: "IIT Hyderabad Research Lab",
        position: "ML Research Assistant",
        employmentType: "part-time",
        location: "Hyderabad, India",
        startDate: "2023-08-01",
        endDate: null,
        isCurrent: true,
        description:
          "Working on sentiment analysis models for regional Indian languages using transformer architectures.",
        skills: ["Python", "PyTorch", "HuggingFace"],
      },
    ],
    projects: [
      {
        title: "Regional Language Sentiment Analyzer",
        description:
          "NLP pipeline that analyses sentiment in Hindi, Tamil, and Telugu social media posts.",
        role: "Lead Researcher",
        techStack: ["Python", "PyTorch", "HuggingFace"],
        status: "ongoing",
        highlights: [
          "85% accuracy on multilingual dataset",
          "Published preliminary findings",
        ],
      },
      {
        title: "Smart Expense Tracker",
        description:
          "Mobile app that categorises expenses using ML-based receipt scanning.",
        role: "ML Engineer",
        techStack: ["Python", "TensorFlow", "React Native"],
        status: "completed",
        highlights: [
          "OCR + classification pipeline",
          "92% categorisation accuracy",
        ],
      },
    ],
    stats: { projects: 9, connections: 22, responseRate: 78 },
    openTo: ["ML projects", "Research collaboration", "Data pipelines", "Hackathons"],
    posts: [],
    reviews: [
      {
        reviewerId: "u7",
        reviewerName: "Divya Iyer",
        reviewerInitials: "DI",
        rating: 5,
        text: "Neha's ML expertise is exceptional. She built a classification pipeline for our analytics project that exceeded all accuracy benchmarks.",
        project: "Smart Expense Tracker",
        date: "2025-10-05",
      },
      {
        reviewerId: "u5",
        reviewerName: "Priya Rajan",
        reviewerInitials: "PR",
        rating: 4,
        text: "Knowledgeable and thorough. Neha explained complex ML concepts clearly and integrated them seamlessly into our React Native app.",
        project: "Smart Expense Tracker",
        date: "2025-07-20",
      },
    ],
  },

  {
    id: "u4",
    displayName: "Arjun Krishnan",
    username: "arjunux",
    avatar: "",
    initials: "AK",
    bio: "UX designer turning complex workflows into simple, delightful interactions.",
    aboutMe:
      "I believe great products come from deep empathy with users. I specialise in user research, wireframing, prototyping, and design systems. I enjoy collaborating with developers who care about craft.",
    location: "Kochi, India",
    website: "https://arjunux.design",
    socialLinks: {
      github: "",
      linkedin: "linkedin.com/in/arjunux",
      portfolio: "arjunux.design",
    },
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Framer"],
    availability: "open-to-work",
    experience: [
      {
        company: "Freshworks",
        position: "UX Design Intern",
        employmentType: "internship",
        location: "Chennai, India",
        startDate: "2024-01-15",
        endDate: "2024-06-30",
        isCurrent: false,
        description:
          "Redesigned the onboarding flow for Freshdesk, reducing drop-off rates by 25%.",
        skills: ["Figma", "User Research", "A/B Testing"],
      },
      {
        company: "College Design Club",
        position: "Design Lead",
        employmentType: "part-time",
        location: "Kochi, India",
        startDate: "2022-08-01",
        endDate: "2024-05-31",
        isCurrent: false,
        description:
          "Led a team of 8 designers creating posters, web layouts, and branding for campus events.",
        skills: ["Figma", "Illustrator", "Team Leadership"],
      },
    ],
    projects: [
      {
        title: "Freshdesk Onboarding Redesign",
        description:
          "Complete rethink of the first-time user experience for Freshdesk.",
        role: "UX Designer",
        techStack: ["Figma", "Maze", "Hotjar"],
        status: "completed",
        highlights: [
          "25% reduction in onboarding drop-off",
          "Shipped to 50K+ users",
        ],
      },
    ],
    stats: { projects: 14, connections: 38, responseRate: 91 },
    openTo: ["Product design", "Design systems", "UX audits", "Startup branding"],
    posts: [
      {
        title: "Looking for dev partners for a productivity app",
        description:
          "I have the designs ready for a Pomodoro + task management app. Need React and backend developers.",
        tag: "Open for collaboration",
      },
    ],
    reviews: [
      {
        reviewerId: "u1",
        reviewerName: "Ananya Bhat",
        reviewerInitials: "AB",
        rating: 5,
        text: "Arjun's design work is phenomenal. His wireframes were so detailed that implementation was seamless. A true design partner.",
        project: "Portfolio Builder Tool",
        date: "2025-09-12",
      },
      {
        reviewerId: "u6",
        reviewerName: "Karthik Nair",
        reviewerInitials: "KN",
        rating: 5,
        text: "Working with Arjun on CampusConnect was a game-changer. His user research insights completely transformed our onboarding flow.",
        project: "CampusConnect",
        date: "2025-05-30",
      },
    ],
  },

  {
    id: "u5",
    displayName: "Priya Rajan",
    username: "priyacodes",
    avatar: "",
    initials: "PR",
    bio: "Full-stack developer with a passion for open source and developer tooling.",
    aboutMe:
      "I contribute to open source projects and build developer tools that improve workflow efficiency. Currently exploring Rust for CLI tools and WebAssembly for performance-critical web apps.",
    location: "Mumbai, India",
    website: "https://priyarajan.dev",
    socialLinks: {
      github: "github.com/priyacodes",
      linkedin: "linkedin.com/in/priyarajan",
      portfolio: "priyarajan.dev",
    },
    skills: ["JavaScript", "Rust", "React", "Go", "WebAssembly"],
    availability: "not-available",
    experience: [
      {
        company: "Hasura",
        position: "Open Source Contributor",
        employmentType: "contract",
        location: "Remote",
        startDate: "2023-03-01",
        endDate: "2024-02-28",
        isCurrent: false,
        description:
          "Contributed to the Hasura CLI tooling and improved developer documentation.",
        skills: ["Go", "GraphQL", "Technical Writing"],
      },
    ],
    projects: [
      {
        title: "DevDash CLI",
        description:
          "A terminal dashboard that aggregates GitHub notifications, CI status, and PR reviews.",
        role: "Creator",
        techStack: ["Rust", "GitHub API"],
        status: "ongoing",
        highlights: [
          "200+ GitHub stars",
          "Featured in Rust weekly newsletter",
        ],
      },
      {
        title: "WASM Image Compressor",
        description:
          "Browser-based image compression using WebAssembly for near-native speed.",
        role: "Solo Developer",
        techStack: ["Rust", "WebAssembly", "React"],
        status: "completed",
        highlights: [
          "3x faster than JS-only solutions",
          "Zero server-side processing",
        ],
      },
    ],
    stats: { projects: 22, connections: 67, responseRate: 64 },
    openTo: ["Open source", "CLI tools", "Performance optimisation"],
    posts: [],
    reviews: [
      {
        reviewerId: "u2",
        reviewerName: "Rahul Menon",
        reviewerInitials: "RM",
        rating: 4,
        text: "Priya's open source mindset is refreshing. She wrote clean, well-tested Rust code and her documentation was top-notch.",
        project: "DevDash CLI",
        date: "2025-11-02",
      },
    ],
  },

  {
    id: "u6",
    displayName: "Karthik Nair",
    username: "karthikdev",
    avatar: "",
    initials: "KN",
    bio: "Mobile developer crafting smooth cross-platform experiences.",
    aboutMe:
      "I build mobile apps with React Native and Flutter. I care deeply about smooth animations, offline-first architecture, and making apps that feel native on every platform.",
    location: "Trivandrum, India",
    website: "",
    socialLinks: {
      github: "github.com/karthiknair",
      linkedin: "linkedin.com/in/karthiknair",
      portfolio: "",
    },
    skills: ["React Native", "Flutter", "Dart", "Firebase", "Swift"],
    availability: "open-to-work",
    experience: [
      {
        company: "Startup Studio",
        position: "Mobile Developer",
        employmentType: "full-time",
        location: "Trivandrum, India",
        startDate: "2023-07-01",
        endDate: null,
        isCurrent: true,
        description:
          "Building cross-platform mobile apps for early-stage startups. Shipped 3 apps to production.",
        skills: ["React Native", "Firebase", "Redux"],
      },
    ],
    projects: [
      {
        title: "CampusConnect",
        description:
          "A mobile app for university students to find study groups and events.",
        role: "Lead Mobile Developer",
        techStack: ["React Native", "Firebase", "Expo"],
        status: "completed",
        highlights: [
          "1000+ student users",
          "Featured by university administration",
        ],
      },
    ],
    stats: { projects: 8, connections: 19, responseRate: 95 },
    openTo: ["Mobile apps", "Cross-platform development", "Hackathon teams"],
    posts: [
      {
        title: "Building a campus events app",
        description:
          "Looking for designers and backend developers to help scale CampusConnect to more universities.",
        tag: "Open for collaboration",
      },
    ],
    reviews: [
      {
        reviewerId: "u4",
        reviewerName: "Arjun Krishnan",
        reviewerInitials: "AK",
        rating: 5,
        text: "Karthik is the fastest mobile developer I know. He shipped a polished React Native app from my Figma designs in just 2 weeks.",
        project: "CampusConnect",
        date: "2025-08-15",
      },
      {
        reviewerId: "u1",
        reviewerName: "Ananya Bhat",
        reviewerInitials: "AB",
        rating: 4,
        text: "Smooth collaboration — Karthik handled all the mobile complexity while I focused on the web dashboard. Great communication throughout.",
        project: "CampusConnect",
        date: "2025-07-28",
      },
    ],
  },

  {
    id: "u7",
    displayName: "Divya Iyer",
    username: "divyadata",
    avatar: "",
    initials: "DI",
    bio: "Data engineer building pipelines that turn messy data into actionable insights.",
    aboutMe:
      "I specialise in ETL pipelines, data warehousing, and analytics dashboards. I enjoy working with teams that value data-driven decisions and clean data architecture.",
    location: "Pune, India",
    website: "https://divyaiyer.com",
    socialLinks: {
      github: "github.com/divyadata",
      linkedin: "linkedin.com/in/divyaiyer",
      portfolio: "divyaiyer.com",
    },
    skills: ["Python", "Apache Spark", "SQL", "Airflow", "dbt"],
    availability: "freelancing",
    experience: [
      {
        company: "Flipkart",
        position: "Data Engineering Intern",
        employmentType: "internship",
        location: "Bengaluru, India",
        startDate: "2024-01-10",
        endDate: "2024-07-10",
        isCurrent: false,
        description:
          "Built real-time data pipelines processing 10M+ events per day for product analytics.",
        skills: ["Apache Kafka", "Spark", "Python"],
      },
    ],
    projects: [
      {
        title: "Real-Time Sales Dashboard",
        description:
          "End-to-end analytics dashboard with live data streaming from multiple sources.",
        role: "Data Engineer",
        techStack: ["Python", "Kafka", "Grafana", "PostgreSQL"],
        status: "completed",
        highlights: [
          "Sub-second data freshness",
          "Used by 3 product teams internally",
        ],
      },
    ],
    stats: { projects: 11, connections: 28, responseRate: 82 },
    openTo: ["Data pipelines", "Analytics dashboards", "ETL projects", "Mentorship"],
    posts: [
      {
        title: "Need frontend help for a data viz project",
        description:
          "I have the backend pipeline ready. Looking for someone skilled in D3.js or Chart.js.",
        tag: "Open for collaboration",
      },
    ],
    reviews: [
      {
        reviewerId: "u3",
        reviewerName: "Neha Sharma",
        reviewerInitials: "NS",
        rating: 5,
        text: "Divya built an incredible data pipeline for our ML project. Her Spark expertise and attention to data quality saved us weeks of work.",
        project: "Real-Time Sales Dashboard",
        date: "2025-10-20",
      },
    ],
  },

  {
    id: "u8",
    displayName: "Siddharth Rao",
    username: "siddharthdev",
    avatar: "",
    initials: "SR",
    bio: "DevOps engineer automating everything from CI/CD to cloud infrastructure.",
    aboutMe:
      "I build reliable deployment pipelines and infrastructure as code. Passionate about Kubernetes, GitOps, and helping teams ship faster with confidence.",
    location: "Delhi, India",
    website: "",
    socialLinks: {
      github: "github.com/siddharthrao",
      linkedin: "linkedin.com/in/siddharthrao",
      portfolio: "",
    },
    skills: ["AWS", "Kubernetes", "Terraform", "GitHub Actions", "Linux"],
    availability: "open-to-work",
    experience: [
      {
        company: "Razorpay",
        position: "Site Reliability Intern",
        employmentType: "internship",
        location: "Bengaluru, India",
        startDate: "2024-06-01",
        endDate: "2024-09-30",
        isCurrent: false,
        description:
          "Automated deployment pipelines and monitoring for payment processing services.",
        skills: ["Kubernetes", "Prometheus", "Grafana"],
      },
    ],
    projects: [
      {
        title: "Auto-Scaling K8s Platform",
        description:
          "A self-healing Kubernetes platform with auto-scaling based on custom metrics.",
        role: "Infrastructure Engineer",
        techStack: ["Kubernetes", "Terraform", "Prometheus"],
        status: "ongoing",
        highlights: [
          "99.9% uptime achieved",
          "Handles 5x traffic spikes automatically",
        ],
      },
    ],
    stats: { projects: 7, connections: 15, responseRate: 88 },
    openTo: ["DevOps consulting", "CI/CD setup", "Cloud architecture", "Infrastructure review"],
    posts: [],
    reviews: [
      {
        reviewerId: "u2",
        reviewerName: "Rahul Menon",
        reviewerInitials: "RM",
        rating: 5,
        text: "Siddharth set up our entire CI/CD pipeline from scratch. Zero-downtime deployments and excellent monitoring. Couldn't ask for more.",
        project: "TaskFlow API Deployment",
        date: "2025-09-25",
      },
      {
        reviewerId: "u5",
        reviewerName: "Priya Rajan",
        reviewerInitials: "PR",
        rating: 4,
        text: "Reliable infrastructure engineer. Siddharth helped containerise my Rust CLI tool and set up automated releases via GitHub Actions.",
        project: "DevDash CLI",
        date: "2025-08-10",
      },
    ],
  },
];

export default mockUsers;
