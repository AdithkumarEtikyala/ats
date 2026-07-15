import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('superadmin@atithisphere.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Back to Home Button */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-[10px] font-extrabold text-teal-650 dark:text-teal-400 hover:underline uppercase tracking-wider"
        >
          <ArrowLeft size={12} /> Back to Home
        </Link>
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border dark:border-slate-850">
          Console Login
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] text-red-500 font-bold animate-shake">
          <ShieldAlert size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-450">
              <Mail size={14} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition font-semibold"
              placeholder="Enter email address..."
              required
            />
          </div>
        </div>

        {/* Password Key */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              Password Key
            </label>
            <Link to="/forgot-password" className="text-[10px] text-teal-655 dark:text-teal-400 hover:underline font-bold">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-450">
              <Lock size={14} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition font-semibold"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-405 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-[10.5px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-350 dark:border-slate-800 text-teal-650 focus:ring-teal-500 accent-teal-600 h-3.5 w-3.5"
            />
            <span>Remember this device</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition active:scale-[0.98]"
        >
          Sign In to Operations
        </button>
      </form>
    </div>
  );
}
