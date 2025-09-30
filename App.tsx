
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sender } from './types';
import { sendMessageToBot } from './services/geminiService';
import ChatMessage from './components/ChatMessage';

const UserInput: React.FC<{ onSendMessage: (text: string) => void; isLoading: boolean }> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm border-t border-gray-200">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isLoading ? "Teacher Alex está pensando..." : "Pregúntale una palabra..."}
        className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </form>
  );
};


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-welcome',
      sender: Sender.Bot,
      text: '¡Hola! 🎈 Soy Teacher Alex. ¿Qué palabra en español te gustaría aprender en inglés hoy? ⭐️',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.User,
      text,
    };
    
    const typingMessage: Message = {
        id: `bot-typing-${Date.now()}`,
        sender: Sender.Bot,
        text: 'typing...',
    }

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await sendMessageToBot(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: Sender.Bot,
        text: botResponseText,
      };
      setMessages(prev => [...prev.slice(0,-1), botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        sender: Sender.Bot,
        text: '¡Oh no! Tuve un problema para conectarme. ¿Podemos intentar de nuevo? 🤔',
      };
      setMessages(prev => [...prev.slice(0,-1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-yellow-100 to-blue-200">
      <header className="bg-white/70 backdrop-blur-sm shadow-md p-4 text-center z-10">
        <h1 className="text-2xl font-bold text-gray-700">
          Teacher Alex's English Corner 📚
        </h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="w-full">
        <div className="max-w-4xl mx-auto">
           <UserInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
