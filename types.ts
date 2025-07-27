
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
}

export enum AppState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
}
