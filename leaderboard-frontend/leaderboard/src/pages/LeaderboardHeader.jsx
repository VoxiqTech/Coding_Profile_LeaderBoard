import React from 'react';
import { Code2, TrendingUp } from 'lucide-react';

export const LeaderboardHeader = ({ isFormOpen, setIsFormOpen }) => (
  <div className="text-center mb-12">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Code2 className="w-12 h-12 text-indigo-600" />
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
        Coding <span className="text-indigo-600">Leaderboard</span>
      </h1>
    </div>
    <p className="text-slate-600 text-lg font-medium">Elevate your competitive programming game</p>
    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-slate-200 rounded-full">
      <TrendingUp className="w-4 h-4 text-indigo-500" />
      <span className="text-sm font-semibold text-slate-600">Board-Update every 24 hours</span>
    </div>
    <div className="mt-8 flex justify-center">
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-300"
      >
        {isFormOpen ? 'Hame nahi Matlab - Band kar do' : 'Apna Level Jano - Join Karo'}
      </button>
    </div>
  </div>
);