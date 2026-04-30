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

/**
 * Pre-populated collaborations — simulates completed projects for demo.
 * u2 (Rahul Menon) already has a completed collaboration with us.
 */
const INITIAL_COLLABORATIONS = [
  {
    id: "collab-1",
    userId: "u2",
    projectName: "Student Skill Exchange App",
    startedAt: "2025-09-01T00:00:00Z",
    completedAt: "2025-11-10T00:00:00Z",
    status: "completed",       // "active" | "completed" | "pending-completion"
    confirmedBy: ["me", "u2"], // both confirmed completion
  },
];

/**
 * Pre-populated: a pending incoming review from u2 for demo purposes.
 */
const INITIAL_INCOMING_REVIEWS = [
  {
    id: "rev-incoming-1",
    reviewerId: "u2",
    reviewerName: "Rahul Menon",
    reviewerInitials: "RM",
    collaborationId: "collab-1",
    projectName: "Student Skill Exchange App",
    rating: 5,
    text: "An incredible frontend partner. Ananya turned my API specs into a polished, intuitive UI faster than I thought possible. Her attention to micro-interactions elevated the whole product.",
    date: "2025-11-15T00:00:00Z",
    status: "pending", // "pending" | "approved" | "flagged" | "disputed"
    response: null,    // user's rebuttal if disputed
  },
];

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
  /* ── Core State ── */
  const [myLikes, setMyLikes] = useState(() => loadJSON("sm_myLikes", []));
  const [myDislikes, setMyDislikes] = useState(() => loadJSON("sm_myDislikes", []));
  const [receivedLikes, setReceivedLikes] = useState(() =>
    loadJSON("sm_receivedLikes", INITIAL_RECEIVED_LIKES)
  );
  const [matches, setMatches] = useState(() => loadJSON("sm_matches", []));
  const [messages, setMessages] = useState(() => loadJSON("sm_messages", {}));
  const [latestMatch, setLatestMatch] = useState(null);

  /* ── Collaboration State ── */
  const [collaborations, setCollaborations] = useState(() =>
    loadJSON("sm_collaborations", INITIAL_COLLABORATIONS)
  );

  /* ── Review State ── */
  // Reviews written BY the demo user about others
  const [writtenReviews, setWrittenReviews] = useState(() =>
    loadJSON("sm_writtenReviews", [])
  );
  // Reviews written BY others about the demo user (moderation queue)
  const [incomingReviews, setIncomingReviews] = useState(() =>
    loadJSON("sm_incomingReviews", INITIAL_INCOMING_REVIEWS)
  );

  /* ── Persist to localStorage on every change ── */
  useEffect(() => saveJSON("sm_myLikes", myLikes), [myLikes]);
  useEffect(() => saveJSON("sm_myDislikes", myDislikes), [myDislikes]);
  useEffect(() => saveJSON("sm_receivedLikes", receivedLikes), [receivedLikes]);
  useEffect(() => saveJSON("sm_matches", matches), [matches]);
  useEffect(() => saveJSON("sm_messages", messages), [messages]);
  useEffect(() => saveJSON("sm_collaborations", collaborations), [collaborations]);
  useEffect(() => saveJSON("sm_writtenReviews", writtenReviews), [writtenReviews]);
  useEffect(() => saveJSON("sm_incomingReviews", incomingReviews), [incomingReviews]);

  /* ═══════════════════════════════════════════════════
     SWIPE & MATCH FUNCTIONS (unchanged logic)
     ═══════════════════════════════════════════════════ */

  const swipe = useCallback(
    (userId, direction) => {
      if (direction === "right") {
        setMyLikes((prev) => {
          if (prev.includes(userId)) return prev;
          return [...prev, userId];
        });
        if (receivedLikes.includes(userId) && !matches.includes(userId)) {
          setMatches((prev) => [...prev, userId]);
          const matchedUser = mockUsers.find((u) => u.id === userId);
          setLatestMatch(matchedUser || null);
          return { matched: true, user: matchedUser };
        }
        return { matched: false };
      }
      setMyDislikes((prev) => {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      });
      return { matched: false };
    },
    [receivedLikes, matches]
  );

  const clearLatestMatch = useCallback(() => setLatestMatch(null), []);

  const DEMO_USER_ID = "u1";

  const getUnseenLikes = useCallback(() => {
    const swiped = new Set([...myLikes, ...myDislikes]);
    return receivedLikes
      .filter((id) => !swiped.has(id) && id !== DEMO_USER_ID)
      .map((id) => mockUsers.find((u) => u.id === id))
      .filter(Boolean);
  }, [receivedLikes, myLikes, myDislikes]);

  const getDiscoverUsers = useCallback(() => {
    const swiped = new Set([...myLikes, ...myDislikes]);
    return mockUsers.filter((u) => u.id !== DEMO_USER_ID && !swiped.has(u.id));
  }, [myLikes, myDislikes]);

  const getMatches = useCallback(() => {
    return matches.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean);
  }, [matches]);

  const isMatch = useCallback((userId) => matches.includes(userId), [matches]);

  /* ═══════════════════════════════════════════════════
     MESSAGING FUNCTIONS (unchanged logic)
     ═══════════════════════════════════════════════════ */

  const sendMessage = useCallback((userId, text) => {
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
  }, []);

  const getMessages = useCallback(
    (userId) => messages[userId] || [],
    [messages]
  );

  /* ═══════════════════════════════════════════════════
     COLLABORATION FUNCTIONS
     ═══════════════════════════════════════════════════ */

  /** Start a new collaboration with a matched user */
  const startCollaboration = useCallback((userId, projectName) => {
    const newCollab = {
      id: `collab-${Date.now()}`,
      userId,
      projectName,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: "active",
      confirmedBy: [],
    };
    setCollaborations((prev) => [...prev, newCollab]);
    return newCollab;
  }, []);

  /** Request completion — needs both parties to confirm */
  const requestCompletion = useCallback((collabId) => {
    setCollaborations((prev) =>
      prev.map((c) => {
        if (c.id !== collabId) return c;
        const confirmed = c.confirmedBy.includes("me")
          ? c.confirmedBy
          : [...c.confirmedBy, "me"];
        // If both confirmed, mark completed
        if (confirmed.length >= 2) {
          return { ...c, confirmedBy: confirmed, status: "completed", completedAt: new Date().toISOString() };
        }
        return { ...c, confirmedBy: confirmed, status: "pending-completion" };
      })
    );

    // Simulate the other party (bot) confirming completion after 2s
    setTimeout(() => {
      setCollaborations((prev) =>
        prev.map((c) => {
          if (c.id !== collabId || c.status !== "pending-completion") return c;
          const confirmed = c.confirmedBy.includes(c.userId)
            ? c.confirmedBy
            : [...c.confirmedBy, c.userId];
          if (confirmed.length >= 2) {
            return { ...c, confirmedBy: confirmed, status: "completed", completedAt: new Date().toISOString() };
          }
          return c;
        })
      );
    }, 2000);
  }, []);

  /** Get collaboration for a specific user */
  const getCollaboration = useCallback(
    (userId) => collaborations.find((c) => c.userId === userId),
    [collaborations]
  );

  /** Get all collaborations */
  const getCollaborations = useCallback(() => collaborations, [collaborations]);

  /** Check if user can be reviewed (has a completed collaboration with no existing review) */
  const canReview = useCallback(
    (userId) => {
      const collab = collaborations.find((c) => c.userId === userId && c.status === "completed");
      if (!collab) return false;
      // Check if a review was already written for this collaboration
      const alreadyReviewed = writtenReviews.some((r) => r.collaborationId === collab.id);
      return !alreadyReviewed;
    },
    [collaborations, writtenReviews]
  );

  /* ═══════════════════════════════════════════════════
     REVIEW FUNCTIONS
     ═══════════════════════════════════════════════════ */

  /** Write a review about a matched user (requires completed collaboration) */
  const writeReview = useCallback(
    (userId, { rating, text }) => {
      const collab = collaborations.find((c) => c.userId === userId && c.status === "completed");
      if (!collab) return { error: "No completed collaboration found" };
      if (writtenReviews.some((r) => r.collaborationId === collab.id)) {
        return { error: "You already reviewed this collaboration" };
      }
      if (text.trim().length < 20) {
        return { error: "Review must be at least 20 characters" };
      }

      const review = {
        id: `rev-${Date.now()}`,
        userId,
        collaborationId: collab.id,
        projectName: collab.projectName,
        rating,
        text: text.trim(),
        date: new Date().toISOString(),
      };
      setWrittenReviews((prev) => [...prev, review]);

      // Simulate: the other user will "auto-approve" after a delay (for demo)
      // In production this would go to their moderation queue
      return { success: true, review };
    },
    [collaborations, writtenReviews]
  );

  /** Get reviews written by the demo user */
  const getWrittenReviews = useCallback(() => writtenReviews, [writtenReviews]);

  /** Get pending incoming reviews (moderation queue) */
  const getPendingReviews = useCallback(
    () => incomingReviews.filter((r) => r.status === "pending"),
    [incomingReviews]
  );

  /** Get all incoming reviews */
  const getIncomingReviews = useCallback(() => incomingReviews, [incomingReviews]);

  /** Approve an incoming review */
  const approveReview = useCallback((reviewId) => {
    setIncomingReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: "approved" } : r))
    );
  }, []);

  /** Flag an incoming review as malicious/inaccurate */
  const flagReview = useCallback((reviewId) => {
    setIncomingReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: "flagged" } : r))
    );
  }, []);

  /** Dispute an incoming review with a response */
  const disputeReview = useCallback((reviewId, responseText) => {
    setIncomingReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: "disputed", response: responseText.trim() } : r
      )
    );
  }, []);

  /** Count of pending reviews needing moderation */
  const pendingReviewCount = incomingReviews.filter((r) => r.status === "pending").length;

  /* ═══════════════════════════════════════════════════
     UTILITY FUNCTIONS
     ═══════════════════════════════════════════════════ */

  const pendingLikesCount = getUnseenLikes().length;

  const resetAll = useCallback(() => {
    setMyLikes([]);
    setMyDislikes([]);
    setReceivedLikes(INITIAL_RECEIVED_LIKES);
    setMatches([]);
    setMessages({});
    setLatestMatch(null);
    setCollaborations(INITIAL_COLLABORATIONS);
    setWrittenReviews([]);
    setIncomingReviews(INITIAL_INCOMING_REVIEWS);
    localStorage.removeItem("sm_myLikes");
    localStorage.removeItem("sm_myDislikes");
    localStorage.removeItem("sm_receivedLikes");
    localStorage.removeItem("sm_matches");
    localStorage.removeItem("sm_messages");
    localStorage.removeItem("sm_collaborations");
    localStorage.removeItem("sm_writtenReviews");
    localStorage.removeItem("sm_incomingReviews");
  }, []);

  const value = {
    // Swipe & Match
    myLikes, myDislikes, receivedLikes, matches, latestMatch, pendingLikesCount,
    swipe, clearLatestMatch, getUnseenLikes, getDiscoverUsers, getMatches, isMatch,
    // Messaging
    sendMessage, getMessages,
    // Collaborations
    collaborations, startCollaboration, requestCompletion, getCollaboration, getCollaborations, canReview,
    // Reviews
    writtenReviews, incomingReviews, pendingReviewCount,
    writeReview, getWrittenReviews, getPendingReviews, getIncomingReviews,
    approveReview, flagReview, disputeReview,
    // Utility
    resetAll,
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
}

export default MatchContext;
