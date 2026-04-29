# 🚀 TaskFlow — Online Task Management System

> A full-stack MERN application for managing tasks with user profiles, project history, peer reviews, and rich professional portfolios.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Authentication Flow](#authentication-flow)
- [User Roles & Permissions](#user-roles--permissions)
- [Non-Functional Requirements](#non-functional-requirements)

---

## Project Overview

**TaskFlow** is a web-based task management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to register, authenticate, and manage their personal tasks. Beyond basic task management, the platform supports rich user profiles with project history, work experience, peer reviews/endorsements, and a detailed "About Me" section — making it suitable as both a productivity tool and a lightweight professional portfolio.

**Course:** 22AIE457 Full Stack Development — Amrita School of Computing  
**Version:** 1.0  
**Architecture:** Three-tier (Presentation / Business Logic / Data)  
**API Style:** RESTful  
**Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (with React Router, Axios) |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Styling | Tailwind CSS (or CSS Modules) |
| State Management | React Context API / Redux Toolkit |
| File Uploads | Multer (for profile pictures, attachments) |

---

## System Architecture

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│              React.js SPA               │
│   (Pages, Components, Context/State)    │
└────────────────────┬────────────────────┘
                     │ HTTP/HTTPS (REST API)
┌────────────────────▼────────────────────┐
│         Business Logic Layer            │
│         Node.js + Express.js            │
│   (Routes, Controllers, Middleware)     │
└────────────────────┬────────────────────┘
                     │ Mongoose
┌────────────────────▼────────────────────┐
│              Data Layer                 │
│              MongoDB                    │
│  (Users, Tasks, Projects, Reviews)      │
└─────────────────────────────────────────┘
```

The backend follows **MVC (Model-View-Controller)** architecture:
- **Models** — Mongoose schemas
- **Controllers** — Business logic per resource
- **Routes** — Express route definitions
- **Middleware** — JWT auth guard, error handler, input validator

---

## Features

### 🔐 Authentication & Authorization (FR1, FR2, FR4)

- User registration with name, email, and password
- Email uniqueness validation on registration
- Password hashing with **bcrypt** (min 10 salt rounds)
- Login returns a signed **JWT token** (stored in `httpOnly` cookie or `localStorage`)
- Protected routes via `authMiddleware` — all task/profile endpoints require a valid JWT
- Users can only access and modify their own data
- Role-based access: **Admin**, **Registered User**, **Guest**

---

### ✅ Task Management (FR3)

Each authenticated user can perform full **CRUD** on their tasks.

**Task fields:**
| Field | Type | Description |
|---|---|---|
| `title` | String | Short title of the task (required) |
| `description` | String | Detailed description |
| `status` | Enum | `todo`, `in-progress`, `completed` |
| `priority` | Enum | `low`, `medium`, `high` |
| `dueDate` | Date | Optional deadline |
| `tags` | [String] | Optional labels/categories |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-updated on edit |
| `owner` | ObjectId | Reference to the User |

**Operations:**
- `POST /api/tasks` — Create a task
- `GET /api/tasks` — Get all tasks for logged-in user (with filter/sort/pagination)
- `GET /api/tasks/:id` — Get a single task
- `PUT /api/tasks/:id` — Update task fields
- `DELETE /api/tasks/:id` — Delete a task

**Filters supported:** `status`, `priority`, `tag`, `dueDateRange`  
**Sort supported:** `createdAt`, `dueDate`, `priority`  
**Pagination:** `?page=1&limit=10`

---

### 👤 User Profile — "About Me" Section

Each user has a rich public/private profile.

**Profile fields:**
| Field | Type | Description |
|---|---|---|
| `displayName` | String | Public display name |
| `username` | String | Unique handle (e.g. @johndoe) |
| `avatar` | String | URL to uploaded profile picture |
| `bio` | String | Short bio / tagline (max 200 chars) |
| `aboutMe` | String | Long-form "About Me" (markdown supported, max 2000 chars) |
| `location` | String | City, Country |
| `website` | String | Personal website URL |
| `socialLinks` | Object | `{ github, linkedin, twitter, portfolio }` |
| `skills` | [String] | List of skill tags (e.g. ["React", "Node.js"]) |
| `availability` | Enum | `open-to-work`, `freelancing`, `not-available` |
| `joinedAt` | Date | Account creation date |

**Endpoints:**
- `GET /api/users/:username` — Public profile view
- `GET /api/users/me` — Authenticated user's own profile
- `PUT /api/users/me` — Update own profile
- `POST /api/users/me/avatar` — Upload profile picture (multipart/form-data)

---

### 💼 Project History

Users can add projects they've worked on — similar to a portfolio or LinkedIn projects section.

**Project fields:**
| Field | Type | Description |
|---|---|---|
| `title` | String | Project name (required) |
| `description` | String | What the project does |
| `role` | String | User's role (e.g. "Lead Developer") |
| `techStack` | [String] | Technologies used |
| `startDate` | Date | When work began |
| `endDate` | Date | When it ended (null if ongoing) |
| `status` | Enum | `ongoing`, `completed`, `archived` |
| `projectUrl` | String | Live URL |
| `repoUrl` | String | GitHub/GitLab URL |
| `coverImage` | String | Image URL |
| `highlights` | [String] | Key achievements / bullet points |

**Endpoints:**
- `POST /api/users/me/projects` — Add a project
- `GET /api/users/:username/projects` — List all projects for a user (public)
- `PUT /api/users/me/projects/:projectId` — Update a project
- `DELETE /api/users/me/projects/:projectId` — Remove a project

---

### 🏢 Work Experience

Users can list professional experience, internships, and freelance work.

**Experience fields:**
| Field | Type | Description |
|---|---|---|
| `company` | String | Employer or client name |
| `position` | String | Job title |
| `employmentType` | Enum | `full-time`, `part-time`, `internship`, `freelance`, `contract` |
| `location` | String | Office location or "Remote" |
| `startDate` | Date | Start of employment |
| `endDate` | Date | End of employment (null if current) |
| `isCurrent` | Boolean | Whether this is the current job |
| `description` | String | Responsibilities and achievements |
| `skills` | [String] | Skills used in this role |

**Endpoints:**
- `POST /api/users/me/experience` — Add an experience entry
- `GET /api/users/:username/experience` — View experience list (public)
- `PUT /api/users/me/experience/:expId` — Edit an entry
- `DELETE /api/users/me/experience/:expId` — Delete an entry

---

### ⭐ Reviews & Endorsements

Other registered users can leave reviews/endorsements for a user. Admins can moderate reviews.

**Review fields:**
| Field | Type | Description |
|---|---|---|
| `reviewer` | ObjectId | User who wrote the review |
| `reviewee` | ObjectId | User being reviewed |
| `rating` | Number | 1–5 stars |
| `title` | String | Short headline for the review |
| `body` | String | Full review text (max 1000 chars) |
| `relationship` | Enum | `colleague`, `client`, `manager`, `teammate`, `other` |
| `isVisible` | Boolean | Reviewee can hide/show individual reviews |
| `createdAt` | Date | Timestamp |

**Rules:**
- A user cannot review themselves
- One review per reviewer-reviewee pair (can be edited, not duplicated)
- Reviewee can toggle visibility of any review on their profile
- Admins can delete any review

**Endpoints:**
- `POST /api/users/:username/reviews` — Submit a review (auth required)
- `GET /api/users/:username/reviews` — List visible reviews for a user (public)
- `PUT /api/reviews/:reviewId` — Edit own review
- `DELETE /api/reviews/:reviewId` — Delete own review (or admin)
- `PATCH /api/users/me/reviews/:reviewId/visibility` — Toggle review visibility on own profile

---

### 🛡️ Admin Panel

Admin users have elevated access:
- `GET /api/admin/users` — List all registered users
- `DELETE /api/admin/users/:id` — Delete a user account
- `GET /api/admin/tasks` — View all tasks across users
- `DELETE /api/admin/reviews/:id` — Moderate/remove any review
- `PATCH /api/admin/users/:id/role` — Promote/demote user roles

---

## Data Models

### User Schema (`models/User.js`)

```js
{
  displayName: { type: String, required: true },
  username:    { type: String, required: true, unique: true, lowercase: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },         // bcrypt hashed
  role:        { type: String, enum: ['admin', 'user'], default: 'user' },
  avatar:      { type: String, default: '' },
  bio:         { type: String, maxlength: 200 },
  aboutMe:     { type: String, maxlength: 2000 },
  location:    { type: String },
  website:     { type: String },
  socialLinks: {
    github:    String,
    linkedin:  String,
    twitter:   String,
    portfolio: String,
  },
  skills:       [String],
  availability: { type: String, enum: ['open-to-work', 'freelancing', 'not-available'], default: 'not-available' },
  experience:  [ExperienceSchema],   // embedded subdocument array
  projects:    [ProjectSchema],      // embedded subdocument array
  joinedAt:    { type: Date, default: Date.now },
}
```

### Task Schema (`models/Task.js`)

```js
{
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate:     { type: Date },
  tags:        [String],
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
}
```

### Review Schema (`models/Review.js`)

```js
{
  reviewer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:       { type: Number, min: 1, max: 5, required: true },
  title:        { type: String, required: true },
  body:         { type: String, maxlength: 1000 },
  relationship: { type: String, enum: ['colleague', 'client', 'manager', 'teammate', 'other'] },
  isVisible:    { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
}
```

### ProjectSchema (embedded in User)

```js
{
  title:       { type: String, required: true },
  description: String,
  role:        String,
  techStack:   [String],
  startDate:   Date,
  endDate:     Date,
  status:      { type: String, enum: ['ongoing', 'completed', 'archived'], default: 'ongoing' },
  projectUrl:  String,
  repoUrl:     String,
  coverImage:  String,
  highlights:  [String],
}
```

### ExperienceSchema (embedded in User)

```js
{
  company:        { type: String, required: true },
  position:       { type: String, required: true },
  employmentType: { type: String, enum: ['full-time', 'part-time', 'internship', 'freelance', 'contract'] },
  location:       String,
  startDate:      Date,
  endDate:        Date,
  isCurrent:      { type: Boolean, default: false },
  description:    String,
  skills:         [String],
}
```

---

## API Reference

### Auth Routes `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT |
| POST | `/logout` | ✅ | Invalidate session |
| GET | `/me` | ✅ | Get current user info |

### Task Routes `/api/tasks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get own tasks (filter/sort/paginate) |
| POST | `/` | ✅ | Create task |
| GET | `/:id` | ✅ | Get single task |
| PUT | `/:id` | ✅ | Update task |
| DELETE | `/:id` | ✅ | Delete task |

### User / Profile Routes `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me` | ✅ | Get own full profile |
| PUT | `/me` | ✅ | Update own profile |
| POST | `/me/avatar` | ✅ | Upload avatar |
| GET | `/:username` | ❌ | View public profile |
| GET | `/:username/projects` | ❌ | View public projects |
| POST | `/me/projects` | ✅ | Add project |
| PUT | `/me/projects/:pid` | ✅ | Edit project |
| DELETE | `/me/projects/:pid` | ✅ | Delete project |
| GET | `/:username/experience` | ❌ | View public experience |
| POST | `/me/experience` | ✅ | Add experience |
| PUT | `/me/experience/:eid` | ✅ | Edit experience |
| DELETE | `/me/experience/:eid` | ✅ | Delete experience |

### Review Routes `/api/users/:username/reviews` & `/api/reviews`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:username/reviews` | ❌ | Get visible reviews for user |
| POST | `/api/users/:username/reviews` | ✅ | Submit review |
| PUT | `/api/reviews/:id` | ✅ | Edit own review |
| DELETE | `/api/reviews/:id` | ✅ | Delete own review |
| PATCH | `/api/users/me/reviews/:id/visibility` | ✅ | Toggle review visibility |

### Admin Routes `/api/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | ✅ Admin | List all users |
| DELETE | `/users/:id` | ✅ Admin | Delete user |
| GET | `/tasks` | ✅ Admin | List all tasks |
| DELETE | `/reviews/:id` | ✅ Admin | Delete any review |
| PATCH | `/users/:id/role` | ✅ Admin | Change user role |

---

## Folder Structure

```
taskflow/
├── client/                          # React frontend
│   ├── public/
│   └── src/
│       ├── api/                     # Axios instance + API call helpers
│       ├── assets/                  # Static images, fonts
│       ├── components/
│       │   ├── common/              # Button, Modal, Input, Avatar, Badge
│       │   ├── tasks/               # TaskCard, TaskForm, TaskList, TaskFilter
│       │   ├── profile/             # ProfileHeader, AboutMe, SkillTags
│       │   ├── projects/            # ProjectCard, ProjectForm
│       │   ├── experience/          # ExperienceItem, ExperienceForm
│       │   └── reviews/             # ReviewCard, ReviewForm, StarRating
│       ├── context/
│       │   ├── AuthContext.jsx      # JWT + user state
│       │   └── TaskContext.jsx      # Task list state
│       ├── hooks/                   # useAuth, useTasks, useProfile
│       ├── pages/
│       │   ├── Landing.jsx          # Guest landing page
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx        # Task management view
│       │   ├── Profile.jsx          # Own profile edit
│       │   ├── PublicProfile.jsx    # Other user's profile (read-only)
│       │   └── Admin.jsx            # Admin panel
│       ├── utils/                   # formatDate, validators, constants
│       ├── App.jsx                  # Routes
│       └── main.jsx
│
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── adminMiddleware.js       # Role check
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validate.js              # express-validator wrapper
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                     # Multer avatar storage
│   ├── utils/
│   │   └── generateToken.js
│   └── index.js                     # Entry point
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Environment Variables

Create a `.env` file in `/server`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/taskflow
# or MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# File Uploads
MAX_FILE_SIZE=5242880    # 5MB in bytes
UPLOAD_DIR=uploads/
```

Create a `.env` file in `/client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Setup & Installation

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local) or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/your-org/taskflow.git
cd taskflow
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

```bash
cp server/.env.example server/.env
# Edit server/.env with your values
```

### 5. Run in development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Backend runs on: `http://localhost:5000`  
Frontend runs on: `http://localhost:5173`

### 6. Build for production

```bash
cd client && npm run build
# Serve the dist/ folder from the Express static middleware or a CDN
```

---

## Authentication Flow

```
Client                          Server
  |                                |
  |-- POST /api/auth/register ---> |
  |                                | Validate input
  |                                | Hash password (bcrypt)
  |                                | Save User to MongoDB
  |<-- 201 { user, token } --------|
  |                                |
  |-- POST /api/auth/login ------> |
  |                                | Verify email + password
  |                                | Sign JWT (payload: userId, role)
  |<-- 200 { user, token } --------|
  |                                |
  |-- GET /api/tasks ------------> |
  |   Authorization: Bearer <jwt>  | authMiddleware verifies token
  |                                | Attaches req.user = { id, role }
  |<-- 200 [ ...tasks ] ---------- |
```

JWT payload structure:
```json
{
  "id": "64f3...",
  "role": "user",
  "iat": 1700000000,
  "exp": 1700604800
}
```

---

## User Roles & Permissions

| Action | Guest | Registered User | Admin |
|---|---|---|---|
| View landing page | ✅ | ✅ | ✅ |
| View public profiles | ✅ | ✅ | ✅ |
| Register / Login | ✅ | — | — |
| Manage own tasks (CRUD) | ❌ | ✅ | ✅ |
| Edit own profile | ❌ | ✅ | ✅ |
| Add projects / experience | ❌ | ✅ | ✅ |
| Submit reviews | ❌ | ✅ | ✅ |
| Toggle review visibility | ❌ | ✅ (own) | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Delete any user/task/review | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |

---

## Non-Functional Requirements

| ID | Requirement | Implementation |
|---|---|---|
| NFR1 | Response time < 3 seconds | MongoDB indexing on `owner`, `username`, `email`; pagination on list endpoints |
| NFR2 | Passwords hashed | bcrypt with 12 salt rounds |
| NFR2 | Session management via JWT | Signed JWT, expiry enforced server-side |
| NFR2 | Protected routes | `authMiddleware` on all private endpoints |
| NFR3 | Handle invalid inputs | `express-validator` on all POST/PUT routes; global error handler returns structured JSON errors |
| NFR3 | Prevent unauthorized access | Ownership checks in controllers (`req.user.id === resource.owner`) |
| NFR4 | Simple & intuitive UI | Responsive Tailwind layout; clear form validation messages; dashboard view |
| NFR5 | Modular code structure | MVC pattern on backend; feature-based component folders on frontend |

---

## Key npm Packages

### Server

```json
"express": "^4.18",
"mongoose": "^8.x",
"bcryptjs": "^2.4",
"jsonwebtoken": "^9.x",
"express-validator": "^7.x",
"multer": "^1.4",
"cors": "^2.8",
"dotenv": "^16.x",
"nodemon": "^3.x"  // devDependency
```

### Client

```json
"react": "^18.x",
"react-router-dom": "^6.x",
"axios": "^1.x",
"tailwindcss": "^3.x",
"react-hook-form": "^7.x",
"react-hot-toast": "^2.x",
"lucide-react": "^0.3x"
```

---

## Frontend Pages & Components Summary

| Page | Route | Auth Required | Description |
|---|---|---|---|
| Landing | `/` | ❌ | Hero + feature overview for guests |
| Register | `/register` | ❌ | Sign-up form |
| Login | `/login` | ❌ | Login form |
| Dashboard | `/dashboard` | ✅ | Task list with filters, create/edit/delete |
| My Profile | `/profile` | ✅ | Edit own profile, add projects, experience |
| Public Profile | `/u/:username` | ❌ | View another user's profile + reviews |
| Admin Panel | `/admin` | ✅ Admin | Manage users, tasks, reviews |

---

## Notes for the Coding Agent

1. **Always verify JWT** before processing any request in protected routes. Use a single reusable `authMiddleware.js`.
2. **Ownership validation** must happen in the controller, not just in middleware — check that the task/project/experience `owner` field matches `req.user.id` before allowing updates or deletes.
3. **Embedded subdocuments** (projects, experience) live inside the User document. Use `user.projects.id(projectId)` (Mongoose DocumentArray method) to find and modify them.
4. **Reviews** are a separate collection (not embedded) because they need to be queried from both the reviewer's and reviewee's perspective.
5. **File uploads** (avatars) should be stored in `/server/uploads/` via Multer and served as static files via `express.static`. In production, swap for an S3/Cloudinary integration.
6. **All list endpoints** must support pagination (`page`, `limit`) to satisfy NFR1.
7. **The `aboutMe` field** supports Markdown — use a React markdown renderer (e.g. `react-markdown`) on the frontend public profile page.
8. **Review visibility toggle** (`isVisible`) is controlled by the **reviewee**, not the reviewer. The reviewer can only edit or delete their own review.
9. **Admin middleware** should check `req.user.role === 'admin'` and sit after `authMiddleware` in the middleware chain.
10. **Error responses** should always follow the structure: `{ success: false, message: "...", errors: [...] }` for consistency across all endpoints.
