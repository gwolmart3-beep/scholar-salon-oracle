import React from 'react';
import { Film } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-film-border bg-film-black/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-film-gold text-film-black p-1.5 rounded-sm">
            <Film size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-['Cinzel'] tracking-tight text-film-white">
              Film History Oracle
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-film-gold font-medium">
              Film History I (1895-1950)
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-film-muted text-xs font-serif italic">
            "The cinema is truth 24 times a second."
          </span>
        </div>
      </div>
    </header>
  );
};
