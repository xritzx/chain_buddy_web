import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import EmojiRating from './rating';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
}

interface MessagePart {
  text: string;
  recommendationScore: number | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender }) => {
  const isUser = sender === 'user';

  const messageParts = useMemo(() => {
    if (isUser) {
      return [{ text: message, recommendationScore: null }];
    } else {
      const scoreRegex = /#RATING@(\d+(\.\d+)?)#/g;
      let lastIndex = 0;
      const parts: MessagePart[] = [];

      for (const match of message.matchAll(scoreRegex)) {
        // Add the text before the score
        if (match.index! > lastIndex) {
          parts.push({
            text: message.slice(lastIndex, match.index),
            recommendationScore: null
          });
        }
        // Add the score part
        parts.push({
          text: '',
          recommendationScore: parseFloat(match[1])
        });
        lastIndex = match.index! + match[0].length;
      }

      // Add any remaining text after the last match
      if (lastIndex < message.length) {
        parts.push({
          text: message.slice(lastIndex),
          recommendationScore: null
        });
      }      
      return parts;
    }
  }, [message, isUser]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`pl-3 pr-3 rounded-lg max-w-xs leading-tight break-words shadow-xl 
          ${isUser ? 'bg-primary text-primary-content rounded-br-none' 
                   : 'bg-base-100 text-base-content rounded-bl-none'}
          border border-neutral border-l-0 border-t-0`}>
        {messageParts.map((part, index) => (
          <React.Fragment key={index}>
            {part.text && <ReactMarkdown className="whitespace-pre-wrap" remarkPlugins={[remarkGfm]}>
                {part.text}
              </ReactMarkdown>
            }
            {part.recommendationScore !== null && (
              <div className="mt-2">
                <EmojiRating rating={part.recommendationScore} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
