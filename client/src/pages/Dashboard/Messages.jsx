// Messages.jsx

import React from 'react';

// Functional component to display a single message bubble (inlined logic from MessageBox)
const MessageBubble = ({ message }) => {
  const isMentor = message.sender === 'mentor';
  
  // Tailwind classes for the bubble based on sender
  const alignmentClass = isMentor ? 'self-end' : 'self-start';
  const colorClass = isMentor 
    ? 'bg-indigo-600 text-white dark:bg-indigo-500' 
    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  const cornerClass = isMentor 
    ? 'rounded-br-none' // Sharp corner on the bottom-right for the sender
    : 'rounded-bl-none'; // Sharp corner on the bottom-left for the receiver

  return (
    <div className={`max-w-[75%] p-3 rounded-xl shadow-md ${colorClass} ${alignmentClass} ${cornerClass} transition duration-150`}>
      <p className="text-sm">{message.text}</p>
    </div>
  );
};

const Messages = () => {
  // Dummy data for chat list
  const mentees = [
    { id: 1, name: 'John Doe', lastMessage: 'See you next week!', time: '10:30 AM', active: true },
    { id: 2, name: 'Jane Smith', lastMessage: 'Need help with React.', time: 'Yesterday', active: false },
    { id: 3, name: 'Peter Jones', lastMessage: 'Thanks for the feedback!', time: '2 days ago', active: false },
  ];
  
  // Dummy data for the active chat thread
  const messages = [
    { id: 1, text: 'Hi Jane, how is your React project coming along?', sender: 'mentor' },
    { id: 2, text: 'It\'s good, but I\'m stuck on state management. I tried Redux, but it seems overly complex for my small app.', sender: 'mentee' },
    { id: 3, text: 'I understand. No worries, we can simplify that. Let\'s switch to Zustand or Jotai. They are much lighter. We\'ll cover it in our session.', sender: 'mentor' },
    { id: 4, text: 'That sounds perfect! I started looking into Zustand, but I could definitely use some guidance on best practices.', sender: 'mentee' },
  ];
  
  // Placeholder for the currently active chat (John Doe in this case)
  const activeMentee = mentees[0]; 

  return (
    <div className="space-y-8 p-4 sm:p-0">
      
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
        💬 Private Messages
      </h1>

      {/* --- Chat Layout Container --- */}
      <div className="flex h-[75vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Left Column: Chat List */}
        <div className="w-full sm:w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Conversations</h3>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {mentees.map((mentee) => (
              <li
                key={mentee.id}
                className={`p-4 cursor-pointer transition-colors duration-150 ${
                  mentee.active ? 'bg-indigo-50 dark:bg-indigo-900/40 border-l-4 border-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-bold ${mentee.active ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                    {mentee.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {mentee.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {mentee.lastMessage}
                </p>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right Column: Message Thread */}
        <div className="w-full sm:w-2/3 flex flex-col">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{activeMentee.name}</h3>
          </div>
          
          {/* Messages Display Area */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto flex flex-col">
            {messages.map((message) => (
              // Using the locally defined MessageBubble component
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          
          {/* Message Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder={`Message ${activeMentee.name}...`}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
              />
              <button className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-150">
                {/* Send Icon */}
                <svg className="w-6 h-6 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;