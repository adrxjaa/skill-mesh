import { createContext, useState, useCallback, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import * as feedApi from "../services/feedApi";
import mockPosts, { mockComments } from "../data/mockPosts";

const FeedContext = createContext(null);

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

/* ── Normalise a backend post into the shape the UI cards expect ── */
function normalisePost(p) {
  // Already normalised (mock data or previously normalised)
  if (p.author?.displayName) return p;

  const author = p.author || {};
  const fullName = author.fullName || "Unknown";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    ...p,
    id: p._id || p.id,
    author: {
      id: author._id || author.id || p.author,
      displayName: fullName,
      initials,
      title: author.title || "",
      avatar: author.avatar || "",
    },
    likes: typeof p.likes === "number" ? p.likes : (p.likes?.length ?? 0),
    comments: typeof p.comments === "number" ? p.comments : (p.comments?.length ?? 0),
    label: p.type === "requirement" ? "Looking for Team" : (p.label || "Update"),
    matchTag: p.matchTag || null,
    tags: p.tags || [],
    createdAt: p.createdAt || new Date().toISOString(),
    projectId: p.project?._id || p.project || p.projectId || null,
    projectTitle: p.project?.title || null,
  };
}

export function FeedProvider({ children }) {
  const { user, token } = useAuth();
  const isDemo = token === "demo-token-skillmesh";

  /* ── State ── */
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedPosts, setLikedPosts] = useState([]);
  const [interestedPosts, setInterestedPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);

  /* ── Fetch posts on mount ── */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (isDemo) {
        setPosts(mockPosts);
        setComments(mockComments);
        setLoading(false);
        return;
      }

      try {
        const data = await feedApi.getPosts();
        if (!cancelled) {
          if (user) {
            const userLikedIds = data
              .filter((p) => Array.isArray(p.likes) && p.likes.includes(user.id || user._id))
              .map((p) => p._id || p.id);
            setLikedPosts(userLikedIds);
          }
          setPosts(data.map(normalisePost));
        }
      } catch (err) {
        console.error("Failed to fetch posts, falling back to mock data:", err.message);
        if (!cancelled) {
          setPosts(mockPosts);
          setComments(mockComments);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (token) load();
    else setLoading(false);

    return () => { cancelled = true; };
  }, [token, user, isDemo]);

  /* ── Actions ── */

  /** Create a new post and prepend it to the feed */
  const createPost = useCallback(
    async (postData) => {
      const {
        body,
        type = "community",
        tags = [],
        title = null,
        openToWork = false,
        imageUrl = null,
        linkUrl = null,
        projectId = null,
      } = postData;
      if (!body.trim()) return;

      if (isDemo) {
        // Demo mode: local-only
        const newPost = {
          id: `post-${Date.now()}`,
          type,
          author: { id: "u1", displayName: "Ananya Bhat", initials: "AB", title: "Frontend Developer" },
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
          projectId,
        };
        setPosts((prev) => [newPost, ...prev]);
        return newPost;
      }

      try {
        const created = await feedApi.createPost({
          body: body.trim(),
          type,
          title: type === "requirement" ? title : null,
          tags,
          openToWork: type === "requirement" ? openToWork : false,
          imageUrl: imageUrl || null,
          linkUrl: linkUrl || null,
          projectId: projectId || null,
        });
        const normalised = normalisePost(created);
        setPosts((prev) => [normalised, ...prev]);
        return normalised;
      } catch (err) {
        console.error("Failed to create post:", err.message);
        throw err;
      }
    },
    [isDemo]
  );

  /** Delete a post by ID */
  const deletePost = useCallback(
    async (postId) => {
      // Optimistic removal
      setPosts((prev) => prev.filter((p) => (p.id || p._id) !== postId));
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
      setInterestedPosts((prev) => prev.filter((id) => id !== postId));
      setComments((prev) => {
        const copy = { ...prev };
        delete copy[postId];
        return copy;
      });

      if (!isDemo) {
        try {
          await feedApi.deletePostApi(postId);
        } catch (err) {
          console.error("Failed to delete post:", err.message);
        }
      }
    },
    [isDemo]
  );

  /** Toggle like on a post */
  const toggleLike = useCallback(
    async (postId) => {
      const isCurrentlyLiked = likedPosts.includes(postId);

      setLikedPosts((prev) =>
        isCurrentlyLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
      );

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          (p.id || p._id) === postId
            ? { ...p, likes: isCurrentlyLiked ? Math.max(0, p.likes - 1) : p.likes + 1 }
            : p
        )
      );

      if (!isDemo) {
        try {
          await feedApi.toggleLikeApi(postId);
        } catch (err) {
          console.error("Failed to toggle like:", err.message);
        }
      }
    },
    [likedPosts, isDemo]
  );

  /** Toggle interest on a requirement post */
  const toggleInterest = useCallback(
    async (postId, projectId) => {
      setInterestedPosts((prev) => {
        if (prev.includes(postId)) {
          return prev.filter((id) => id !== postId);
        }
        return [...prev, postId];
      });

      if (!isDemo && projectId) {
        try {
          await feedApi.requestJoinProject(projectId, postId);
        } catch (err) {
          console.error("Failed to express interest:", err.message);
        }
      }
    },
    [isDemo]
  );

  /** Add a comment to a post */
  const addComment = useCallback(
    async (postId, text) => {
      if (!text.trim()) return;

      if (isDemo) {
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
        setPosts((prev) =>
          prev.map((p) =>
            (p.id || p._id) === postId ? { ...p, comments: p.comments + 1 } : p
          )
        );
        return;
      }

      try {
        const saved = await feedApi.addCommentApi(postId, text.trim());
        const author = saved.author || {};
        const fullName = author.fullName || "You";
        const newComment = {
          id: saved._id || `c-${Date.now()}`,
          authorId: author._id || author.id,
          authorName: fullName,
          authorInitials: fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
          text: saved.text,
          createdAt: saved.createdAt || new Date().toISOString(),
        };
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment],
        }));
        setPosts((prev) =>
          prev.map((p) =>
            (p.id || p._id) === postId ? { ...p, comments: p.comments + 1 } : p
          )
        );
      } catch (err) {
        console.error("Failed to add comment:", err.message);
      }
    },
    [isDemo]
  );

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

    if (activeFilter === "community") {
      result = result.filter((p) => p.type === "community");
    } else if (activeFilter === "requirements") {
      result = result.filter((p) => p.type === "requirement");
    }

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
    loading,
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
