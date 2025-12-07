import React, { useState } from 'react';
import { Header } from './components/Header';
import { Disclaimer } from './components/Disclaimer';
import { ResultCard } from './components/ResultCard';
import { AdminDashboard } from './components/AdminDashboard';
import { LandingPage } from './components/LandingPage';
import { analyzeSocialSignals } from './services/geminiService';
import { saveHistory } from './services/historyService';
import { AppStep, UserInput, AnalysisResult } from './types';

// Icons
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const VIBE_OPTIONS = [
  { label: "Aesthetic", emoji: "📸" },
  { label: "Gym Rat", emoji: "🏋️" },
  { label: "Career", emoji: "💼" },
  { label: "Travel", emoji: "✈️" },
  { label: "Foodie", emoji: "🍜" },
  { label: "Gamer", emoji: "🎮" },
  { label: "Pet Lover", emoji: "🐈" },
  { label: "Spiritual", emoji: "🔮" },
  { label: "Party", emoji: "💃" },
  { label: "Private", emoji: "🤫" },
  { label: "Funny", emoji: "😂" },
  { label: "Tech", emoji: "💻" },
];

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [input, setInput] = useState<UserInput>({
    userGender: 'Male',
    targetGender: 'Female',
    personBHandle: '',
    selectedVibes: []
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof UserInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const toggleVibe = (vibe: string) => {
    setInput(prev => {
      const exists = prev.selectedVibes.includes(vibe);
      if (exists) {
        return { ...prev, selectedVibes: prev.selectedVibes.filter(v => v !== vibe) };
      }
      if (prev.selectedVibes.length >= 5) return prev; // Limit to 5
      return { ...prev, selectedVibes: [...prev.selectedVibes, vibe] };
    });
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.personBHandle.trim()) {
      setError("Please handle enter karein!");
      return;
    }
    if (input.selectedVibes.length === 0) {
      setError("Kam se kam ek vibe select karein.");
      return;
    }
    
    setError('');
    setStep(AppStep.ANALYZING);
    
    // Call the service with genders
    const data = await analyzeSocialSignals(
      input.userGender,
      input.targetGender,
      input.personBHandle, 
      input.selectedVibes
    );

    // Save to history if successful
    if (data && !data.safetyFlag) {
      saveHistory(input, data);
    }

    setResult(data);
    setStep(AppStep.RESULT_BASIC);
  };

  const handleDetailedUpgrade = () => {
    setStep(AppStep.PAYMENT_GATEWALL);
    setTimeout(() => {
      setStep(AppStep.RESULT_DETAILED);
    }, 1500);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setInput({ userGender: 'Male', targetGender: 'Female', personBHandle: '', selectedVibes: [] });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center pb-12 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Show Header on all pages except Landing (Landing has its own title) */}
      {step !== AppStep.LANDING && <Header />}

      <main className="w-full max-w-lg px-6 flex-grow flex flex-col justify-center">
        
        {step === AppStep.LANDING && (
          <LandingPage onStart={() => setStep(AppStep.INPUT)} />
        )}

        {step === AppStep.INPUT && (
          <form onSubmit={handleAnalyze} className="space-y-8 animate-fade-in pt-6">
            
            {/* Person Inputs */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-5 shadow-xl backdrop-blur-sm">
              
              {/* Gender Selection Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                    Aapka Gender
                  </label>
                  <div className="flex flex-col gap-2">
                     <button
                       type="button"
                       onClick={() => handleInputChange('userGender', 'Male')}
                       className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                         input.userGender === 'Male' 
                           ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                           : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                       }`}
                     >
                       Ladka 👨
                     </button>
                     <button
                       type="button"
                       onClick={() => handleInputChange('userGender', 'Female')}
                       className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                         input.userGender === 'Female' 
                           ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                           : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                       }`}
                     >
                       Ladki 👩
                     </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
                    Uska Gender
                  </label>
                  <div className="flex flex-col gap-2">
                     <button
                       type="button"
                       onClick={() => handleInputChange('targetGender', 'Male')}
                       className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                         input.targetGender === 'Male' 
                           ? 'bg-pink-600 border-pink-500 text-white shadow-md' 
                           : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                       }`}
                     >
                       Ladka 👨
                     </button>
                     <button
                       type="button"
                       onClick={() => handleInputChange('targetGender', 'Female')}
                       className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                         input.targetGender === 'Female' 
                           ? 'bg-pink-600 border-pink-500 text-white shadow-md' 
                           : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                       }`}
                     >
                       Ladki 👩
                     </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
                  Unka Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500 font-bold">@</span>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-white placeholder-slate-600"
                    placeholder="insta_handle"
                    value={input.personBHandle}
                    onChange={(e) => handleInputChange('personBHandle', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Vibe Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 text-center">
                Unka interest kisame hai <span className="text-slate-600 font-normal normal-case">(Pick up to 5)</span>
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {VIBE_OPTIONS.map((vibe) => {
                  const isSelected = input.selectedVibes.includes(vibe.label);
                  return (
                    <button
                      key={vibe.label}
                      type="button"
                      onClick={() => toggleVibe(vibe.label)}
                      className={`
                        relative py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border
                        flex flex-col items-center justify-center gap-1
                        ${isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50 scale-105' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                        }
                      `}
                    >
                      <span className="text-xl filter drop-shadow-md">{vibe.emoji}</span>
                      <span>{vibe.label}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-900/20 transform transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                <SparkleIcon />
                <span>Janiye Wo Kya Sochte Hain</span>
              </div>
            </button>
            
            <p className="text-[10px] text-center text-slate-500">
              Analysis based on probabilistic AI models • Sirf Masti Ke Liye
            </p>
          </form>
        )}

        {step === AppStep.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-24 animate-pulse space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full animate-spin blur-md opacity-50 absolute inset-0"></div>
              <div className="w-20 h-20 bg-slate-900 border-2 border-slate-700 rounded-full relative z-10 flex items-center justify-center">
                 <span className="text-3xl animate-bounce">🎨</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                Vibe Check Ho Raha Hai...
              </h3>
              <p className="text-sm text-slate-400 mt-2">Connecting to universe ✨</p>
            </div>
            
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 animate-loading-bar"></div>
            </div>
          </div>
        )}

        {step === AppStep.PAYMENT_GATEWALL && (
           <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
             <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <p className="text-2xl font-bold text-white mb-2">Report Khul Gaya!</p>
             <p className="text-slate-400">Gehri baatein load ho rahi hain...</p>
           </div>
        )}

        {(step === AppStep.RESULT_BASIC || step === AppStep.RESULT_DETAILED) && result && (
          <ResultCard 
            result={result} 
            isDetailed={step === AppStep.RESULT_DETAILED}
            onUpgrade={handleDetailedUpgrade}
            onReset={handleReset}
            personBName={input.personBHandle}
          />
        )}
        
        {step === AppStep.ADMIN_LOGIN && (
          <AdminDashboard onBack={() => setStep(AppStep.INPUT)} />
        )}
        
        {step !== AppStep.ADMIN_LOGIN && step !== AppStep.ADMIN_DASHBOARD && step !== AppStep.LANDING && (
          <Disclaimer />
        )}

      </main>

      {/* Admin Access Button (Hidden in plain sight) */}
      {(step === AppStep.INPUT || step === AppStep.LANDING) && (
        <button 
          onClick={() => setStep(AppStep.ADMIN_LOGIN)}
          className="absolute bottom-2 right-2 p-2 text-slate-800 hover:text-slate-700 transition-colors"
          title="Admin Access"
        >
          <LockIcon />
        </button>
      )}
      
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          100% { width: 100%; transform: translateX(0%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default App;