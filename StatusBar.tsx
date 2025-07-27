
import React, { useState, useEffect } from 'react';

const PowerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11 2.99813C11 2.44585 11.4477 2 12 2C12.5523 2 13 2.44585 13 2.99813V11.0019C13 11.5541 12.5523 12 12 12C11.4477 12 11 11.5541 11 11.0019V2.99813Z"></path>
        <path d="M12 22C16.9706 22 21 17.9706 21 13C21 10.3941 19.8353 8.08181 18.0249 6.55606C17.6215 6.22819 17.0887 6.28899 16.7608 6.69234C16.433 7.09569 16.4938 7.62849 16.8971 7.95636C18.3549 9.20653 19.1939 11.0044 19.1939 13C19.1939 16.974 15.974 20.1939 12 20.1939C8.02597 20.1939 4.8061 16.974 4.8061 13C4.8061 11.0044 5.64507 9.20653 7.10288 7.95636C7.50623 7.62849 7.56703 7.09569 7.23916 6.69234C6.91129 6.28899 6.37849 6.22819 5.97514 6.55606C4.16474 8.08181 3 10.3941 3 13C3 17.9706 7.02944 22 12 22Z"></path>
    </svg>
);


export const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full flex justify-between items-center text-xs text-cyan-400 opacity-80 px-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-red-400/50"></div>
        <span>REC</span>
      </div>
      <div className="flex items-center gap-2">
        <PowerIcon className="w-4 h-4 text-green-400" />
        <span>SYS_ONLINE</span>
      </div>
      <div className="font-bold">{formattedTime}</div>
    </div>
  );
};
