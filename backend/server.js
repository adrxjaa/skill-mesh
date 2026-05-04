const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const Project = require('./models/Project');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ─── Socket.io ────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

function setUserOnline(userId, socketId) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
}

function setUserOffline(userId, socketId) {
  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) onlineUsers.delete(userId);
  }
}

function isUserOnline(userId) {
  return onlineUsers.has(userId) && onlineUsers.get(userId).size > 0;
}

function getOnlineUserIds() {
  return Array.from(onlineUsers.keys());
}

// Helper: build a deterministic DM room name from two user IDs
function dmRoom(uid1, uid2) {
  return `dm:${[uid1, uid2].sort().join(':')}`;
}

io.on('connection', (socket) => {
  console.log(`[ws] New connection: ${socket.id}`);

  // ── Authenticate ──────────────────────────────────────────────────────────
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.user.id;
      socket.userId = userId;

      setUserOnline(userId, socket.id);

      // Join rooms for all projects the user belongs to
      const projects = await Project.find({
        members: userId,
        status: { $ne: 'archived' },
      });

      for (const proj of projects) {
        socket.join(`project:${proj._id}`);
      }

      // Join DM rooms for each teammate
      const teammateIds = new Set();
      for (const proj of projects) {
        for (const memberId of proj.members) {
          const mid = memberId.toString();
          if (mid !== userId) teammateIds.add(mid);
        }
      }
      for (const tid of teammateIds) {
        socket.join(dmRoom(userId, tid));
      }

      // Broadcast updated online list to everyone
      io.emit('online-users', getOnlineUserIds());

      socket.emit('authenticated', { userId });
      console.log(`[ws] User ${userId} authenticated, joined ${projects.length} project rooms`);
    } catch (err) {
      console.error('[ws] Authentication failed:', err.message);
      socket.emit('auth-error', { message: 'Invalid token' });
    }
  });

  // ── Group message (project chat) ──────────────────────────────────────────
  socket.on('group-message', (data) => {
    if (!socket.userId) return;
    const { projectId, text, timestamp } = data;
    const msg = {
      id: `${socket.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      senderId: socket.userId,
      text,
      timestamp: timestamp || new Date().toISOString(),
      type: 'group',
    };
    // Broadcast to all members in the project room (including sender for confirmation)
    io.to(`project:${projectId}`).emit('group-message', msg);
  });

  // ── DM message ────────────────────────────────────────────────────────────
  socket.on('dm-message', (data) => {
    if (!socket.userId) return;
    const { recipientId, text, timestamp } = data;
    const room = dmRoom(socket.userId, recipientId);
    const msg = {
      id: `${socket.userId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      senderId: socket.userId,
      recipientId,
      text,
      timestamp: timestamp || new Date().toISOString(),
      type: 'dm',
    };
    io.to(room).emit('dm-message', msg);
  });

  // ── Typing indicators ────────────────────────────────────────────────────
  socket.on('typing', (data) => {
    if (!socket.userId) return;
    const { projectId, recipientId } = data;
    if (projectId) {
      socket.to(`project:${projectId}`).emit('typing', {
        userId: socket.userId,
        projectId,
      });
    } else if (recipientId) {
      socket.to(dmRoom(socket.userId, recipientId)).emit('typing', {
        userId: socket.userId,
        recipientId,
      });
    }
  });

  socket.on('stop-typing', (data) => {
    if (!socket.userId) return;
    const { projectId, recipientId } = data;
    if (projectId) {
      socket.to(`project:${projectId}`).emit('stop-typing', {
        userId: socket.userId,
        projectId,
      });
    } else if (recipientId) {
      socket.to(dmRoom(socket.userId, recipientId)).emit('stop-typing', {
        userId: socket.userId,
        recipientId,
      });
    }
  });

  // ── Disconnect ────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    if (socket.userId) {
      setUserOffline(socket.userId, socket.id);
      io.emit('online-users', getOnlineUserIds());
      console.log(`[ws] User ${socket.userId} disconnected`);
    }
  });
});

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillmesh';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// ─── Express middleware ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/discover', require('./routes/discover').router);


app.get('/', (req, res) => {
  res.json({ message: 'Skill Mesh API Server' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
