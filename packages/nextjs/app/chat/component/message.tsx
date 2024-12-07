// src/components/ChatMessage.tsx
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EmojiRating from './rating';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
}
interface CleanMessage {
  message: string;
  recommendationScore: number | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isUser = sender === 'user';
  const [cleanMessage, setCleanMessage] = React.useState<CleanMessage>({ message: '', recommendationScore: 0 });

  useEffect(() => {
    if (!isUser) {
      const parseMessage = (input: string) => {
        const scoreRegex = /#RATING@(\d+(\.\d+)?)#/;
        const match = input.match(scoreRegex);
        let recommendationScore = null;
        if (match && match[1]) {
            recommendationScore = parseFloat(match[1]); 
        }
        const message = input.replace(scoreRegex, '').trim();
        return {
            message: message,
            recommendationScore: recommendationScore
        };
      }
      setCleanMessage(parseMessage(message));
      console.log(parseMessage(message));
      
    } else {
      setCleanMessage({ message, recommendationScore: null })
    }
  }, [message])
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          pl-3 pr-3 rounded-lg max-w-xs break-words shadow-xl
          ${isUser 
            ? 'bg-primary text-primary-content rounded-br-none' 
            : 'bg-base-100 text-base-content rounded-bl-none'
          }
          border border-neutral border-l-0 border-t-0
        `}
      >
        <ReactMarkdown className="whitespace-pre-wrap"  remarkPlugins={[remarkGfm]}>
          {cleanMessage.message}
        </ReactMarkdown>
        {cleanMessage.recommendationScore && <EmojiRating rating={cleanMessage.recommendationScore} />}
      </div>
    </div>
  );
};

export default ChatMessage;
