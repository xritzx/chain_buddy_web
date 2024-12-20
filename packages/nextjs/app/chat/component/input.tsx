// src/components/component/input.tsx
import React from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (<>
      <input
        type="text"
        className="flex-1 px-3 py-2 border bg-base-300 border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={() => {
          if (message.trim()) {
            onSend(message.trim());
            setMessage('');
          }
        }}
        className="px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary/90"
      >
        Send
      </button></>
  );
};

export default ChatInput;
