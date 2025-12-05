import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { createChatSession } from '../services/geminiService';
import { MessageCircle, X, Send, Sparkles, Loader2, Mic, MicOff } from 'lucide-react';
import { Chat, GenerateContentResponse } from '@google/genai';

// Add type definitions for SpeechRecognition
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'model', text: "Hello, I'm Page. Looking for your next great read?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, messages]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-GB';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text || "I'm having trouble finding the right words properly. Could you ask again?";
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "My apologies, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-ws-black rotate-90' : 'bg-ws-gold'}`}
      >
        {isOpen ? <X color="white" size={24} /> : <MessageCircle color="white" size={28} />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-ws-black p-4 flex items-center gap-3">
          <div className="bg-ws-gold p-2 rounded-full">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-serif font-bold">Page</h3>
            <p className="text-gray-400 text-xs">Literary Concierge</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-ws-cream">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-ws-black text-white rounded-br-none' 
                  : 'bg-white text-ws-black border border-gray-100 shadow-sm rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-ws-gold" size={16} />
                <span className="text-xs text-gray-400">Consulting the archives...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
           {recognitionRef.current && (
            <button 
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for a recommendation..."
            className="flex-1 bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-ws-gold focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-ws-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;