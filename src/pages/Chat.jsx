import { useState, useEffect, useContext, useRef } from "react";
import {
  Search,
  Send,
  Users,
  MessageSquare,
  Hash,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import AuthContext from "../context/AuthContext";
import ChatContext from "../context/ChatContext";
import api from "../services/api";

function Chat() {
  const { user } = useContext(AuthContext);
  const {
    connected,
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
  } = useContext(ChatContext);

  const [messageInput, setMessageInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Load conversations on mount ───────────────────────────────────────────
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoadingConversations(false);
      }
    };
    if (user && user.id !== "demo-user-001") {
      fetchConversations();
    } else {
      setLoadingConversations(false);
    }
  }, [user, setConversations]);

  // ── Auto-scroll to bottom on new messages ─────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const activeKey = getConversationKey(activeConversation);

  const currentTypingUsers = activeKey
    ? (typingUsers[activeKey] || []).filter((id) => id !== user?.id)
    : [];

  // Find user info by ID from conversations
  const findUser = (userId) => {
    for (const p of conversations.projects || []) {
      for (const m of p.members || []) {
        if ((m._id || m) === userId) return m;
      }
    }
    for (const u of conversations.dmUsers || []) {
      if (u._id === userId) return u;
    }
    return null;
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  const getAvatar = (userObj) => {
    if (!userObj) return null;
    if (userObj.avatar) {
      return userObj.avatar.startsWith("/uploads")
        ? `http://localhost:5000${userObj.avatar}`
        : userObj.avatar;
    }
    return null;
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getLastMessage = (convKey) => {
    try {
      const raw = localStorage.getItem(`chat:${convKey}`);
      if (!raw) return null;
      const msgs = JSON.parse(raw);
      return msgs.length > 0 ? msgs[msgs.length - 1] : null;
    } catch {
      return null;
    }
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = () => {
    const text = messageInput.trim();
    if (!text || !activeConversation) return;

    if (activeConversation.type === "group") {
      sendGroupMessage(activeConversation.id, text);
    } else {
      sendDM(activeConversation.id, text);
    }
    setMessageInput("");

    // Stop typing indicator
    if (activeConversation.type === "group") {
      emitStopTyping(activeConversation.id, null);
    } else {
      emitStopTyping(null, activeConversation.id);
    }
  };

  // ── Typing handler ────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!activeConversation) return;

    // Emit typing
    if (activeConversation.type === "group") {
      emitTyping(activeConversation.id, null);
    } else {
      emitTyping(null, activeConversation.id);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (activeConversation.type === "group") {
        emitStopTyping(activeConversation.id, null);
      } else {
        emitStopTyping(null, activeConversation.id);
      }
    }, 2000);
  };

  // ── Filter conversations ──────────────────────────────────────────────────
  const filteredProjects = (conversations.projects || []).filter((p) =>
    p.title.toLowerCase().includes(searchFilter.toLowerCase())
  );
  const filteredDMs = (conversations.dmUsers || []).filter((u) =>
    u.fullName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // ── Get the active project object ─────────────────────────────────────────
  const activeProject =
    activeConversation?.type === "group"
      ? (conversations.projects || []).find(
          (p) => p._id === activeConversation.id
        )
      : null;

  const activeDMUser =
    activeConversation?.type === "dm"
      ? (conversations.dmUsers || []).find(
          (u) => u._id === activeConversation.id
        )
      : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex w-full text-on-surface h-full overflow-hidden">
      {/* ── Left Panel: Conversation List ─────────────────────────────────── */}
      <div className="w-80 xl:w-96 border-r border-surface-container-high bg-surface flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface font-heading">
              Messages
            </h2>
            <div className="flex items-center gap-2">
              {connected ? (
                <span className="flex items-center gap-1.5 text-xs text-status-success">
                  <Circle size={8} fill="currentColor" />
                  Live
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Circle size={8} />
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={16}
            />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 pl-10 text-sm text-on-surface placeholder-text-secondary outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Project Groups ──────────────────────────────────────── */}
              {filteredProjects.length > 0 && (
                <div className="mb-4">
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                    Project Groups
                  </p>
                  <div className="space-y-0.5">
                    {filteredProjects.map((project) => {
                      const key = `group:${project._id}`;
                      const isActive =
                        activeConversation?.type === "group" &&
                        activeConversation?.id === project._id;
                      const unreadCount = getUnread(key);
                      const lastMsg = getLastMessage(key);

                      return (
                        <button
                          key={project._id}
                          onClick={() =>
                            setActiveConversation({
                              type: "group",
                              id: project._id,
                            })
                          }
                          className={`w-full p-3 rounded-xl text-left transition-colors ${
                            isActive
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-surface-container/50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <Hash
                                size={18}
                                className="text-primary"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3
                                  className={`text-sm truncate font-semibold ${
                                    isActive
                                      ? "text-primary"
                                      : "text-on-surface"
                                  }`}
                                >
                                  {project.title}
                                </h3>
                                {lastMsg && (
                                  <span className="text-[10px] text-text-secondary ml-2 flex-shrink-0">
                                    {formatTime(lastMsg.timestamp)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-text-secondary truncate">
                                  {lastMsg
                                    ? lastMsg.text
                                    : `${project.members?.length || 0} members`}
                                </p>
                                {unreadCount > 0 && (
                                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold ml-2">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Direct Messages ─────────────────────────────────────── */}
              {filteredDMs.length > 0 && (
                <div>
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                    Direct Messages
                  </p>
                  <div className="space-y-0.5">
                    {filteredDMs.map((dmUser) => {
                      const key = dmKey(user?.id, dmUser._id);
                      const isActive =
                        activeConversation?.type === "dm" &&
                        activeConversation?.id === dmUser._id;
                      const unreadCount = getUnread(key);
                      const lastMsg = getLastMessage(key);
                      const online = isOnline(dmUser._id);

                      return (
                        <button
                          key={dmUser._id}
                          onClick={() =>
                            setActiveConversation({
                              type: "dm",
                              id: dmUser._id,
                            })
                          }
                          className={`w-full p-3 rounded-xl text-left transition-colors ${
                            isActive
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-surface-container/50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                              {getAvatar(dmUser) ? (
                                <img
                                  src={getAvatar(dmUser)}
                                  alt={dmUser.fullName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-text-secondary">
                                  {getInitials(dmUser.fullName)}
                                </div>
                              )}
                              {online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-surface" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3
                                  className={`text-sm truncate font-semibold ${
                                    isActive
                                      ? "text-primary"
                                      : "text-on-surface"
                                  }`}
                                >
                                  {dmUser.fullName}
                                </h3>
                                {lastMsg && (
                                  <span className="text-[10px] text-text-secondary ml-2 flex-shrink-0">
                                    {formatTime(lastMsg.timestamp)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-text-secondary truncate">
                                  {lastMsg
                                    ? lastMsg.text
                                    : dmUser.title || "Teammate"}
                                </p>
                                {unreadCount > 0 && (
                                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold ml-2">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {filteredProjects.length === 0 &&
                filteredDMs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <MessageSquare
                      size={40}
                      className="text-text-secondary/30 mb-3"
                    />
                    <p className="text-sm text-text-secondary">
                      {searchFilter
                        ? "No conversations match your search."
                        : "No conversations yet. Join a project to start chatting!"}
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* ── Right Panel: Chat Area ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-surface-container-lowest relative min-w-0">
        {activeConversation ? (
          <>
            {/* ── Chat Header ──────────────────────────────────────────── */}
            <div className="bg-surface/90 backdrop-blur border-b border-surface-container-high px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {activeProject ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Hash size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-on-surface text-sm truncate">
                        {activeProject.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {activeProject.members?.length || 0} members
                      </p>
                    </div>
                  </>
                ) : activeDMUser ? (
                  <>
                    <div className="relative flex-shrink-0">
                      {getAvatar(activeDMUser) ? (
                        <img
                          src={getAvatar(activeDMUser)}
                          alt={activeDMUser.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-text-secondary">
                          {getInitials(activeDMUser.fullName)}
                        </div>
                      )}
                      {isOnline(activeDMUser._id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-surface" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-on-surface text-sm truncate">
                        {activeDMUser.fullName}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {isOnline(activeDMUser._id) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>

              {/* Toggle project info */}
              {activeProject && (
                <button
                  onClick={() => setShowProjectInfo((v) => !v)}
                  className="text-text-secondary hover:text-on-surface transition-colors p-2"
                >
                  {showProjectInfo ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              )}
            </div>

            {/* ── Project Info Panel ───────────────────────────────────── */}
            {activeProject && showProjectInfo && (
              <div className="border-b border-surface-container-high bg-surface-container-low/50 px-6 py-5 flex-shrink-0">
                {/* Project Name Hero */}
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-primary font-heading">
                    {activeProject.title}{" "}
                    <span className="text-on-surface">here</span>
                  </h2>
                </div>

                {/* Description */}
                {activeProject.description && (
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {activeProject.description}
                  </p>
                )}

                {/* Google Docs Link */}
                {activeProject.docsLink && (
                  <a
                    href={activeProject.docsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-surface-container border border-surface-container-high rounded-lg px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors mb-4"
                  >
                    <FileText size={16} />
                    <span className="font-medium">Project Document (DDS)</span>
                    <ExternalLink size={14} className="text-text-secondary" />
                  </a>
                )}

                {/* Members List */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-3">
                    <Users size={12} className="inline mr-1.5" />
                    Team Members
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(activeProject.members || []).map((member) => {
                      const mid = member._id || member;
                      const name = member.fullName || "Unknown";
                      const online = isOnline(mid);
                      const isMe = mid === user?.id;

                      return (
                        <div
                          key={mid}
                          className="flex items-center gap-2 bg-surface-container border border-surface-container-high rounded-full px-3 py-1.5"
                        >
                          <div className="relative">
                            {getAvatar(member) ? (
                              <img
                                src={getAvatar(member)}
                                alt={name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-text-secondary">
                                {getInitials(name)}
                              </div>
                            )}
                            {online && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-status-success rounded-full border-[1.5px] border-surface-container" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-on-surface">
                            {isMe ? "You" : name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Messages ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare
                    size={40}
                    className="text-text-secondary/20 mb-3"
                  />
                  <p className="text-sm text-text-secondary">
                    No messages yet. Say hello! 👋
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  const sender = findUser(msg.senderId);
                  const senderName = sender?.fullName || "Unknown";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-end ${
                        isMine ? "justify-end" : ""
                      }`}
                    >
                      {/* Avatar for received */}
                      {!isMine && (
                        <div className="flex-shrink-0">
                          {getAvatar(sender) ? (
                            <img
                              src={getAvatar(sender)}
                              alt={senderName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-text-secondary">
                              {getInitials(senderName)}
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-md ${isMine ? "text-right" : ""}`}
                      >
                        {/* Sender name for group chats */}
                        {!isMine &&
                          activeConversation?.type === "group" && (
                            <p className="text-[11px] font-semibold text-primary mb-1 ml-1">
                              {senderName}
                            </p>
                          )}
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isMine
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-surface-container-low border border-surface-container-high rounded-bl-sm"
                          }`}
                        >
                          <p
                            className={`text-sm leading-relaxed ${
                              isMine
                                ? "font-medium"
                                : "text-on-surface"
                            }`}
                          >
                            {msg.text}
                          </p>
                        </div>
                        <span className="text-[10px] font-medium text-text-secondary/70 mt-1 inline-block mx-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {currentTypingUsers.length > 0 && (
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-text-secondary">
                    {getInitials(
                      findUser(currentTypingUsers[0])?.fullName
                    )}
                  </div>
                  <div className="bg-surface-container-low border border-surface-container-high rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    <div
                      className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ──────────────────────────────────────────── */}
            <div className="bg-surface border-t border-surface-container-high p-4 px-6 flex items-end gap-3 flex-shrink-0">
              <div className="flex-1 bg-surface-container-low border border-surface-container-high rounded-2xl flex items-end">
                <textarea
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-on-surface placeholder-text-secondary/70 outline-none text-sm px-4 py-3.5 resize-none max-h-32 min-h-[48px]"
                  rows={1}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="bg-primary text-white p-3.5 rounded-full hover:bg-primary-hover transition-colors flex-shrink-0 shadow-lg shadow-primary/20 mb-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send
                  size={18}
                  className="translate-x-[-1px] translate-y-[1px]"
                />
              </button>
            </div>
          </>
        ) : (
          /* ── No conversation selected ────────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-5">
              <MessageSquare size={32} className="text-text-secondary/30" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">
              Your Messages
            </h3>
            <p className="text-sm text-text-secondary max-w-xs">
              Select a project group or teammate from the sidebar to start
              chatting.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;
