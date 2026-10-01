import React, { useState } from 'react';
import { Lock, Smartphone, Eye, EyeOff, LogIn, AlertCircle, Sparkles, X, ShieldCheck } from 'lucide-react';
import { authenticateCloudUser } from '@/lib/cloudProfiles';
import { UserProfile } from '@/data/profiles';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile) => void;
  onLoginSuccess?: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mobileNumber.trim() || mobileNumber.length < 11) {
      setError('Bara-e-meherbani 11-digit durust mobile number darj karein.');
      return;
    }

    if (!password) {
      setError('Password likhna lazmi hai.');
      return;
    }

    setLoading(true);
    try {
      const res = await authenticateCloudUser(mobileNumber, password);
      if (res.user) {
        if (onSuccess) onSuccess(res.user);
        if (onLoginSuccess) onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Login nahi ho saka. Mobile number ya password ghalat hai.');
      }
    } catch (err) {
      setError('Network ya server issue. Dobara koshish karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-500/20">
        
        {/* Header with Luxury Emerald / Gold Touch */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 px-6 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
                <LogIn size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                  Hamsafar Login <Sparkles size={14} className="text-amber-400" />
                </h3>
                <p className="text-[11px] text-emerald-200/80">Apne mehfooz account mein dakhil hon</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registered Mobile Number
            </label>
            <div className="relative">
              <Smartphone size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="0300 1234567"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full text-xs pl-10 pr-3 p-3 rounded-2xl border border-slate-300 font-mono focus:border-emerald-600 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password (Khufia Code)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-10 p-3 rounded-2xl border border-slate-300 focus:border-emerald-600 outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Tasdeeq ho rahi hai...</span>
            ) : (
              <>
                <LogIn size={15} />
                <span>Login Karein</span>
              </>
            )}
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Account nahi hai?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              Naya Account Banayein →
            </button>
          </div>

          <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Multi-device encrypted login. Kisi bhi phone ya laptop se access karein.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
