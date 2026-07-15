import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Link to="/login" className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase hover:text-slate-750">
          <ArrowLeft size={12} /> Back to Sign In
        </Link>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">
              Reset Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-450">
                <Mail size={14} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none focus:border-teal-500 transition"
                placeholder="admin@atithisphere.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition"
          >
            Send Verification Code
          </button>
        </form>
      ) : (
        <div className="text-center py-4 space-y-3">
          <div className="mx-auto h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Verification Link Sent</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            We have dispatched a temporary login link to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>. 
            Check your spam if not received.
          </p>
        </div>
      )}
    </div>
  );
}
