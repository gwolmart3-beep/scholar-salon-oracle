import React, { useState } from 'react';
import { OracleMode } from '../types';
import { MODE_DESCRIPTIONS } from '../constants';
import { Wrench, BookOpen, Video, User } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: OracleMode | null;
  onSelectMode: (mode: OracleMode, personaName?: string) => void;
  disabled: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode, disabled }) => {
  const [personaName, setPersonaName] = useState('');
  const [showPersonaInput, setShowPersonaInput] = useState(false);

  const handleModeClick = (mode: OracleMode) => {
    if (disabled) return;
    
    if (mode === OracleMode.PERSONA) {
      setShowPersonaInput(true);
    } else {
      setShowPersonaInput(false);
      onSelectMode(mode);
    }
  };

  const handlePersonaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personaName.trim()) {
      onSelectMode(OracleMode.PERSONA, personaName);
      setPersonaName('');
      setShowPersonaInput(false);
    }
  };

  const modes = [
    {
      id: OracleMode.MATERIALIST,
      label: 'The Materialist',
      icon: Wrench,
      desc: MODE_DESCRIPTIONS.MATERIALIST,
      color: 'text-blue-400',
    },
    {
      id: OracleMode.SCHOLAR,
      label: 'The Scholar',
      icon: BookOpen,
      desc: MODE_DESCRIPTIONS.SCHOLAR,
      color: 'text-purple-400',
    },
    {
      id: OracleMode.DIRECTOR,
      label: 'The Director',
      icon: Video,
      desc: MODE_DESCRIPTIONS.DIRECTOR,
      color: 'text-emerald-400',
    },
    {
      id: OracleMode.PERSONA,
      label: 'The Persona',
      icon: User,
      desc: MODE_DESCRIPTIONS.PERSONA,
      color: 'text-film-gold',
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-film-panel border-r border-film-border h-full overflow-y-auto w-full md:w-80 flex-shrink-0">
      <h2 className="text-xs font-bold text-film-muted uppercase tracking-widest mb-2">
        Operational Modes
      </h2>
      
      <div className="flex flex-col gap-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode.id)}
            disabled={disabled}
            className={`
              relative group flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 text-left
              ${currentMode === mode.id 
                ? 'bg-gradient-to-r from-film-gold/15 to-transparent border-film-gold shadow-[0_0_25px_-5px_rgba(197,160,89,0.3)] translate-x-1' 
                : 'bg-film-dark border-film-border hover:border-film-muted/50 hover:bg-film-border/20 hover:translate-x-1'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className={`mt-0.5 transition-colors duration-300 ${currentMode === mode.id ? 'text-film-gold drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]' : 'text-film-muted group-hover:text-film-text'}`}>
              <mode.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-serif font-bold text-sm transition-colors duration-300 ${currentMode === mode.id ? 'text-film-white' : 'text-film-text'}`}>
                {mode.label}
              </h3>
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${currentMode === mode.id 
                    ? 'max-h-24 opacity-100' 
                    : 'max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100'}
                `}
              >
                <p className="text-xs text-film-muted leading-relaxed pt-2">
                  {mode.desc}
                </p>
              </div>
            </div>
            
            {/* Active Indicator */}
            {currentMode === mode.id && (
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-film-gold animate-pulse shadow-[0_0_5px_rgba(197,160,89,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {showPersonaInput && (
        <div className="mt-2 p-5 bg-film-black border border-film-gold/30 rounded-lg animate-fade-in shadow-xl shadow-black/50">
          <form onSubmit={handlePersonaSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-film-gold mb-2 font-bold">
                Identity
              </label>
              <input
                type="text"
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
                placeholder="e.g. Fritz Lang, Hitchcock..."
                className="w-full bg-film-panel border border-film-border rounded-md px-3 py-2 text-sm text-film-white font-serif placeholder:font-sans placeholder:text-film-muted/50 placeholder:italic focus:outline-none focus:border-film-gold focus:ring-1 focus:ring-film-gold/20 transition-all duration-200"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 items-center">
              <button
                type="button"
                onClick={() => setShowPersonaInput(false)}
                className="text-[10px] uppercase tracking-wider text-film-muted hover:text-film-white transition-colors py-1.5 px-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!personaName.trim()}
                className="bg-film-gold text-film-black text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-sm hover:bg-film-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-film-gold/20"
              >
                Summon
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-film-border/30">
        <p className="text-[10px] text-film-muted/60 text-center font-serif italic">
          Select a mode to initialize the Oracle's perspective.
        </p>
      </div>
    </div>
  );
};