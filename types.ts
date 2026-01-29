export enum OracleMode {
  MATERIALIST = 'MATERIALIST',
  SCHOLAR = 'SCHOLAR',
  DIRECTOR = 'DIRECTOR',
  PERSONA = 'PERSONA'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  mode?: OracleMode;
}

export interface PersonaState {
  name: string;
  isActive: boolean;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  currentMode: OracleMode | null;
  persona: PersonaState;
}