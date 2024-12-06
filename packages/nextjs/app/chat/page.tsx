// src/components/ChatPage.tsx
'use client';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import ChatMessages from './component/messages';
import ChatInput from './component/input';
import Loader from '../../components/Loader';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I assist you today?', sender: 'ai' },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setLoading(true);
    try {
      const response = await axios.post('/api/ai-chat', { message });
      setMessages((prev) => [
        ...prev,
        { text: response.data.reply, sender: 'ai' },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, something went wrong.', sender: 'ai' },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[760px] bg-base-200 ">
      {/* Main chat container with fixed height */}
      <div className="flex-1 flex justify-center py-4 px-2 sm:px-4 overflow-hidden">
        <div className="relative w-full max-w-2xl flex flex-col bg-white shadow-md h-full">
          {/* Messages area: scrollable */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg">
            <ChatMessages messages={messages} />
            {loading && (
              <div className="flex justify-center mt-4">
                <Loader />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Input area at the bottom */}
          <div className="border-t border-gray-200 p-2 bg-white">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
