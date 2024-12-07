// src/components/ChatMessage.tsx
import React from 'react';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          p-3 rounded-lg max-w-xs break-words shadow-xl
          ${isUser 
            ? 'bg-primary text-primary-content rounded-br-none' 
            : 'bg-base-100 text-base-content rounded-bl-none'
          }
          border border-neutral border-l-0 border-t-0
        `}
      >
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
