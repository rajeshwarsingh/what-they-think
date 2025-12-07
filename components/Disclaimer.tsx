import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mt-6 text-xs text-slate-400 text-center">
      <p>
        <strong className="text-slate-300">Disclaimer:</strong> This is an AI-generated probabilistic summary for entertainment purposes only. 
        It is not a statement of fact or a real psychological assessment. 
        Only use public data. Do not use for harassment.
      </p>
    </div>
  );
};
