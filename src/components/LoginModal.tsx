import React, { useState } from 'react';
import { LogIn, Lock, Smartphone, Mail, AlertCircle, X, ShieldCheck, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Bara-e-meherbani Mobile/Email aur Password darj karein.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Check if user exists in saved storage
      const savedUserStr = localStorage.getItem('hamsafar_current_user');
      let userObj = savedUserStr ? JSON.parse(savedUserStr) : null;

      if (!userObj) {
        // Fallback demo user
        userObj = {
          id: 'user-logged-in',
          name: identifier.includes('@') ? identifier.split('@')[0] : 'Syed Hamza Ali',
          age: 28,
          gender: 'male',
          city: 'Lahore',
          country: 'Pakistan',
          profession: 'Senior Software Engineer',
          education: 'MS Computer Science',
          languages: ['Urdu', 'English'],
          purpose: ['rishta'],
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          about: 'Welcome back to Hamsafar.',
          badges: {
            mobileVerified: true,
            identityVerified: true,
            photoVerified: true,
            familyVerified: false,
            noActiveRestrictions: true,
          },
        };
      }

      onLoginSuccess(userObj);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-900 text-sm">
              Login to Hamsafar Account
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          <div className="text-center pb-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
              <ShieldCheck size={26} />
            </div>
            <h4 className="font-bold text-base text-slate-900">Welcome Back</h4>
            <p className="text-xs text-slate-500">
              Apne Mehram & Verified Rishta Network mein wapis aayein.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Number ya Email
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                required
                placeholder="0300 1234567 ya user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('OTP reset link will be sent to your verified mobile number.')}
                className="text-[11px] text-emerald-700 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Account...' : 'Sign In Safely'}
            </button>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
            Hamsafar par account nahi hai?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="font-bold text-emerald-700 hover:underline"
            >
              Naya Account Banayein
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
