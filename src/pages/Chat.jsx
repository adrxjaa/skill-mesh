import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Send, Users, MessageSquare, Hash, FileText, ExternalLink, ChevronDown, ChevronUp, Circle, Image, X } from "lucide-react";
import AuthContext from "../context/AuthContext";
import ChatContext from "../context/ChatContext";
import ProjectContext from "../context/ProjectContext";
import api from "../services/api";
import { uploadFile } from "../services/profileApi";

function Chat() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { projects } = useContext(ProjectContext);
  const {
    connected, conversations, setConversations,
    activeConversation, setActiveConversation,
    messages, typingUsers, sendGroupMessage, sendDM,
    emitTyping, emitStopTyping, isOnline, getUnread, getConversationKey, dmKey,
  } = useContext(ChatContext);

  const [messageInput, setMessageInput] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showProjectInfo, setShowProjectInfo] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pendingImage, setPendingImage] = useState(null); // { url, file }
  const [continueBanner, setContinueBanner] = useState(null); // projectId
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");
        setConversations(res.data);
      } catch { } finally { setLoadingConversations(false); }
    };
    if (user && user.id !== "demo-user-001") fetchConversations();
    else setLoadingConversations(false);
  }, [user, setConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show "continue chatting?" banner when active project is ended
  useEffect(() => {
    if (activeConversation?.type === "group") {
      const proj = projects.find((p) => p._id === activeConversation.id);
      if (proj?.status === "completed" && continueBanner !== "dismissed") {
        setContinueBanner(activeConversation.id);
      }
    } else {
      setContinueBanner(null);
    }
  }, [activeConversation, projects]);

  const activeKey = getConversationKey(activeConversation);
  const currentTypingUsers = activeKey ? (typingUsers[activeKey] || []).filter((id) => id !== user?.id) : [];

  const findUser = (userId) => {
    for (const p of conversations.projects || []) for (const m of p.members || []) if ((m._id || m) === userId) return m;
    for (const u of conversations.dmUsers || []) if (u._id === userId) return u;
    return null;
  };

  const getInitials = (name) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  const getAvatar = (userObj) => {
    if (!userObj?.avatar) return null;
    return userObj.avatar.startsWith("/uploads") ? `http://localhost:5000${userObj.avatar}` : userObj.avatar;
  };
  const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const getLastMessage = (convKey) => {
    try { const msgs = JSON.parse(localStorage.getItem(`chat:${convKey}`) || "[]"); return msgs.at(-1) || null; } catch { return null; }
  };

  const handleSend = async () => {
    if ((!messageInput.trim() && !pendingImage) || !activeConversation) return;
    let text = messageInput.trim();

    if (pendingImage) {
      try {
        setUploadingImage(true);
        const url = await uploadFile(pendingImage.file);
        text = text ? `${text}\n[img:${url}]` : `[img:${url}]`;
      } catch { text = text || "(image failed)"; }
      finally { setUploadingImage(false); setPendingImage(null); }
    }

    if (activeConversation.type === "group") sendGroupMessage(activeConversation.id, text);
    else sendDM(activeConversation.id, text);
    setMessageInput("");
    if (activeConversation.type === "group") emitStopTyping(activeConversation.id, null);
    else emitStopTyping(null, activeConversation.id);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImage({ file, preview: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    if (!activeConversation) return;
    if (activeConversation.type === "group") emitTyping(activeConversation.id, null);
    else emitTyping(null, activeConversation.id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (activeConversation.type === "group") emitStopTyping(activeConversation.id, null);
      else emitStopTyping(null, activeConversation.id);
    }, 2000);
  };

  const filteredProjects = (conversations.projects || []).filter((p) => p.title.toLowerCase().includes(searchFilter.toLowerCase()));
  const filteredDMs = (conversations.dmUsers || []).filter((u) => u.fullName.toLowerCase().includes(searchFilter.toLowerCase()));
  const activeProject = activeConversation?.type === "group" ? (conversations.projects || []).find((p) => p._id === activeConversation.id) : null;
  const activeDMUser = activeConversation?.type === "dm" ? (conversations.dmUsers || []).find((u) => u._id === activeConversation.id) : null;

  // Render message text — handle [img:url] embeds
  const renderMessageText = (text) => {
    const parts = text.split(/(\[img:[^\]]+\])/g);
    return parts.map((part, i) => {
      const imgMatch = part.match(/^\[img:(.+)\]$/);
      if (imgMatch) {
        const src = imgMatch[1].startsWith("/uploads") ? `http://localhost:5000${imgMatch[1]}` : imgMatch[1];
        return <img key={i} src={src} alt="shared" className="max-w-[240px] max-h-[240px] rounded-xl mt-1 object-contain border border-white/10" />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex w-full text-on-surface h-full overflow-hidden">
      {/* Left Panel */}
      <div className="w-80 xl:w-96 border-r border-surface-container-high bg-surface flex flex-col flex-shrink-0">
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-on-surface font-heading">Messages</h2>
            <span className={`flex items-center gap-1.5 text-xs ${connected ? "text-status-success" : "text-text-secondary"}`}>
              <Circle size={8} fill={connected ? "currentColor" : "none"} />
              {connected ? "Live" : "Offline"}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Search conversations..."
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 pl-10 text-sm text-on-surface placeholder-text-secondary outline-none focus:border-primary transition" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-12"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <>
              {filteredProjects.length > 0 && (
                <div className="mb-4">
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary">Project Groups</p>
                  <div className="space-y-0.5">
                    {filteredProjects.map((project) => {
                      const key = `group:${project._id}`;
                      const isActive = activeConversation?.type === "group" && activeConversation?.id === project._id;
                      const unreadCount = getUnread(key);
                      const lastMsg = getLastMessage(key);
                      return (
                        <button key={project._id} onClick={() => setActiveConversation({ type: "group", id: project._id })}
                          className={`w-full p-3 rounded-xl text-left transition-colors ${isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-container/50 border border-transparent"}`}>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <Hash size={18} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className={`text-sm truncate font-semibold ${isActive ? "text-primary" : "text-on-surface"}`}>{project.title}</h3>
                                {lastMsg && <span className="text-[10px] text-text-secondary ml-2 flex-shrink-0">{formatTime(lastMsg.timestamp)}</span>}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-text-secondary truncate">{lastMsg ? lastMsg.text?.replace(/\[img:[^\]]+\]/g, "📷 Image") : `${project.members?.length || 0} members`}</p>
                                {unreadCount > 0 && <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold ml-2">{unreadCount}</span>}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredDMs.length > 0 && (
                <div>
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary">Direct Messages</p>
                  <div className="space-y-0.5">
                    {filteredDMs.map((dmUser) => {
                      const key = dmKey(user?.id, dmUser._id);
                      const isActive = activeConversation?.type === "dm" && activeConversation?.id === dmUser._id;
                      const unreadCount = getUnread(key);
                      const lastMsg = getLastMessage(key);
                      const online = isOnline(dmUser._id);
                      return (
                        <button key={dmUser._id} onClick={() => setActiveConversation({ type: "dm", id: dmUser._id })}
                          className={`w-full p-3 rounded-xl text-left transition-colors ${isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-container/50 border border-transparent"}`}>
                          <div className="flex items-start gap-3">
                            <div className="relative flex-shrink-0">
                              {getAvatar(dmUser) ? <img src={getAvatar(dmUser)} alt={dmUser.fullName} className="w-10 h-10 rounded-full object-cover" />
                                : <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-text-secondary">{getInitials(dmUser.fullName)}</div>}
                              {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-surface" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className={`text-sm truncate font-semibold ${isActive ? "text-primary" : "text-on-surface"}`}>{dmUser.fullName}</h3>
                                {lastMsg && <span className="text-[10px] text-text-secondary ml-2 flex-shrink-0">{formatTime(lastMsg.timestamp)}</span>}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-text-secondary truncate">{lastMsg ? lastMsg.text?.replace(/\[img:[^\]]+\]/g, "📷 Image") : dmUser.title || "Teammate"}</p>
                                {unreadCount > 0 && <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold ml-2">{unreadCount}</span>}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredProjects.length === 0 && filteredDMs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <MessageSquare size={40} className="text-text-secondary/30 mb-3" />
                  <p className="text-sm text-text-secondary">{searchFilter ? "No conversations match your search." : "No conversations yet. Join a project to start chatting!"}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <main className="flex-1 flex flex-col bg-surface-container-lowest relative min-w-0">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-surface/90 backdrop-blur border-b border-surface-container-high px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {activeProject ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0"><Hash size={20} className="text-primary" /></div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-on-surface text-sm truncate">{activeProject.title}</h3>
                      <p className="text-xs text-text-secondary mt-0.5">{activeProject.members?.length || 0} members</p>
                    </div>
                  </>
                ) : activeDMUser ? (
                  <>
                    <button onClick={() => navigate(`/profile/${activeDMUser._id}`)} className="relative flex-shrink-0 hover:opacity-80 transition-opacity">
                      {getAvatar(activeDMUser)
                        ? <img src={getAvatar(activeDMUser)} alt={activeDMUser.fullName} className="w-10 h-10 rounded-full object-cover" />
                        : <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-text-secondary">{getInitials(activeDMUser.fullName)}</div>}
                      {isOnline(activeDMUser._id) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-success rounded-full border-2 border-surface" />}
                    </button>
                    <div className="min-w-0">
                      <button onClick={() => navigate(`/profile/${activeDMUser._id}`)} className="font-bold text-on-surface text-sm truncate hover:text-primary transition-colors block">{activeDMUser.fullName}</button>
                      <p className="text-xs text-text-secondary mt-0.5">{isOnline(activeDMUser._id) ? "Online" : "Offline"}</p>
                    </div>
                  </>
                ) : null}
              </div>
              {activeProject && (
                <button onClick={() => setShowProjectInfo((v) => !v)} className="text-text-secondary hover:text-on-surface transition-colors p-2">
                  {showProjectInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              )}
            </div>

            {/* Project Info Panel */}
            {activeProject && showProjectInfo && (
              <div className="border-b border-surface-container-high bg-surface-container-low/50 px-6 py-5 flex-shrink-0">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-primary font-heading">{activeProject.title} <span className="text-on-surface">here</span></h2>
                </div>
                {activeProject.description && <p className="text-sm text-text-secondary leading-relaxed mb-4">{activeProject.description}</p>}
                {activeProject.docsLink && (
                  <a href={activeProject.docsLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-surface-container border border-surface-container-high rounded-lg px-4 py-2.5 text-sm text-primary hover:bg-primary/10 transition-colors mb-4">
                    <FileText size={16} /><span className="font-medium">Project Document (DDS)</span><ExternalLink size={14} className="text-text-secondary" />
                  </a>
                )}
                {/* Team members — clickable to profile */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-secondary mb-3"><Users size={12} className="inline mr-1.5" />Team Members</p>
                  <div className="flex flex-wrap gap-2">
                    {(activeProject.members || []).map((member) => {
                      const mid = member._id || member;
                      const name = member.fullName || "Unknown";
                      const online = isOnline(mid);
                      const isMe = mid === user?.id;
                      return (
                        <button
                          key={mid}
                          onClick={() => !isMe && navigate(`/profile/${mid}`)}
                          className={`flex items-center gap-2 bg-surface-container border border-surface-container-high rounded-full px-3 py-1.5 transition-colors ${!isMe ? "hover:border-primary/40 cursor-pointer" : "cursor-default"}`}
                        >
                          <div className="relative">
                            {getAvatar(member)
                              ? <img src={getAvatar(member)} alt={name} className="w-6 h-6 rounded-full object-cover" />
                              : <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-text-secondary">{getInitials(name)}</div>}
                            {online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-status-success rounded-full border-[1.5px] border-surface-container" />}
                          </div>
                          <span className="text-xs font-medium text-on-surface">{isMe ? "You" : name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* "Continue chatting?" banner for ended projects */}
            {continueBanner && continueBanner !== "dismissed" && (
              <div className="flex-shrink-0 bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between gap-3">
                <p className="text-sm text-amber-400 font-body">
                  <span className="font-semibold">This project has ended.</span> Do you want to keep this conversation?
                </p>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setContinueBanner("dismissed")} className="px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-medium hover:bg-amber-500/30 transition-colors">
                    Keep chatting
                  </button>
                  <button onClick={() => { setActiveConversation(null); setContinueBanner(null); }} className="px-3 py-1.5 text-text-secondary border border-outline-variant rounded-lg text-xs hover:bg-surface-container-high transition-colors">
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare size={40} className="text-text-secondary/20 mb-3" />
                  <p className="text-sm text-text-secondary">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  const sender = findUser(msg.senderId);
                  const senderName = sender?.fullName || "Unknown";
                  return (
                    <div key={msg.id} className={`flex gap-3 items-end ${isMine ? "justify-end" : ""}`}>
                      {!isMine && (
                        <button onClick={() => navigate(`/profile/${msg.senderId}`)} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                          {getAvatar(sender)
                            ? <img src={getAvatar(sender)} alt={senderName} className="w-8 h-8 rounded-full object-cover" />
                            : <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-text-secondary">{getInitials(senderName)}</div>}
                        </button>
                      )}
                      <div className={`max-w-md ${isMine ? "text-right" : ""}`}>
                        {!isMine && activeConversation?.type === "group" && (
                          <p className="text-[11px] font-semibold text-primary mb-1 ml-1">{senderName}</p>
                        )}
                        <div className={`rounded-2xl px-4 py-3 ${isMine ? "bg-primary text-white rounded-br-sm" : "bg-surface-container-low border border-surface-container-high rounded-bl-sm"}`}>
                          <div className={`text-sm leading-relaxed ${isMine ? "font-medium" : "text-on-surface"}`}>
                            {renderMessageText(msg.text)}
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-text-secondary/70 mt-1 inline-block mx-1">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  );
                })
              )}

              {currentTypingUsers.length > 0 && (
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-text-secondary">{getInitials(findUser(currentTypingUsers[0])?.fullName)}</div>
                  <div className="bg-surface-container-low border border-surface-container-high rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    {[0, 150, 300].map((d) => <div key={d} className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-surface border-t border-surface-container-high p-4 px-6 flex-shrink-0">
              {/* Image preview */}
              {pendingImage && (
                <div className="mb-3 relative inline-block">
                  <img src={pendingImage.preview} alt="To send" className="h-20 w-20 object-cover rounded-xl border border-surface-container-high" />
                  <button onClick={() => setPendingImage(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-surface-card border border-outline-variant rounded-full flex items-center justify-center text-text-secondary hover:text-red-400 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-3">
                {/* Image upload button */}
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                  className="flex-shrink-0 p-2.5 text-text-secondary hover:text-primary rounded-xl hover:bg-surface-container transition-colors disabled:opacity-40 mb-0.5">
                  {uploadingImage ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Image size={20} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleImagePick} />

                <div className="flex-1 bg-surface-container-low border border-surface-container-high rounded-2xl flex items-end">
                  <textarea value={messageInput} onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-on-surface placeholder-text-secondary/70 outline-none text-sm px-4 py-3.5 resize-none max-h-32 min-h-[48px]" rows={1} />
                </div>

                <button onClick={handleSend} disabled={!messageInput.trim() && !pendingImage}
                  className="bg-primary text-white p-3.5 rounded-full hover:bg-primary-hover transition-colors flex-shrink-0 shadow-lg shadow-primary/20 mb-0.5 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-5">
              <MessageSquare size={32} className="text-text-secondary/30" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">Your Messages</h3>
            <p className="text-sm text-text-secondary max-w-xs">Select a project group or teammate from the sidebar to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;
