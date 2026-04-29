import { createContext, useState, useCallback, useEffect } from "react";
import mockUsers from "../data/mockUsers";

const MatchContext = createContext(null);

/**
 * Pre-populated: these mock users have "already swiped right" on the demo user.
 * This gives the "Liked You" page content from the start.
 */
const INITIAL_RECEIVED_LIKES = ["u2", "u4", "u6"];

/**
 * Simulated bot replies for the chat demo.
 */
const BOT_REPLIES = [
  "Thanks for reaching out! I'd love to collaborate 🚀",
  "Hey! Your profile looks great. What project are you working on?",
  "Awesome, let's set up a time to chat about this!",
  "I've been looking for someone with your skill set!",
  "Sounds interesting! Tell me more about the tech stack you're using.",
  "Great to connect! I'm free this weekend if you want to pair-program.",
];

function getRandomReply() {
  return BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
}

/* ── localStorage helpers ── */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function MatchProvider({ children }) {
  /* ── State ── */
  const [myLikes, setMyLikes] = useState(() => loadJSON("sm_myLikes", []));
  const [myDislikes, setMyDislikes] = useState(() => loadJSON("sm_myDislikes", []));
  const [receivedLikes, setReceivedLikes] = useState(() =>
    loadJSON("sm_receivedLikes", INITIAL_RECEIVED_LIKES)
  );
  const [matches, setMatches] = useState(() => loadJSON("sm_matches", []));
  const [messages, setMessages] = useState(() => loadJSON("sm_messages", {}));

  // Track the latest match for the modal (transient, not persisted)
  const [latestMatch, setLatestMatch] = useState(null);

  /* ── Persist to localStorage on every change ── */
  useEffect(() => saveJSON("sm_myLikes", myLikes), [myLikes]);
  useEffect(() => saveJSON("sm_myDislikes", myDislikes), [myDislikes]);
  useEffect(() => saveJSON("sm_receivedLikes", receivedLikes), [receivedLikes]);
  useEffect(() => saveJSON("sm_matches", matches), [matches]);
  useEffect(() => saveJSON("sm_messages", messages), [messages]);

  /* ── Core swipe function ── */
  const swipe = useCallback(
    (userId, direction) => {
      if (direction === "right") {
        setMyLikes((prev) => {
          if (prev.includes(userId)) return prev;
          return [...prev, userId];
        });

        // Check for match: did this user already swipe right on us?
        if (receivedLikes.includes(userId) && !matches.includes(userId)) {
          setMatches((prev) => [...prev, userId]);
          const matchedUser = mockUsers.find((u) => u.id === userId);
          setLatestMatch(matchedUser || null);
          return { matched: true, user: matchedUser };
        }

        return { matched: false };
      }

      // direction === "left"
      setMyDislikes((prev) => {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      });
      return { matched: false };
    },
    [receivedLikes, matches]
  );

  /* ── Dismiss the match modal ── */
  const clearLatestMatch = useCallback(() => {
    setLatestMatch(null);
  }, []);

  /* ── Unseen likes: people who liked you that you haven't swiped on yet ── */
  const getUnseenLikes = useCallback(() => {
    const swiped = new Set([...myLikes, ...myDislikes]);
    return receivedLikes
      .filter((id) => !swiped.has(id))
      .map((id) => mockUsers.find((u) => u.id === id))
      .filter(Boolean);
  }, [receivedLikes, myLikes, myDislikes]);

  /* ── Get users not yet swiped on (for Discover) ── */
  const getDiscoverUsers = useCallback(() => {
    const swiped = new Set([...myLikes, ...myDislikes]);
    return mockUsers.filter((u) => !swiped.has(u.id));
  }, [myLikes, myDislikes]);

  /* ── Get matched user objects ── */
  const getMatches = useCallback(() => {
    return matches
      .map((id) => mockUsers.find((u) => u.id === id))
      .filter(Boolean);
  }, [matches]);

  /* ── Check if a userId is a match ── */
  const isMatch = useCallback(
    (userId) => matches.includes(userId),
    [matches]
  );

  /* ── Messaging ── */
  const sendMessage = useCallback(
    (userId, text) => {
      if (!text.trim()) return;

      const newMsg = {
        id: Date.now().toString(),
        from: "me",
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const convo = prev[userId] || [];
        return { ...prev, [userId]: [...convo, newMsg] };
      });

      // Simulate a bot reply after 1.5s
      setTimeout(() => {
        const reply = {
          id: (Date.now() + 1).toString(),
          from: userId,
          text: getRandomReply(),
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => {
          const convo = prev[userId] || [];
          return { ...prev, [userId]: [...convo, reply] };
        });
      }, 1500);
    },
    []
  );

  const getMessages = useCallback(
    (userId) => messages[userId] || [],
    [messages]
  );

  /* ── Pending likes count (for navbar badge) ── */
  const pendingLikesCount = getUnseenLikes().length;

  /* ── Reset all data (for testing) ── */
  const resetAll = useCallback(() => {
    setMyLikes([]);
    setMyDislikes([]);
    setReceivedLikes(INITIAL_RECEIVED_LIKES);
    setMatches([]);
    setMessages({});
    setLatestMatch(null);
    localStorage.removeItem("sm_myLikes");
    localStorage.removeItem("sm_myDislikes");
    localStorage.removeItem("sm_receivedLikes");
    localStorage.removeItem("sm_matches");
    localStorage.removeItem("sm_messages");
  }, []);

  const value = {
    myLikes,
    myDislikes,
    receivedLikes,
    matches,
    latestMatch,
    pendingLikesCount,
    swipe,
    clearLatestMatch,
    getUnseenLikes,
    getDiscoverUsers,
    getMatches,
    isMatch,
    sendMessage,
    getMessages,
    resetAll,
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
}

export default MatchContext;
