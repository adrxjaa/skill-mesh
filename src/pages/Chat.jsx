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
      name: 'Sarah Jenkins',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastMessage: 'That sounds great! When can we start?',
      timestamp: '2m ago',
      unread: 3,
      online: true
    },
    {
      id: 2,
      name: 'Marcus Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      lastMessage: 'I reviewed your portfolio, impressed!',
      timestamp: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      lastMessage: 'Let me check with my team',
      timestamp: '3h ago',
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: 'Design Team',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
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

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
      setTimeout(() => {
        setShowTypingIndicator(true);
        setTimeout(() => {
          setShowTypingIndicator(false);
        }, 2000);
      }, 500);
    }
  };

  return (
    <div className="flex flex-1 w-full text-on-surface h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Conversations List */}
      <div className="w-96 border-r border-surface-container-high bg-surface flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-on-surface">Messages</h2>
            <button className="text-text-secondary hover:text-primary transition-colors">
              <MessageCircle size={22} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-text-secondary" size={18} />
            <input
              type="text"
              value={searchConversations}
              onChange={(e) => setSearchConversations(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-surface-container border border-surface-container-high rounded-xl px-4 py-2.5 pl-11 text-sm text-on-surface placeholder-text-secondary outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          {filteredConversations.map((conv, idx) => {
            const isSelected = selectedConversation === idx;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(idx)}
                className={`w-full p-3 rounded-xl text-left transition-colors ${
                  isSelected
                    ? 'bg-surface-container-high/50'
                    : 'hover:bg-surface-container/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm truncate ${isSelected ? 'font-bold text-on-surface' : 'font-semibold text-text-secondary'}`}>{conv.name}</h3>
                      <span className="text-xs text-text-secondary ml-2">{conv.timestamp}</span>
                    </div>
                    <p className={`text-xs truncate mt-1 ${isSelected ? 'text-text-secondary' : 'text-text-secondary/70'}`}>{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="flex-shrink-0 w-5 h-5 bg-primary text-black text-xs rounded-full flex items-center justify-center font-bold mt-1">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col bg-surface-container-lowest relative">
        {currentConversation && (
          <>
            {/* Chat Header */}
            <div className="bg-surface/90 backdrop-blur border-b border-surface-container-high px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img src={currentConversation.avatar} alt={currentConversation.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-on-surface text-sm">{currentConversation.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                    {currentConversation.online ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Online
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-text-secondary/50 rounded-full" />
                        Offline
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-text-secondary">
                <button className="hover:text-on-surface transition-colors">
                  <Video size={18} />
                </button>
                <button className="hover:text-on-surface transition-colors">
                  <Info size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => {
                if (msg.type === 'divider') {
                  return (
                    <div key={msg.id} className="flex items-center gap-4 my-8">
                      <div className="flex-1 h-px bg-surface-container-high" />
                      <span className="text-xs font-medium text-text-secondary/70 uppercase tracking-wider">{msg.date}</span>
                      <div className="flex-1 h-px bg-surface-container-high" />
                    </div>
                  );
                }

                if (msg.type === 'typing' && !showTypingIndicator) {
                  return null;
                }

                if (msg.type === 'typing') {
                  return (
                    <div key={msg.id} className="flex gap-3 items-end">
                      <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      <div className="bg-surface-container-low border border-surface-container-high rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-text-secondary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'received') {
                  return (
                    <div key={msg.id} className="flex gap-3 items-end">
                      <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="bg-surface-container-low border border-surface-container-high rounded-2xl rounded-bl-sm px-4 py-3 max-w-md">
                          <p className="text-sm text-on-surface leading-relaxed">{msg.text}</p>
                        </div>
                        <span className="text-[10px] font-medium text-text-secondary/70 ml-2 mt-1.5 inline-block">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                if (msg.type === 'file') {
                  return (
                    <div key={msg.id} className="flex gap-3 items-end">
                      <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="bg-surface-container-low border border-surface-container-high rounded-2xl rounded-bl-sm p-3 flex items-center gap-4 w-72 transition-colors hover:bg-surface-container">
                          <div className="bg-primary/10 p-3 rounded-xl">
                            <File size={24} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate">{msg.filename}</p>
                            <p className="text-xs text-text-secondary mt-0.5">{msg.filesize}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-text-secondary/70 ml-2 mt-1.5 inline-block">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                // Sent message
                return (
                  <div key={msg.id} className="flex gap-3 items-end justify-end">
                    <div>
                      <div className="bg-primary text-black rounded-2xl rounded-br-sm px-4 py-3 max-w-md">
                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 mt-1.5 mr-2">
                        <span className="text-[10px] font-medium text-text-secondary/70">{msg.timestamp}</span>
                        {msg.read && <span className="text-primary text-xs">✓✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="bg-surface border-t border-surface-container-high p-4 px-6 flex items-end gap-3 sticky bottom-0">
              <button className="p-2.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex-shrink-0 mb-0.5">
                <Plus size={22} />
              </button>

              <div className="flex-1 bg-surface-container-low border border-surface-container-high rounded-2xl flex items-end">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-on-surface placeholder-text-secondary/70 outline-none text-sm px-4 py-3.5 resize-none max-h-32 min-h-[48px]"
                  rows={1}
                />
              </div>

              <button
                onClick={handleSendMessage}
                className="bg-primary text-black p-3.5 rounded-full hover:bg-primary-hover transition-colors flex-shrink-0 shadow-lg shadow-primary/20 mb-0.5"
              >
                <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Chat;
