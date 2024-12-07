import axios from 'axios';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { urls } from '~~/config/api';
import { notification } from '~~/utils/scaffold-eth';
import { ZERO_ADDRESS } from '~~/utils/scaffold-eth/common';

export type ChatCompletionResponse = {
  message: string | null;
  loading: boolean;
  error: any;
};
export type BotResponse = {
    event: 'tools' | 'agent' | 'error' | 'completed',
    data: string;
}

export const useChat = (userMessage: string, conversationId: string): ChatCompletionResponse => {
  const [data, setData] = useState<ChatCompletionResponse>({
    message: null,
    loading: false,
    error: null,
  });
  const { address } = useAccount();

  const handleStreamResponse = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      lines.forEach(async line => {
        if (line.trim()) {
          try {
            const jsonResponse = JSON.parse(line);
            if (jsonResponse.event === 'agent') {
              setData({ message: jsonResponse.data as string, loading: false, error: null });
            }
          } catch (err) {
            setData({ message: null, loading: false, error: err });
            console.log('Error parsing JSON:', err);
            notification.error("Error getting response from bot");
          }
        }
      });
    }
  };

  const chatCompletion = async () => {    
    try {
      setData((prevState) => ({ ...prevState, loading: true }));
      const response = await fetch(
        `${urls.chat.baseURL}${urls.chat.text}`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            input: userMessage, conversation_id: conversationId, user_address: address ?? ZERO_ADDRESS
          })
        }
      );
      // Mock
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // let parsedResponse =  [ { data: `Help World ${address} ${conversationId} : ${Math.random()}`, event: 'agent' } as BotResponse ] as any;
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }
      await handleStreamResponse(reader)
    } catch (error: any) {
      console.error('Error fetching data from api:', error);
    }
  };

  useEffect(() => {
    if(userMessage && userMessage.length > 0) {
      chatCompletion();
    }
  }, [userMessage]);

  return data;
};
