import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { ChatArea } from './components/ChatArea';
import { InputArea } from './components/InputArea';
import { ChatState, Message, OracleMode } from './types';
import { sendMessageStream, initializeChat } from './services/geminiService';
import { GenerateContentResponse } from '@google/genai';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isStreaming: false,
    currentMode: null,
    persona: { name: '', isActive: false }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle

  // Initialize chat session on mount
  useEffect(() => {
    initializeChat();
  }, []);

  const addMessage = (role: 'user' | 'model', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(),
      role,
      content,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  const handleModeSelect = async (mode: OracleMode, personaName?: string) => {
    // If selecting the same mode (except Persona which might change names), do nothing
    if (state.currentMode === mode && mode !== OracleMode.PERSONA) return;
    if (mode === OracleMode.PERSONA && state.persona.name === personaName) return;

    setState(prev => ({
      ...prev,
      isStreaming: true,
      currentMode: mode,
      persona: mode === OracleMode.PERSONA && personaName 
        ? { name: personaName, isActive: true } 
        : { name: '', isActive: false }
    }));

    // Construct the activation prompt
    let activationPrompt = `[SYSTEM: USER HAS ACTIVATED MODE: ${mode}].`;
    if (mode === OracleMode.PERSONA && personaName) {
      activationPrompt += ` [PERSONA IDENTITY: ${personaName}].`;
    }
    activationPrompt += ` Please strictly respond with the ${mode} activation message defined in your system instructions. Do not break character.`;

    try {
      const stream = await sendMessageStream(activationPrompt);
      
      let fullResponse = '';
      
      // Temporary message ID for streaming
      const tempId = 'streaming-' + Date.now();
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
            id: tempId,
            role: 'model',
            content: '',
            timestamp: Date.now(),
            mode: mode
        }]
      }));

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullResponse += c.text;
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === tempId ? { ...msg, content: fullResponse } : msg
            )
          }));
        }
      }
    } catch (error) {
      console.error("Failed to activate mode:", error);
      addMessage('model', "System Error: The archives are temporarily inaccessible. Please try again.");
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  };

  const handleSendMessage = async (text: string) => {
    addMessage('user', text);
    setState(prev => ({ ...prev, isStreaming: true }));

    try {
      // If persona is active, remind the model implicitly via context if needed, 
      // but the chat history should sustain it. 
      // We will rely on the maintained session context.
      
      const stream = await sendMessageStream(text);
      
      let fullResponse = '';
      const tempId = 'streaming-' + Date.now();
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
            id: tempId,
            role: 'model',
            content: '',
            timestamp: Date.now(),
            mode: state.currentMode || undefined
        }]
      }));

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            fullResponse += c.text;
            setState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                msg.id === tempId ? { ...msg, content: fullResponse } : msg
                )
            }));
        }
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      addMessage('model', "System Error: Connection disrupted.");
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-film-black text-film-text font-sans overflow-hidden">
      <Header />
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Toggle */}
        <button 
          className="md:hidden absolute top-4 left-4 z-40 p-2 bg-film-panel border border-film-border rounded shadow-lg text-film-gold"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
            {isSidebarOpen ? 'Close Menu' : 'Modes'}
        </button>

        {/* Sidebar */}
        <div className={`
          absolute inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <ModeSelector 
            currentMode={state.currentMode} 
            onSelectMode={(mode, persona) => {
              handleModeSelect(mode, persona);
              setIsSidebarOpen(false);
            }} 
            disabled={state.isStreaming}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-film-black">
          <ChatArea 
            messages={state.messages} 
            isStreaming={state.isStreaming} 
          />
          <InputArea 
            onSendMessage={handleSendMessage} 
            disabled={state.isStreaming}
            currentMode={state.currentMode}
          />
        </div>
        
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;