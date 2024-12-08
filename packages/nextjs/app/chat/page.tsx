// src/components/ChatPage.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import OpenAI from 'openai';
import ChatMessages from './component/messages';
import ChatInput from './component/input';
import Loader from '../../components/Loader';
import { useChat } from '~~/hooks/useChat';
import { notification } from '~~/utils/scaffold-eth';
import { MicrophoneIcon, StopIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { urls } from '~~/config/api';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

type Speaker = 'user' | 'ai'
type SpeakerState = 0 | 1
const SAMPLE_RATE = 16000

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for frontend usage
});

function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0, offset = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I assist you today?', sender: 'ai' },
  ]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const { message: aiResponse, loading: chatLoading, error } = useChat(userMessage, conversationId);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Audio processing refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const [isInAudioMode, setisInAudioMode] = useState(false)
  const [speaker, setSpeaker] = useState<Speaker>('user')
  const [speakerState, setSpeakerState] = useState<SpeakerState>(0)
  const [isListening, setisListening] = useState(false)
  const [audioData, setAudioData] = useState<Int16Array[]>([]);


  useEffect(() => {
    setConversationId(nanoid());
  }, [])

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, chatLoading]);

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setLoading(true);
    setUserMessage(message);
    setLoading(false);
  };

  useEffect(() => {
    if (aiResponse) {
      setMessages((prev) => [...prev, { text: aiResponse, sender: 'ai' }]);
    }
  }, [aiResponse, error]);
  useEffect(() => {
    setLoading(chatLoading);
  }, [chatLoading])

  useEffect(() => {
    audioPlayerRef.current = new Audio();
    audioPlayerRef.current.addEventListener('ended', () => {
      setSpeaker('user');
      setSpeakerState(0);
      setisInAudioMode(false);
    });
    return () => {
      stopRecording();
      if (audioPlayerRef.current) {
        audioPlayerRef.current.removeEventListener('ended', () => {
          setSpeaker('user');
          setisInAudioMode(false);
          setSpeakerState(0);
        });
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
        setisInAudioMode(false);
      }
    };
  }, []);


  const initializeAudioProcessing = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: SAMPLE_RATE,
        }
      });

      audioContextRef.current = new AudioContext({
        sampleRate: SAMPLE_RATE,
      });

      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(floatTo16BitPCM(inputData));
        setAudioData(prev => [...prev, pcmData]);
      };

      setisListening(true);
      notification.success("Recording started");
    } catch (err) {
      console.log('Error initializing audio:', err);
      notification.error("Failed to access microphone");
    }
  };

  const handleToggleRecording = async () => {
    if (!isListening) {
      try {
        await initializeAudioProcessing();
      } catch (err) {
        console.log('Error starting recording:', err);
        notification.error("Failed to start recording");
      }
    } else {
      await stopRecording();
    }
  }
  const stopRecording = async () => {
    const thinkingId = notification.loading("Thinking ....");
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setisListening(false);
    await sendRecordedAudio();
    notification.remove(thinkingId);
  };

  const sendRecordedAudio = async () => {
    try {
      const arr = Array.from(audioData);
      if (arr.length === 0) return;
      const combinedLength = audioData.reduce((acc, chunk) => acc + chunk.length, 0);
      const combinedAudio = new Int16Array(combinedLength);
      let offset = 0;

      audioData.forEach(chunk => {
        combinedAudio.set(chunk, offset);
        offset += chunk.length;
      });

      const response = await fetch(`${urls.chat.baseURL}${urls.chat.audio}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_data: Array.from(combinedAudio),
          conversation_id: conversationId,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      await handleStreamResponse(reader);
    } catch (err) {
      console.log('Error sending audio:', err);
      setisInAudioMode(false);
      notification.error("Failed to send audio data");
    }
  };

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
            const eventData = JSON.parse(line);
            if (eventData.event === 'agent') {
              await generateSpeech(eventData.data);
            } else if (eventData.event === 'transcribed') {
              setMessages((prev) => [...prev, { text: eventData.data, sender: 'user' }]);
            }
          } catch (err) {
            console.log('Error parsing JSON:', err);
            notification.error("Failed to parse response");
            setSpeaker('user');
            setSpeakerState(0);
          }
        }
      });
    }
  };

  const generateSpeech = async (text: string) => {
    if (!text) return;
    try {
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: text,
        speed: 1.2,
      });

      // Convert the response to a blob
      const audioBlob = new Blob([await response.arrayBuffer()], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioPlayerRef.current) {
        setSpeakerState(1);
        setMessages((prev) => [...prev, { text, sender: 'ai' }]);
        audioPlayerRef.current.src = audioUrl;
        await audioPlayerRef.current.play();

      }
    } catch (err) {
      console.log('Error generating speech:', err);
      setisInAudioMode(false);
      notification.error("Failed to generate speech");
    }
  };


  return (
    <div className="flex flex-col h-[760px] bg-transparent">
      {/* Main chat container with fixed height */}
      <div className="flex-1 flex justify-center py-4 px-2 sm:px-4 overflow-hidden">
        <div className="relative w-full max-w-2xl flex flex-col bg-transparent shadow-md h-full">
          {/* Messages area: scrollable */}
          <div className="flex-1 bg-base-300 opacity-80 overflow-y-auto p-4 rounded-lg">
            <ChatMessages messages={messages} />
            {loading && (
              <div className="flex justify-center mt-4">
                <Loader />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Input area at the bottom */}
          <div className="border-t border-gray-200 p-2 bg-base-300 opacity-60">
            <div className="flex items-center space-x-2 bg-base-300 px-2 py-2 rounded-lg">
            {/* Voice Start Button */}
            {!isInAudioMode && (
              <button
                onClick={async () => {
                  await handleToggleRecording();
                  setisInAudioMode(true);
                  setSpeakerState(1);
                }}
                className="h-12 w-12 p-2 m-0 rounded-full border-4 border-secondary bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:primary focus:ring-opacity-50"
              >
                <MicrophoneIcon className='text-white text-3xl' />
              </button>
            )}

            {/* Voice Stop Button */}
            {isInAudioMode && isListening && (
              <button
                onClick={() => {
                  handleToggleRecording();
                }}
                className="h-12 w-12 p-2 m-0 rounded-full border-4 border-secondary bg-primary hover:bg-accent animate-pulse focus:outline-none focus:ring-2 focus:secondary focus:ring-opacity-50"
              >
                <StopIcon className='text-white text-3xl' />
              </button>
            )}

            {/* System Processing/Speaking Mode */}
            {isInAudioMode && !isListening && (
              <div
                className="h-12 w-12 p-2 m-0 flex items-center justify-center rounded-full border-4 border-secondary bg-primary animate-spin"
                onClick={() => {
                  audioPlayerRef.current?.pause();
                  setisInAudioMode(false);
                }}
              >
                <ArrowPathIcon className='text-white text-3xl' />
              </div>
            )}
            <ChatInput onSend={handleSend} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
