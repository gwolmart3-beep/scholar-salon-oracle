import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { Film, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isStreaming }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-film-black relative">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-film-muted opacity-40 select-none">
          <Film size={64} strokeWidth={1} className="mb-4" />
          <p className="font-serif italic text-lg text-center max-w-md">
            The archive is open. Select a lens through which to view history.
          </p>
        </div>
      )}
      
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.role === 'model' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-film-gold/10 border border-film-gold/30 flex items-center justify-center text-film-gold mt-1">
              <Film size={14} />
            </div>
          )}
          
          <div
            className={`
              relative p-5 rounded-lg text-sm sm:text-base leading-relaxed max-w-[85%] sm:max-w-[75%] shadow-lg
              ${msg.role === 'user' 
                ? 'bg-film-border/30 text-film-text border border-film-border/50 rounded-tr-none' 
                : 'bg-film-panel text-film-white border border-film-border rounded-tl-none font-serif'}
            `}
          >
             <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-film-gold prose-a:text-film-gold prose-blockquote:border-l-film-gold prose-blockquote:bg-film-black/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-code:bg-film-black prose-code:text-film-muted prose-pre:bg-film-black prose-strong:text-film-white">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
             </div>
             
             {/* Timestamp decoration */}
             <div className={`text-[10px] mt-3 opacity-40 font-mono flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
          </div>

          {msg.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-film-border flex items-center justify-center text-film-muted mt-1">
              <User size={14} />
            </div>
          )}
        </div>
      ))}

      {isStreaming && (
        <div className="flex gap-4 max-w-4xl mx-auto justify-start animate-pulse">
           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-film-gold/10 border border-film-gold/30 flex items-center justify-center text-film-gold mt-1">
              <Film size={14} />
            </div>
            <div className="bg-film-panel p-4 rounded-lg border border-film-border rounded-tl-none">
                <div className="flex gap-1 items-center h-full">
                    <span className="w-1.5 h-1.5 bg-film-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <span className="w-1.5 h-1.5 bg-film-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <span className="w-1.5 h-1.5 bg-film-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
            </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};