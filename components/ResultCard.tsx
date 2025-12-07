import React from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  isDetailed: boolean;
  onUpgrade: () => void;
  onReset: () => void;
  personBName: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  isDetailed, 
  onUpgrade, 
  onReset,
  personBName
}) => {
  
  if (result.safetyFlag) {
    return (
      <div className="w-full max-w-md mx-auto bg-red-900/20 border border-red-500 p-6 rounded-2xl text-center">
        <h3 className="text-red-400 font-bold text-xl mb-2">Arre Re!</h3>
        <p className="text-slate-300">Ye account thoda risky lag raha hai. Hum isse check nahi kar sakte.</p>
        <button onClick={onReset} className="mt-4 px-4 py-2 bg-slate-700 rounded-lg text-white">Dusra Try Karein</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in-up">
      {/* Main Signal Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-indigo-500"></div>
        
        <div className="p-6 pb-8">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Vibe Kya Hai</p>
              <h2 className="text-2xl font-bold text-white mt-1 capitalize truncate max-w-[200px]">{personBName}</h2>
            </div>
            <div className="text-center bg-slate-700/50 p-2 rounded-xl min-w-[60px]">
              <span className="block text-3xl">{result.toneEmoji}</span>
              <span className="text-[10px] text-slate-300 uppercase font-bold">{result.tone}</span>
            </div>
          </div>

          {/* Generated Image */}
          {result.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-slate-600/50 shadow-lg relative group">
              <img 
                src={result.imageUrl} 
                alt="AI Vibe Visualization" 
                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-md text-[10px] text-white backdrop-blur-sm">
                AI Generated
              </div>
            </div>
          )}

          {/* Relationship Forecast (New Section) */}
          {result.relationshipForecast && (
            <div className="mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl p-3 text-center">
              <p className="text-xs text-pink-300 uppercase font-bold mb-1">Aage Ka Scene</p>
              <p className="text-white font-semibold text-lg drop-shadow-md">
                {result.relationshipForecast}
              </p>
            </div>
          )}

          {/* Confidence Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Yakeen (Confidence)</span>
              <span>{result.confidenceScore}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${result.confidenceScore}%` }}
              ></div>
            </div>
          </div>

          {/* Thoughts (Simple & Direct) */}
          <div className="mb-6">
             <h3 className="text-sm font-semibold text-purple-400 mb-3 uppercase tracking-wide">Dil Ki Baat (Thoughts)</h3>
             <div className="space-y-3">
               {result.possibleThoughts.map((thought, idx) => (
                 <div key={idx} className="bg-slate-700/50 p-3 rounded-tr-2xl rounded-tl-2xl rounded-br-2xl rounded-bl-none text-slate-200 text-sm font-medium italic relative">
                    "{thought}"
                 </div>
               ))}
             </div>
          </div>

          {/* Detailed Report Section (Locked/Unlocked) */}
          <div className={`mt-6 pt-6 border-t border-slate-700 ${!isDetailed ? 'blur-sm select-none opacity-50' : ''}`}>
             <h3 className="text-sm font-semibold text-green-400 mb-2 uppercase tracking-wide">Asli Sach (Verdict)</h3>
             <p className="text-slate-300 text-lg font-medium leading-relaxed font-serif italic text-center">
               "{result.detailedAnalysis || "Hidden."}"
             </p>
          </div>
          
          {/* Overlay for Locked State */}
          {!isDetailed && (
             <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent flex flex-col items-center justify-end pb-6">
                <button 
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <span>🔓 Sach Janiye</span>
                  <span className="bg-black/20 px-2 py-0.5 rounded text-xs">₹20</span>
                </button>
             </div>
          )}
        </div>
      </div>

      <div className="text-center pt-4">
        <button onClick={onReset} className="text-slate-400 text-sm hover:text-white underline">
          Check Someone Else
        </button>
      </div>
    </div>
  );
};
