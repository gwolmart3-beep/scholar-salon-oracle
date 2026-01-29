import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { OracleMode } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  currentMode: OracleMode | null;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled, currentMode }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const placeholderText = !currentMode 
    ? "Initialize a mode to begin..." 
    : "Enter your query for the archives...";

  return (
    <div className="bg-film-panel border-t border-film-border p-4 sm:p-6">
      <div className="max-w-4xl mx-auto relative">
        <div className={`
          relative rounded-xl border transition-all duration-300 bg-film-black
          ${disabled 
            ? 'border-film-border opacity-50' 
            : 'border-film-border hover:border-film-gold/50 focus-within:border-film-gold focus-within:ring-1 focus-within:ring-film-gold/20'}
        `}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || !currentMode}
            placeholder={placeholderText}
            rows={1}
            className="w-full bg-transparent text-film-text placeholder-film-muted/40 p-4 pr-12 outline-none resize-none min-h-[56px] max-h-[120px] rounded-xl font-sans"
          />
          
          <button
            onClick={handleSend}
            disabled={disabled || !input.trim() || !currentMode}
            className={`
              absolute right-2 bottom-2 p-2 rounded-lg transition-colors
              ${disabled || !input.trim() || !currentMode
                ? 'text-film-muted/30 cursor-not-allowed' 
                : 'text-film-gold hover:bg-film-gold/10 active:scale-95'}
            `}
          >
            {input.trim() ? <Send size={20} /> : <Sparkles size={20} className="opacity-50" />}
          </button>
        </div>
        
        <div className="text-center mt-2">
           <p className="text-[10px] text-film-muted/40 font-mono uppercase tracking-widest">
              {currentMode ? `Connected to: ${currentMode} Oracle` : 'System Standby'}
           </p>
        </div>
      </div>
    </div>
  );
};