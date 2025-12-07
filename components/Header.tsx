import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        What They Might Think
      </h1>
      <p className="text-slate-400 text-sm mt-2">
        AI-Powered Social Signal Decoder
      </p>
    </header>
  );
};
