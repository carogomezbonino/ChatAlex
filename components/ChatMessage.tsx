
import React from 'react';
import { Message, Sender } from '../types';

const TeacherAvatar: React.FC = () => (
  <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-xl shadow-md flex-shrink-0">
    🍎
  </div>
);

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;

  if (isBot) {
    return (
      <div className="flex items-start gap-3 w-full max-w-lg">
        <TeacherAvatar />
        <div className="bg-white rounded-r-xl rounded-bl-xl p-4 shadow-md text-gray-800 leading-relaxed min-h-[4rem]">
          {message.text === 'typing...' ? (
            <TypingIndicator />
          ) : (
            <div className="prose prose-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 self-end w-full max-w-lg justify-end">
      <div className="bg-blue-500 rounded-l-xl rounded-br-xl p-4 shadow-md text-white leading-relaxed">
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-xl shadow-md flex-shrink-0">
        🎓
      </div>
    </div>
  );
};

export default ChatMessage;
