import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { API_URL } from '../../config/api';

const MessageBubble = ({ message, currentUserId }) => {
  const isSender = message.sender_id === currentUserId;

  const alignmentClass = isSender ? 'self-end' : 'self-start';
  const colorClass = isSender
    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md' // Mentee (Sender)
    : 'bg-gray-700 text-gray-200 shadow-sm border border-gray-600'; // Mentor (Receiver)
  const cornerClass = isSender
    ? 'rounded-br-none'
    : 'rounded-bl-none';

  return (
    <div className={`max-w-[75%] p-3 rounded-xl shadow-md ${colorClass} ${alignmentClass} ${cornerClass} transition duration-150`}>
      <p className="text-sm">{message.content || message.text}</p>
      <span className="text-[10px] opacity-70 block text-right mt-1">
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

const MenteeMessage = () => {
  const [mentors, setMentors] = useState([]); // List of mentors to chat with
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const userId = user.id;

  // Initialize Socket
  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;
    socket.on('message:new', (msg) => {
      if (activeConversationId && msg.conversation_id === activeConversationId) {
        setMessages((prev) => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        scrollToBottom();
      }
    });
    return () => socket.off('message:new');
  }, [socket, activeConversationId]);

  // Fetch Connected Mentors
  useEffect(() => {
    const fetchMyMentors = async () => {
      try {
        // 1. Fetch all mentors (Base list)
        const res = await fetch(`${API_URL}/api/mentors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const allMentors = await res.json();

          // 2. Filter for connected ones
          const connectedMentors = [];

          // Use Promise.all for parallel fetching
          await Promise.all(allMentors.map(async (mentor) => {
            try {
              const statusRes = await fetch(`${API_URL}/api/mentors/${mentor.id}/mentees/status`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.status === 'active') {
                  connectedMentors.push({
                    id: mentor.id,
                    name: mentor.name || mentor.username || 'Mentor',
                    active: false
                  });
                }
              }
            } catch (err) { /* ignore */ }
          }));

          setMentors(connectedMentors);
        }
      } catch (e) { console.error(e); }
    };

    fetchMyMentors();
  }, [userId, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectUser = async (contact) => {
    setActiveChatUser(contact);
    try {
      // Find or create conversation
      const res = await fetch(`${API_URL}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participantIds: [userId, contact.id] })
      });

      if (res.ok) {
        const convo = await res.json();
        setActiveConversationId(convo.id);
        socket.emit('join:conversation', { conversationId: convo.id });

        const msgRes = await fetch(`${API_URL}/api/conversations/${convo.id}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(Array.isArray(msgData) ? msgData : []);
        } else {
          setMessages([]);
        }
        scrollToBottom();
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not load chat");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) return;
    try {
      const res = await fetch(`${API_URL}/api/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });
      if (res.ok) {
        setNewMessage('');
        scrollToBottom();
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send");
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-0">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 drop-shadow-sm">
        💬 Messages
      </h1>

      <div className="flex h-[75vh] bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">

        {/* Left Column: Mentor List */}
        <div className="w-full sm:w-1/3 border-r border-gray-700 overflow-y-auto bg-gray-800/50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">Your Mentors</h3>
          </div>
          <ul className="divide-y divide-gray-700">
            {mentors.length === 0 ? (
              <li className="p-4 text-gray-500">No active mentors.</li>
            ) : (
              mentors.map((mentor) => (
                <li
                  key={mentor.id}
                  onClick={() => handleSelectUser(mentor)}
                  className={`p-4 cursor-pointer transition-colors duration-150 ${activeChatUser?.id === mentor.id ? 'bg-teal-900/30 border-l-4 border-teal-500' : 'hover:bg-gray-700'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${activeChatUser?.id === mentor.id ? 'text-teal-400' : 'text-gray-200'}`}>
                      {mentor.name}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Right Column: Message Thread */}
        <div className="w-full sm:w-2/3 flex flex-col bg-gray-900/30">
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <h3 className="text-xl font-bold text-white">
              {activeChatUser ? activeChatUser.name : 'Select a mentor'}
            </h3>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {!activeChatUser ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a mentor to chat with
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">No messages yet.</div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} currentUserId={userId} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {activeChatUser && (
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${activeChatUser.name}...`}
                  className="flex-1 p-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 bg-gray-700 text-white placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all shadow-lg">
                  <svg className="w-6 h-6 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenteeMessage;
