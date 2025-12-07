import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-10 animate-fade-in">
      
      {/* Hero Title Section */}
      <div className="relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 blur-[60px] rounded-full -z-10"></div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white mb-2 drop-shadow-2xl">
          What They
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Might Think
          </span>
        </h1>
        <p className="text-sm font-mono text-indigo-300 tracking-[0.3em] uppercase opacity-80 mt-4">
          Social Signal Decoder
        </p>
      </div>
      
      {/* Description */}
      <div className="max-w-xs md:max-w-md mx-auto space-y-6">
        <p className="text-slate-300 text-lg leading-relaxed font-light">
          Are you overthinking it? Let AI do it for you.
          <br />
          We analyze vibes, genders, and social signals to predict their <strong>thoughts</strong> and your <strong>future</strong>.
        </p>

        {/* Floating Icons */}
        <div className="flex justify-center gap-8 text-3xl opacity-90 py-4">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>🕵️‍♀️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>💭</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🔮</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-slate-800 border border-slate-600 rounded-full focus:outline-none hover:bg-slate-700 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-95"
      >
        <span className="text-lg mr-2">Start Analysis</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:translate-x-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>

      <p className="text-[10px] text-slate-600 uppercase tracking-widest pt-10">
        Entertainment Purposes Only
      </p>
    </div>
  );
};