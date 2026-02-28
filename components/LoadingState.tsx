import React, { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  "INITIALIZING CORE VECTORS...",
  "DECONSTRUCTING MARKET DATA...",
  "OPTIMIZING SALES ANGLES...",
  "CALIBRATING RESPONSIVENESS...",
  "FORMULATING LAUNCH BLUEPRINT...",
  "SYNTHESIZING CONVERSION TRIGGERS...",
  "FINALIZING OUTPUT..."
];

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 w-full">
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-[8px] border-white/10"></div>
        <div className="absolute inset-0 border-[8px] border-white border-t-transparent animate-spin"></div>
      </div>
      <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase animate-pulse">Processing</h3>
      <p className="text-white/60 text-xl font-mono tracking-widest uppercase">
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingState;