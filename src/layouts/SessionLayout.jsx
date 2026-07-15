import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SessionLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative z-10 space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-3">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text text-transparent">
            AtithiSphere
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            WhatsApp-First Hotel Operations Console
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
