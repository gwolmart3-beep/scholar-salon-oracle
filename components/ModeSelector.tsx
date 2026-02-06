import React from 'react';
import { Wrench, BookOpen, Video, User } from 'lucide-react';
import { OracleMode } from '../types';
import { MODE_DESCRIPTIONS } from '../constants';

interface ModeSelectorProps {
  currentMode: OracleMode;
  onModeSelect: (mode: OracleMode) => void;
}

const modes = [
  {
    id: OracleMode.MATERIALIST,
    label: 'The Materialist',
    icon: Wrench,
    desc: MODE_DESCRIPTIONS.MATERIALIST,
    color: "font-mono border-slate-500 bg-slate-500/10 text-slate-300 shadow-[0_0_15px_rgba(112,128,144,0.3)]",
  },
  {
    id: OracleMode.SCHOLAR,
    label: 'The Scholar',
    icon: BookOpen,
    desc: MODE_DESCRIPTIONS.SCHOLAR,
    color: "font-['Crimson_Pro'] border-yellow-600 bg-yellow-600/10 text-yellow-400 shadow-[0_0_20px_rgba(212,175,55,0.5)]",
  },
  {
    id: OracleMode.DIRECTOR,
    label: 'The Director',
    icon: Video,
    desc: MODE_DESCRIPTIONS.DIRECTOR,
    color: "font-['Bebas_Neue'] uppercase tracking-widest border-red-700 bg-red-800/20 text-red-500 shadow-[0_0_25px_rgba(220,38,38,0.6)]",
  },
  {
    id: OracleMode.PERSONA,
    label: 'The Persona',
    icon: User,
    desc: MODE_DESCRIPTIONS.PERSONA,
    color: "font-['Courier_Prime'] italic border-amber-900 bg-amber-950/30 text-amber-700 shadow-[0_0_15px_rgba(120,53,15,0.4)]",
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeSelect }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-film-panel/50 rounded-lg border border-film-border/30">
      <h2 className="text-[10px] uppercase tracking-widest font-bold text-film-muted mb-2 font-['Cinzel']">Operational Modes</h2>
      <div className="flex flex-col gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={`flex items-center gap-3 p-3 rounded-md border transition-all duration-300 text-left group
                ${isActive ? mode.color : 'border-transparent bg-transparent text-film-muted hover:bg-white/5'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-current' : 'text-film-muted group-hover:text-film-white'}`} />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{mode.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
