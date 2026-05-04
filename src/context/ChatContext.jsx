import { createContext, useState, useEffect, useRef, useCallback, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

const ChatContext = createContext(null);

const SOCKET_URL = "http://localhost:5000";

// ─── localStorage helpers ────────────────────────────────────────────────────
function loadMessages(conversationKey) {
  try {
    const raw = localStorage.getItem(`chat:${conversationKey}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(conversationKey, messages) {
  try {
    localStorage.setItem(`chat:${conversationKey}`, JSON.stringify(messages));
  } catch {
    /* localStorage full — silently fail */
  }
}

function loadUnread() {
  try {
    const raw = localStorage.getItem("chat:unread");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUnread(unread) {
  try {
    localStorage.setItem("chat:unread", JSON.stringify(unread));
  } catch { /* */ }
}

// Build a deterministic DM key from two user IDs
function dmKey(uid1, uid2) {
  return `dm:${[uid1, uid2].sort().join(":")}`;
}

export function ChatProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState({ projects: [], dmUsers: [] });
  const [activeConversation, setActiveConversation] = useState(null); // { type: 'group'|'dm', id, ... }
  const [messages, setMessages] = useState([]); // messages for the active conversation
  const [typingUsers, setTypingUsers] = useState({}); // { conversationKey: [userId, ...] }
  const [unread, setUnread] = useState(loadUnread());

  // A version counter to force re-reads from localStorage
  const [msgVersion, setMsgVersion] = useState(0);

  // ── Derive the active conversation key ─────────────────────────────────────
  const getConversationKey = useCallback(
    (conv) => {
      if (!conv) return null;
      if (conv.type === "group") return `group:${conv.id}`;
      if (conv.type === "dm") return dmKey(user?.id, conv.id);
      return null;
    },
    [user]
  );

  const activeKey = getConversationKey(activeConversation);

  // ── Load messages for the active conversation whenever it changes ─────────
  useEffect(() => {
    if (activeKey) {
      setMessages(loadMessages(activeKey));
      // Clear unread for this conversation
      setUnread((prev) => {
        const next = { ...prev };
        delete next[activeKey];
        saveUnread(next);
        return next;
      });
    } else {
      setMessages([]);
    }
  }, [activeKey, msgVersion]);

  // ── Socket connection lifecycle ────────────────────────────────────────────
  useEffect(() => {
    if (!token || !user || token === "demo-token-skillmesh") return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("authenticate", token);
    });

    socket.on("authenticated", () => {
      console.log("[chat] Authenticated with server");
    });

    socket.on("auth-error", (data) => {
      console.error("[chat] Auth error:", data.message);
    });

    socket.on("online-users", (userIds) => {
      setOnlineUsers(userIds);
    });

    // ── Incoming group message ──────────────────────────────────────────────
    socket.on("group-message", (msg) => {
      const key = `group:${msg.projectId}`;
      const existing = loadMessages(key);
      // Deduplicate
      if (existing.some((m) => m.id === msg.id)) return;
      const updated = [...existing, msg];
      saveMessages(key, updated);
      setMsgVersion((v) => v + 1);

      // If not the active conversation, increment unread
      if (key !== activeKey && msg.senderId !== user?.id) {
        setUnread((prev) => {
          const next = { ...prev, [key]: (prev[key] || 0) + 1 };
          saveUnread(next);
          return next;
        });
      }
    });

    // ── Incoming DM message ─────────────────────────────────────────────────
    socket.on("dm-message", (msg) => {
      const key = dmKey(msg.senderId, msg.recipientId);
      const existing = loadMessages(key);
      if (existing.some((m) => m.id === msg.id)) return;
      const updated = [...existing, msg];
      saveMessages(key, updated);
      setMsgVersion((v) => v + 1);

      if (key !== activeKey && msg.senderId !== user?.id) {
        setUnread((prev) => {
          const next = { ...prev, [key]: (prev[key] || 0) + 1 };
          saveUnread(next);
          return next;
        });
      }
    });

    // ── Typing indicators ───────────────────────────────────────────────────
    socket.on("typing", (data) => {
      const key = data.projectId
        ? `group:${data.projectId}`
        : dmKey(user?.id, data.userId);
      setTypingUsers((prev) => {
        const arr = prev[key] || [];
        if (arr.includes(data.userId)) return prev;
        return { ...prev, [key]: [...arr, data.userId] };
      });
    });

    socket.on("stop-typing", (data) => {
      const key = data.projectId
        ? `group:${data.projectId}`
        : dmKey(user?.id, data.userId);
      setTypingUsers((prev) => {
        const arr = (prev[key] || []).filter((id) => id !== data.userId);
        return { ...prev, [key]: arr };
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, user]);

  // activeKey can change after socket effect — need a ref for callbacks
  const activeKeyRef = useRef(activeKey);
  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  // ── Public API ─────────────────────────────────────────────────────────────

  const sendGroupMessage = useCallback(
    (projectId, text) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit("group-message", {
        projectId,
        text,
        timestamp: new Date().toISOString(),
      });
    },
    [user]
  );

  const sendDM = useCallback(
    (recipientId, text) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit("dm-message", {
        recipientId,
        text,
        timestamp: new Date().toISOString(),
      });
    },
    [user]
  );

  const emitTyping = useCallback(
    (projectId, recipientId) => {
      if (!socketRef.current) return;
      socketRef.current.emit("typing", { projectId, recipientId });
    },
    []
  );

  const emitStopTyping = useCallback(
    (projectId, recipientId) => {
      if (!socketRef.current) return;
      socketRef.current.emit("stop-typing", { projectId, recipientId });
    },
    []
  );

  const isOnline = useCallback(
    (userId) => onlineUsers.includes(userId),
    [onlineUsers]
  );

  const getUnread = useCallback(
    (convKey) => unread[convKey] || 0,
    [unread]
  );

  return (
    <ChatContext.Provider
      value={{
        connected,
        onlineUsers,
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        messages,
        typingUsers,
        sendGroupMessage,
        sendDM,
        emitTyping,
        emitStopTyping,
        isOnline,
        getUnread,
        getConversationKey,
        dmKey,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContext;
