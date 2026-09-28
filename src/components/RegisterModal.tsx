import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Heart, AlertCircle, ArrowRight, Check } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'male',
    dob: '',
    age: 0,
    city: 'Lahore',
    country: 'Pakistan',
    mobileNumber: '',
    purpose: [] as string[],
    profession: '',
    education: '',
    agreed18Plus: false,
    agreedTerms: false,
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculateAge = (dobString: string) => {
    const birthday = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    const age = calculateAge(dob);
    setFormData((prev) => ({ ...prev, dob, age }));
    if (age < 18) {
      setError('Underage restriction: Hamsafar is strictly 18+ only. Minors cannot register.');
    } else {
      setError('');
    }
  };

  const handlePurposeToggle = (purposeKey: string) => {
    setFormData((prev) => {
      const exists = prev.purpose.includes(purposeKey);
      if (exists) {
        return { ...prev, purpose: prev.purpose.filter((p) => p !== purposeKey) };
      } else {
        return { ...prev, purpose: [...prev.purpose, purposeKey] };
      }
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError('Please enter your full legal name');
        return;
      }
      if (!formData.dob || formData.age < 18) {
        setError('You must be 18 years or older to join Hamsafar.');
        return;
      }
      if (!formData.mobileNumber.trim()) {
        setError('Please provide a valid Pakistani mobile number for verification.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (formData.purpose.length === 0) {
        setError('Please select at least one connection purpose (Rishta or Friendship).');
        return;
      }
      if (!formData.profession || !formData.education) {
        setError('Please enter your education and current profession.');
        return;
      }
      setError('');
      setStep(3);
    } else if (step === 3) {
      if (!formData.agreed18Plus || !formData.agreedTerms) {
        setError('Please accept safety guidelines and 18+ declaration.');
        return;
      }
      // Register success
      onSuccess(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Top Progress bar */}
        <div className="bg-slate-50 border-b border-slate-200/80 p-5 pb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Step {step} of 3</span>
            <span className="text-emerald-700 font-bold">
              {step === 1 && 'Basic Identity & Age Check'}
              {step === 2 && 'Purpose & Profile Details'}
              {step === 3 && 'Verification & Safety Commitment'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNext} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Basic & Age */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (As per CNIC)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Zeeshan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth (18+ strictly)
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={handleDobChange}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                  {formData.age > 0 && (
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                      Age confirmed: {formData.age} years old
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (For OTP)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Purpose & Bio */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Your Connection Purpose (Both allowed)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handlePurposeToggle('rishta')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all ${
                      formData.purpose.includes('rishta')
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>💍 Serious Rishta</span>
                      {formData.purpose.includes('rishta') && (
                        <Check size={16} className="text-emerald-600 ml-auto" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Looking for marriage matching with family & representative options.
                    </p>
                  </div>

                  <div
                    onClick={() => handlePurposeToggle('friendship')}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all ${
                      formData.purpose.includes('friendship')
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>🤝 Verified Friendship</span>
                      {formData.purpose.includes('friendship') && (
                        <Check size={16} className="text-emerald-600 ml-auto" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Professional networking, shared intellectual interests & peer discussions.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profession / Occupation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical Engineer / Teacher / Business"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Education Degree & Institution
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BS Computer Science (FAST Lahore)"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Terms & Final Commitments */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="text-emerald-700" size={18} />
                  Safe Conduct Guarantee
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Hamsafar is designed on dignity, safety, and mutual respect. Misbehavior, harassment, financial solicitations (asking for money/loans), or fake profiles lead to instant permanent restriction.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreed18Plus}
                    onChange={(e) => setFormData({ ...formData, agreed18Plus: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 leading-normal">
                    I solemnly confirm that I am <strong>18 years of age or older</strong>, and all submitted information matches my official national documents.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedTerms}
                    onChange={(e) => setFormData({ ...formData, agreedTerms: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 leading-normal">
                    I agree to the Hamsafar Safety Guidelines, Anti-Scam policy, and understand that verification officers may request CNIC and selfie confirmation.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Buttons Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              {step === 3 ? 'Complete Registration' : 'Continue'}
              <ArrowRight size={14} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
