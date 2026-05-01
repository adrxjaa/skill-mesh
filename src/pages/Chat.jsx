import { useState } from 'react';
import { Search, MessageCircle, Home, Users, Phone, Video, Info, Plus, Smile, Send, File, MoreVertical, Clock } from 'lucide-react';

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const [searchConversations, setSearchConversations] = useState('');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  const conversations = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: '👩‍💻',
      lastMessage: 'That sounds great! When can we start?',
      timestamp: '2m ago',
      unread: 3,
      online: true
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      avatar: '👨‍💻',
      lastMessage: 'I reviewed your portfolio, impressed!',
      timestamp: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: 'Maya Patel',
      avatar: '👩‍💼',
      lastMessage: 'Let me check with my team',
      timestamp: '3h ago',
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: 'Design Team',
      avatar: '👥',
      lastMessage: 'John: Looking forward to the collaboration',
      timestamp: '1d ago',
      unread: 0,
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      type: 'divider',
      date: 'Today'
    },
    {
      id: 2,
      type: 'received',
      text: 'Hey! I really enjoyed your profile. Love your React Native work!',
      timestamp: '10:30 AM',
      avatar: conversations[selectedConversation]?.avatar
    },
    {
      id: 3,
      type: 'sent',
      text: 'Thanks! I appreciate that. Your portfolio looks impressive too.',
      timestamp: '10:45 AM',
      read: true
    },
    {
      id: 4,
      type: 'received',
      text: 'Would you be interested in collaborating on a mobile app project?',
      timestamp: '10:50 AM',
      avatar: conversations[selectedConversation]?.avatar
    },
    {
      id: 5,
      type: 'sent',
      text: 'Absolutely! I have some free time next month. Tell me more about the project.',
      timestamp: '11:05 AM',
      read: true
    },
    {
      id: 6,
      type: 'received',
      text: 'Perfect! Here\'s our initial design mockup and requirements document.',
      timestamp: '11:20 AM',
      avatar: conversations[selectedConversation]?.avatar
    },
    {
      id: 7,
      type: 'file',
      filename: 'project_requirements.pdf',
      filesize: '2.4 MB',
      timestamp: '11:20 AM',
      avatar: conversations[selectedConversation]?.avatar
    },
    {
      id: 8,
      type: 'typing',
      avatar: conversations[selectedConversation]?.avatar
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchConversations.toLowerCase())
  );

  const currentConversation = conversations[selectedConversation];

  const navItems = [
    { icon: Home, label: 'Feed', active: false },
    { icon: Search, label: 'Search', active: false },
    { icon: Users, label: 'Connections', active: false },
    { icon: MessageCircle, label: 'Messages', active: true }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
      // Simulate typing indicator after a delay
      setTimeout(() => {
        setShowTypingIndicator(true);
        setTimeout(() => {
          setShowTypingIndicator(false);
        }, 2000);
      }, 500);
    }
  };

  return (
    <div className="flex flex-1 w-full text-text-primary h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Conversations List */}
      <div className="w-96 border-r border-surface-container-high bg-surface flex flex-col">
        {/* Header */}
        <div className="border-b border-border-color p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">Messages</h2>
            <button className="text-primary hover:text-primary-hover transition">
              <MessageCircle size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
            <input
              type="text"
              value={searchConversations}
              onChange={(e) => setSearchConversations(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-input-bg border border-border-color rounded-lg px-3 py-2 pl-10 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv, idx) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(idx)}
              className={`w-full border-b border-border-color p-4 text-left transition ${
                selectedConversation === idx
                  ? 'bg-input-bg'
                  : 'hover:bg-input-bg'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="text-3xl">{conv.avatar}</div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border 2 border-card-bg" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary truncate">{conv.name}</h3>
                    <span className="text-xs text-text-secondary ml-2">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-text-secondary truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 bg-primary text-black text-xs rounded-full flex items-center justify-center font-bold">
                    {conv.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col bg-surface-container-lowest">
        {currentConversation && (
          <>
            {/* Chat Header */}
            <div className="border-b border-border-color bg-card-bg px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{currentConversation.avatar}</div>
                  <div>
                    <h3 className="font-bold text-text-primary">{currentConversation.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Online via Web
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-text-secondary">
                  <button className="hover:text-text-primary transition">
                    <Phone size={20} />
                  </button>
                  <button className="hover:text-text-primary transition">
                    <Video size={20} />
                  </button>
                  <button className="hover:text-text-primary transition">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                if (msg.type === 'divider') {
                  return (
                    <div key={msg.id} className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-border-color" />
                      <span className="text-xs text-text-secondary">{msg.date}</span>
                      <div className="flex-1 h-px bg-border-color" />
                    </div>
                  );
                }

                if (msg.type === 'typing') {
                  return (
                    <div key={msg.id} className="flex gap-3 items-end">
                      <div className="text-2xl">{msg.avatar}</div>
                      <div className="bg-input-bg rounded-lg px-4 py-3 flex gap-1">
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'received') {
                  return (
                    <div key={msg.id} className="flex gap-3 items-end">
                      <div className="text-2xl">{msg.avatar}</div>
                      <div>
                        <div className="bg-input-bg rounded-lg px-4 py-3 max-w-xs">
                          <p className="text-sm text-text-primary">{msg.text}</p>
                        </div>
                        <span className="text-xs text-text-secondary ml-2 mt-1 inline-block">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'file') {
                  return (
                    <div key={msg.id} className="flex gap-3 items-end">
                      <div className="text-2xl">{msg.avatar}</div>
                      <div>
                        <div className="bg-card-bg border border-border-color rounded-lg px-4 py-3 flex items-center gap-3 w-64">
                          <File size={20} className="text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">{msg.filename}</p>
                            <p className="text-xs text-text-secondary">{msg.filesize}</p>
                          </div>
                          <button className="text-primary hover:text-primary-hover transition">
                            <Phone size={18} />
                          </button>
                        </div>
                        <span className="text-xs text-text-secondary ml-2 mt-1 inline-block">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                // Sent message
                return (
                  <div key={msg.id} className="flex gap-3 items-end justify-end">
                    <div>
                      <div className="bg-primary text-black rounded-lg px-4 py-3 max-w-xs">
                        <p className="text-sm font-medium">{msg.text}</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-text-secondary mr-2">
                        <span>{msg.timestamp}</span>
                        {msg.read && <span>✓✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="border-t border-border-color bg-card-bg p-6">
              <div className="flex items-center gap-3">
                <button className="text-text-secondary hover:text-primary transition">
                  <Plus size={24} />
                </button>

                <div className="flex-1 bg-input-bg border border-border-color rounded-lg px-4 py-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-text-primary placeholder-text-secondary outline-none text-sm"
                  />
                  <button className="text-text-secondary hover:text-primary transition">
                    <Smile size={20} />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="bg-primary text-black p-3 rounded-full hover:bg-primary-hover transition flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Chat;
