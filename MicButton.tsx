
import React from 'react';
import { AppState } from '../types';

interface MicButtonProps {
  appState: AppState;
  onClick: () => void;
}

const MicIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM11 5a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V5Z"></path>
        <path d="M19 10a1 1 0 0 0-2 0v1a5 5 0 0 1-10 0v-1a1 1 0 0 0-2 0v1a7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-3.08A7 7 0 0 0 19 11v-1Z"></path>
    </svg>
);

export const MicButton: React.FC<MicButtonProps> = ({ appState, onClick }) => {
  const getButtonStateClasses = () => {
    switch (appState) {
      case AppState.LISTENING:
        return 'border-red-500 shadow-[0_0_25px_5px_rgba(239,68,68,0.7)] animate-pulse';
      case AppState.PROCESSING:
        return 'border-yellow-400 shadow-[0_0_25px_5px_rgba(250,204,21,0.7)] animate-spin-slow';
      case AppState.SPEAKING:
         return 'border-cyan-400 shadow-[0_0_25px_5px_rgba(34,211,238,0.7)] animate-pulse-intense';
      case AppState.IDLE:
      default:
        return 'border-cyan-400 shadow-[0_0_20px_2px_rgba(34,211,238,0.6)] hover:shadow-[0_0_30px_8px_rgba(34,211,238,0.7)] animate-pulse-slow';
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={onClick}
        className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none border-2 ${getButtonStateClasses()}`}
        style={{
          background: 'radial-gradient(circle, rgba(2,6,23,0.8) 0%, rgba(3,7,35,0.9) 70%, rgba(14,165,233,0.3) 100%)',
        }}
      >
        <MicIcon className="w-10 h-10 md:w-12 md:h-12 text-cyan-200 transition-colors duration-300"/>
        
        {/* Decorative rings */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-cyan-700/50 animate-ping-slow opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-cyan-400/30 scale-125 animate-pulse-slow opacity-30"></div>
      </button>
      <style>{`
        @keyframes pulse-slow {
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes pulse-intense {
            0%, 100% { transform: scale(1); box-shadow: 0 0 25px 5px rgba(34, 211, 238, 0.7); }
            50% { transform: scale(1.05); box-shadow: 0 0 35px 10px rgba(34, 211, 238, 0.8); }
        }
        .animate-pulse-intense { animation: pulse-intense 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 5s linear infinite; }

        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-slow { animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};
