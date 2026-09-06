import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldAlert, 
  ArrowLeft, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export default function RegisterPage() {
  const { registerSelf } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Status states
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const newUser = {
      name,
      email,
      phone,
      password,
      role: 'Guest',
      hotelId: '',
      employeeId: 'GUEST'
    };

    const res = await registerSelf(newUser);
    setLoading(false);

    if (res.success) {
      window.location.href = '/guest'; // Direct refresh to guest dashboard
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Back Link */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-[10px] font-extrabold text-teal-650 dark:text-teal-400 hover:underline uppercase tracking-wider"
        >
          <ArrowLeft size={12} /> Back
        </Link>
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border dark:border-slate-850">
          Guest Portal Sign Up
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-[10px] text-red-500 font-bold animate-shake">
          <ShieldAlert size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-455">
              <User size={13} />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition font-semibold"
              placeholder="e.g. Suresh Mehta"
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-455">
              <Mail size={13} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition font-semibold"
              placeholder="e.g. suresh@example.com"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-455">
              <Phone size={13} />
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition font-semibold"
              placeholder="e.g. +91 99999 88888"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">
            Password Key
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-455">
              <Lock size={13} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 transition font-semibold"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-405 hover:text-slate-650"
            >
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition active:scale-[0.98] disabled:opacity-50 mt-4"
        >
          {loading ? 'Creating Guest Account...' : 'Register Stay & Enter Portal'}
        </button>
      </form>

      {/* Redirect back to Login */}
      <div className="text-center pt-2 text-[10.5px] font-semibold text-slate-450">
        Already have an account?{' '}
        <Link to="/login?type=guest" className="text-teal-655 dark:text-teal-400 hover:underline font-bold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
