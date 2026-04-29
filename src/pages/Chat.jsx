import { useState, useRef, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import useMatch from "../hooks/useMatch";
import mockUsers from "../data/mockUsers";

function Chat() {
  const { userId } = useParams();
  const { isMatch, sendMessage, getMessages } = useMatch();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const matchedUser = mockUsers.find((u) => u.id === userId);
  const messages = getMessages(userId);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Guard: must be a valid match
  if (!matchedUser || !isMatch(userId)) {
    return <Navigate to="/matches" replace />;
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(userId, input);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col bg-slate-50">
      {/* ── Chat header ── */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <Link
          to="/matches"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-pink-100 text-sm font-bold text-orange-600">
          {matchedUser.initials}
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">{matchedUser.displayName}</h2>
          <p className="truncate text-xs text-slate-500">{matchedUser.bio}</p>
        </div>
        <div className="ml-auto">
          <Link
            to={`/u/${matchedUser.username}`}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl">
              👋
            </div>
            <p className="text-sm font-medium text-slate-700">
              You matched with {matchedUser.displayName}!
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Send a message to start collaborating.
            </p>
          </div>
        )}

        <div className="mx-auto max-w-2xl space-y-3">
          {messages.map((msg) => {
            const isMe = msg.from === "me";
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? "rounded-br-md bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "rounded-bl-md bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMe ? "text-orange-200" : "text-slate-400"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input bar ── */}
      <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
        <form onSubmit={handleSend} className="mx-auto flex max-w-2xl gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${matchedUser.displayName}…`}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
