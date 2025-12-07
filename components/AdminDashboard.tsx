import React, { useState, useEffect } from 'react';
import { AppStep, HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/historyService';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setHistory(getHistory());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock password
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Wrong Password');
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-slate-800 rounded-2xl border border-slate-700 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter PIN (admin123)"
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 bg-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Analysis History</h2>
        <div className="space-x-2">
          <button 
            onClick={handleClear}
            className="px-3 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900 border border-red-800"
          >
            Clear Data
          </button>
          <button 
            onClick={onBack}
            className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600"
          >
            Exit Admin
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-slate-200 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">User/Target</th>
                <th className="px-4 py-3">Handle</th>
                <th className="px-4 py-3">Forecast</th>
                <th className="px-4 py-3">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 italic">
                    No history found yet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.timestamp)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span>{item.input.userGender === 'Male' ? '👨' : '👩'} (You)</span>
                        <span>{item.input.targetGender === 'Male' ? '👨' : '👩'} (Them)</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-indigo-300">@{item.input.personBHandle}</td>
                    <td className="px-4 py-3 text-white">
                      {item.result.relationshipForecast}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        item.result.confidenceScore > 80 ? 'bg-green-900 text-green-300' : 
                        item.result.confidenceScore > 50 ? 'bg-yellow-900 text-yellow-300' : 
                        'bg-red-900 text-red-300'
                      }`}>
                        {item.result.confidenceScore}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};