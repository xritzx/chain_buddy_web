import axios from 'axios';
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { urls } from '~~/config/api';
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

  const chatCompletion = async () => {    
    try {
      setData((prevState) => ({ ...prevState, loading: true }));
      // const response = await axios.post(
      //   `${urls.chat.baseURL}${urls.chat.text}`,
      //   { input: userMessage, conversation_id: conversationId, userAddress: address ?? ZERO_ADDRESS },
      // );
      // let parsedResponse = response.data;
      // Mock
      await new Promise((resolve) => setTimeout(resolve, 2000));
      let parsedResponse =  [ { data: `Help World ${address} ${conversationId} : ${Math.random()}`, event: 'agent' } as BotResponse ] as any;
      
      if(Array.isArray(parsedResponse)) {
        parsedResponse = parsedResponse.filter((res: BotResponse) => {
          return res.event === 'agent';
        })
        if(parsedResponse && parsedResponse.length > 0) {
          parsedResponse = parsedResponse[0];
        }
      }
      setData({ message: parsedResponse.data as string, loading: false, error: null });
    } catch (error: any) {
      setData({ message: null, loading: false, error: error });
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    chatCompletion();
  }, [userMessage]);

  return data;
};
