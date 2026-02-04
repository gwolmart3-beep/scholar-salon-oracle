import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { ModeSelector } from './components/ModeSelector';
import { OracleMode, Message, AppState } from './types';
import { sendMessageStream } from './services/geminiService';

function App() {
  const [state, setState] = useState<AppState>({
    messages: [{ 
      role: 'assistant', 
      content: "Greetings, Scholar. The archive is open. Which lens shall we use to view film history today?",
timestamp: new Date().toISOString() 
    }],
    currentMode: OracleMode.SCHOLAR,
    isStreaming: false,
    persona: { name: '', isActive: false }
  });

  const handleModeSelect = useCallback((mode: OracleMode) => {
    setState(prev => ({ ...prev, currentMode: mode }));
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isStreaming: true
    }));

    try {
      const stream = await sendMessageStream([...state.messages, userMessage], state.currentMode);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        setState(prev => {
          const lastMessage = prev.messages[prev.messages.length - 1];
          if (lastMessage.role === 'assistant') {
            return {
              ...prev,
              messages: [...prev.messages.slice(0, -1), { role: 'assistant', content: fullResponse }]
            };
          } else {
            return {
              ...prev,
              messages: [...prev.messages, { role: 'assistant', content: fullResponse }]
            };
          }
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  };

  return (
    <div className="min-h-screen bg-film-black text-film-white flex flex-col">
      <Header />
      <main className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-4 gap-4">
        <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2">
          <ModeSelector 
            currentMode={state.currentMode} 
            onModeSelect={handleModeSelect} 
          />
        </div>
        <div className="flex-1 flex flex-col bg-film-panel rounded-lg border border-film-border/30 overflow-hidden shadow-2xl">
          <ChatArea messages={state.messages} isStreaming={state.isStreaming} />
          <InputArea onSendMessage={handleSendMessage} disabled={state.isStreaming} />
        </div>
      </main>
      <footer className="p-2 text-center text-[10px] text-film-muted uppercase tracking-widest border-t border-film-border/10">
        Film History Oracle v1.0 • System Standby
      </footer>
    </div>
  );
}

export default App;
