import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface MessageDisplayProps {
  messages: Message[];
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">J.A.R.V.I.S.</h1>
            <p className="text-cyan-400 mt-2">Just A Rather Very Intelligent System</p>
            <p className="text-sm text-slate-400 mt-4 tracking-widest uppercase">by umar siddiqui</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl h-[50vh] overflow-y-auto p-4 space-y-6">
      {messages.map((msg, index) => (
        <div
          key={msg.id || index}
          className={`flex items-start gap-4 ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {msg.sender === 'jarvis' && (
            <div className="w-8 h-8 rounded-full bg-cyan-500/50 flex-shrink-0 border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
          )}
          <div
            className={`max-w-md lg:max-w-lg p-3 rounded-lg text-sm md:text-base leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-blue-900/50 border border-blue-700 text-slate-200'
                : 'bg-slate-800/60 border border-cyan-800 text-slate-300'
            }`}
          >
            {msg.sender === 'user' ? (
                <p className="italic">"{msg.text}"</p>
            ) : (
                <p>{msg.text}</p>
            )}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};