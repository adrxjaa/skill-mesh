import { createContext, useState, useCallback, useEffect } from "react";
import mockPosts, { mockComments } from "../data/mockPosts";

const FeedContext = createContext(null);

/* ── localStorage helpers (same pattern as MatchContext) ── */
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

/* ── Relative time helper ── */
export function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return past.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function FeedProvider({ children }) {
  /* ── State ── */
  const [posts, setPosts] = useState(() => loadJSON("sm_feed_posts", mockPosts));
  const [activeFilter, setActiveFilter] = useState(() =>
    loadJSON("sm_feed_filter", "all")
  );
  const [likedPosts, setLikedPosts] = useState(() =>
    loadJSON("sm_feed_liked", [])
  );
  const [interestedPosts, setInterestedPosts] = useState(() =>
    loadJSON("sm_feed_interested", [])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [comments, setComments] = useState(() =>
    loadJSON("sm_feed_comments", mockComments)
  );

  /* ── Persist to localStorage ── */
  useEffect(() => saveJSON("sm_feed_posts", posts), [posts]);
  useEffect(() => saveJSON("sm_feed_filter", activeFilter), [activeFilter]);
  useEffect(() => saveJSON("sm_feed_liked", likedPosts), [likedPosts]);
  useEffect(() => saveJSON("sm_feed_interested", interestedPosts), [interestedPosts]);
  useEffect(() => saveJSON("sm_feed_comments", comments), [comments]);

  /* ── Actions ── */

  /** Create a new post and prepend it to the feed */
  const createPost = useCallback((postData) => {
    const {
      body,
      type = "community",
      tags = [],
      title = null,
      openToWork = false,
      imageUrl = null,
      linkUrl = null,
    } = postData;
    if (!body.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      type,
      author: {
        id: "u1",
        displayName: "Ananya Bhat",
        initials: "AB",
        title: "Frontend Developer",
      },
      title: type === "requirement" ? title : null,
      body: body.trim(),
      tags,
      matchTag: null,
      label: type === "requirement" ? "Looking for Team" : "Update",
      openToWork: type === "requirement" ? openToWork : false,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  /** Delete a post by ID */
  const deletePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    // Clean up related data
    setLikedPosts((prev) => prev.filter((id) => id !== postId));
    setInterestedPosts((prev) => prev.filter((id) => id !== postId));
    setComments((prev) => {
      const copy = { ...prev };
      delete copy[postId];
      return copy;
    });
  }, []);

  /** Toggle like on a post — updates count and tracks liked state */
  const toggleLike = useCallback((postId) => {
    setLikedPosts((prev) => {
      const isLiked = prev.includes(postId);
      setPosts((posts) =>
        posts.map((p) =>
          p.id === postId
            ? { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );
      return isLiked ? prev.filter((id) => id !== postId) : [...prev, postId];
    });
  }, []);

  /** Toggle interest on a requirement post (bidirectional — on/off) */
  const toggleInterest = useCallback((postId) => {
    setInterestedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      }
      return [...prev, postId];
    });
  }, []);

  /** Add a comment to a post */
  const addComment = useCallback((postId, text) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: "u1",
      authorName: "Ananya Bhat",
      authorInitials: "AB",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    // Increment the comment count on the post
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );
  }, []);

  /** Get comments for a post */
  const getComments = useCallback(
    (postId) => comments[postId] || [],
    [comments]
  );

  /** Set the active filter tab */
  const setFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  /** Get posts filtered by the active tab AND search query */
  const getFilteredPosts = useCallback(() => {
    let result = posts;

    // Filter by type tab
    if (activeFilter === "community") {
      result = result.filter((p) => p.type === "community");
    } else if (activeFilter === "requirements") {
      result = result.filter((p) => p.type === "requirement");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.body && p.body.toLowerCase().includes(q)) ||
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          (p.author.displayName && p.author.displayName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, activeFilter, searchQuery]);

  /** Check if a post is liked by the current user */
  const isLiked = useCallback(
    (postId) => likedPosts.includes(postId),
    [likedPosts]
  );

  /** Check if the user has expressed interest in a post */
  const hasInterest = useCallback(
    (postId) => interestedPosts.includes(postId),
    [interestedPosts]
  );

  const value = {
    posts,
    activeFilter,
    likedPosts,
    interestedPosts,
    searchQuery,
    comments,
    createPost,
    deletePost,
    toggleLike,
    toggleInterest,
    addComment,
    getComments,
    setSearchQuery,
    setFilter,
    getFilteredPosts,
    isLiked,
    hasInterest,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export default FeedContext;
