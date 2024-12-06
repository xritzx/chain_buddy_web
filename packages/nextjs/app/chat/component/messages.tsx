// src/components/component/messages.tsx
import React from 'react';
import ChatMessage from './message';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default ChatMessages;
