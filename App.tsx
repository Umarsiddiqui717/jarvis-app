
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BackgroundParticles } from './components/BackgroundParticles';
import { MicButton } from './components/MicButton';
import { MessageDisplay } from './components/MessageDisplay';
import { StatusBar } from './components/StatusBar';
import { useSpeech } from './hooks/useSpeech';
import { processQuery } from './services/jarvisService';
import { AppState, Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [statusText, setStatusText] = useState<string>("Tap the orb to speak");
  const lastSpokenMessageId = useRef<string | null>(null);

  const handleAiResponse = (response: { text: string; isFinal?: boolean }) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.sender === 'jarvis' && !response.isFinal) {
        // Update the last message if it's a streaming response
        const updatedMessages = [...prev.slice(0, -1)];
        updatedMessages.push({ ...lastMessage, text: lastMessage.text + response.text });
        return updatedMessages;
      } else {
         // Add a new message
        return [...prev, { id: `jarvis-${Date.now()}`, text: response.text, sender: 'jarvis' }];
      }
    });
  };

  const { isListening, transcript, startListening, stopListening } = useSpeech();

  const handleUserInput = useCallback(async (query: string) => {
    if (!query) return;
    stopListening();
    setAppState(AppState.PROCESSING);
    setStatusText("Thinking...");
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, text: query, sender: 'user' }]);
    
    await processQuery(query, handleAiResponse);

    setAppState(AppState.SPEAKING);
  }, [stopListening]);

  useEffect(() => {
    if (transcript) {
      handleUserInput(transcript);
    }
  }, [transcript, handleUserInput]);

  useEffect(() => {
    if (isListening) {
      setAppState(AppState.LISTENING);
      setStatusText("Listening...");
    } else if (appState === AppState.LISTENING) {
      setAppState(AppState.IDLE);
      setStatusText("Tap the orb to speak");
    }
  }, [isListening, appState]);
  
  const speakNextMessage = useCallback(() => {
    const nextMessage = messages.find(
      (msg) => msg.sender === 'jarvis' && msg.id !== lastSpokenMessageId.current
    );

    if (nextMessage) {
      lastSpokenMessageId.current = nextMessage.id;
      const utterance = new SpeechSynthesisUtterance(nextMessage.text);
      
      const voices = window.speechSynthesis.getVoices();
      // Prefer a male, non-local voice if available.
      let selectedVoice = voices.find(v => v.name === 'Google UK English Male') || voices.find(v => v.name === 'Daniel') || voices.find(v => v.lang === 'en-GB' && v.name.includes('Male')) || null;
      if (!selectedVoice) {
         selectedVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Male')) || voices[0];
      }
      utterance.voice = selectedVoice;
      utterance.pitch = 0.8;
      utterance.rate = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setAppState(AppState.IDLE);
        setStatusText("Tap the orb to speak");
        speakNextMessage(); // Check for more messages to speak
      };

      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    }
  }, [messages]);

  useEffect(() => {
    if (appState === AppState.SPEAKING) {
      speakNextMessage();
    }
  }, [appState, messages, speakNextMessage]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white font-mono overflow-hidden">
      <BackgroundParticles />
      <div className="relative z-10 flex flex-col h-screen p-4 md:p-6">
        <StatusBar />
        <div className="flex-grow flex items-center justify-center">
            <MessageDisplay messages={messages} />
        </div>
        <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-4">
          <MicButton appState={appState} onClick={handleMicClick} />
          <p className="text-sm text-cyan-300 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] transition-opacity duration-300">
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
