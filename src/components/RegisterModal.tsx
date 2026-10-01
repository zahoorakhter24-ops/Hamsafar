import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Heart,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Smartphone,
  CheckCircle2,
  Send,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  X
} from 'lucide-react';
import { ImageAdjustModal } from './ImageAdjustModal';

// Client-side canvas image compression to keep payload small & fast (~30-50KB)
const compressImage = (file: File, maxWidth = 500, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (typeof window === 'undefined') return resolve('');
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  onSwitchToLogin?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}) => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Bunyadi Maloomat & Password
    fullName: '',
    gender: 'male' as 'male' | 'female',
    dob: '',
    age: 0,
    currentCity: 'Lahore',
    mobileNumber: '',
    password: '',

    // Step 2: Profile Photos & Quick Bio
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    hasCustomPhoto: false,
    additionalPhotos: [] as string[],
    purpose: ['rishta'] as string[],
    aboutMe: 'Hamsafar verified member looking for a sincere, family-oriented life partner.',

    agreed18Plus: true,
  });

  const [error, setError] = useState('');

  // Mobile OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [smsAlert, setSmsAlert] = useState<{ show: boolean; code: string } | null>(null);

  // Photo Adjust States
  const [adjustImageSrc, setAdjustImageSrc] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<'avatar' | 'additional'>('avatar');

  // OTP Countdown timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

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
      setError('Underage: Hamsafar sirf 18 saal ya is se baray afraad ke liye hai.');
    } else {
      setError('');
    }
  };

  const handleGenderChange = (newGender: 'male' | 'female') => {
    setFormData((prev) => ({
      ...prev,
      gender: newGender,
      avatar: prev.hasCustomPhoto
        ? prev.avatar
        : newGender === 'female'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    }));
  };

  const handleSendOtp = () => {
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 11) {
      setError('Pehle 11-digit durust Pakistani mobile number darj karein (e.g. 03001234567).');
      return;
    }
    setError('');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpCountdown(60);
    setSmsAlert({ show: true, code });
  };

  const handleVerifyOtp = () => {
    if (!enteredOtp.trim()) {
      setError('Bara-e-meherbani 4-digit OTP code enter karein.');
      return;
    }
    if (enteredOtp.trim() === generatedOtp) {
      setIsPhoneVerified(true);
      setError('');
      setSmsAlert(null);
    } else {
      setError('Ghalat OTP code! SMS notification mein diya gaya 4-digit code check karein.');
    }
  };

  const handleMainPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdjustImageSrc(event.target?.result as string);
        setAdjustTarget('avatar');
        setShowAdjustModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (formData.additionalPhotos.length >= 3) {
        setError('Aap zyada se zyada 3 additional photos add kar saktay hain.');
        return;
      }
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setAdjustImageSrc(event.target?.result as string);
        setAdjustTarget('additional');
        setShowAdjustModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdjustConfirmed = (adjustedBase64: string) => {
    if (adjustTarget === 'avatar') {
      setFormData((prev) => ({ ...prev, avatar: adjustedBase64, hasCustomPhoto: true }));
    } else {
      setFormData((prev) => ({
        ...prev,
        additionalPhotos: [...prev.additionalPhotos, adjustedBase64],
      }));
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // STEP 1 VALIDATION
    if (step === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
        setError('Bara-e-meherbani apna mukammal CNIC naam darj karein.');
        return;
      }
      if (!formData.dob || formData.age < 18) {
        setError('Aapki umar 18 saal ya is se zyada hona lazmi hai.');
        return;
      }
      if (!formData.currentCity.trim()) {
        setError('Apna mojooda sheher darj karein.');
        return;
      }
      if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 11) {
        setError('Durust 11-digit Pakistani mobile number darj karein (e.g. 03001234567).');
        return;
      }
      if (!isPhoneVerified) {
        setError('Mobile number ko OTP ke zariye verify karna lazmi hai.');
        return;
      }
      if (!formData.password || formData.password.length < 4) {
        setError('Apne account ke liye kam az kam 4-haraf ka password zaroor rakhein.');
        return;
      }
      setStep(2);
    }
    // STEP 2 VALIDATION (FINAL)
    else if (step === 2) {
      onSuccess(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] max-h-[95vh] border border-emerald-500/20">
        
        {/* Luxury Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 px-6 border-b border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xs font-black shadow-md">
                {step}/2
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                  {step === 1 ? 'Naya Account: Bunyadi Maloomat' : 'Marhala 2: Tasveer & Bio'}
                  <Sparkles size={13} className="text-amber-400" />
                </h3>
                <p className="text-[10px] text-emerald-200/80">
                  {step === 1 ? 'Shanakht, Mobile OTP aur Password' : 'Profile photo aur connection preference'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNext} className="flex-1 p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: SHANAKHT, MOBILE & PASSWORD */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mukammal Naam (As per CNIC) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Hamza Khan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jins (Gender) *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleGenderChange(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="male">Male (Mard)</option>
                    <option value="female">Female (Khatoon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tareekh-e-Pedaish (DOB 18+) *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={handleDobChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                  {formData.age > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      Age: {formData.age} Years (18+ Valid)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sheher (City of Residence) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore, Islamabad, Karachi"
                  value={formData.currentCity}
                  onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium outline-none focus:border-emerald-600"
                />
              </div>

              {/* Mobile Number & OTP Verification */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Pakistani Mobile Number (SMS OTP) *
                  </label>
                  {isPhoneVerified ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      OTP Lazmi Hai
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    disabled={isPhoneVerified}
                    placeholder="0300 1234567"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className={`flex-1 text-xs p-2.5 rounded-xl border font-mono ${
                      isPhoneVerified
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />

                  {!isPhoneVerified && (
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={handleSendOtp}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Smartphone size={13} />
                      {otpSent ? (otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Resend Code') : 'Send OTP'}
                    </button>
                  )}
                </div>

                {/* Simulated SMS Alert */}
                {smsAlert?.show && !isPhoneVerified && (
                  <div className="p-2.5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-xl shadow-md border border-emerald-500/40 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <Smartphone size={13} className="text-emerald-400 animate-pulse" />
                        🔔 SMS From &quot;HAMSAFAR&quot;
                      </span>
                      <span className="text-[10px] text-slate-300">Abhi aaya</span>
                    </div>
                    <p className="text-xs text-slate-100">
                      Aapka verification OTP code: <span className="font-mono font-black text-amber-300 tracking-widest text-sm bg-white/10 px-2 py-0.5 rounded-md ml-1">{smsAlert.code}</span>
                    </p>
                  </div>
                )}

                {/* OTP Input Box */}
                {otpSent && !isPhoneVerified && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="4-digit code"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-32 text-center font-mono font-black tracking-widest text-sm p-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>

              {/* Password Setting */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Login Password (Khufia Code) *
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Apna password rakhein (e.g. pak1234)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-xs pl-10 pr-10 p-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Is password aur mobile number se aap baad mein kisi bhi device par login kar saken ge.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE PHOTO & BIO */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Profile Photo (Main & Additional) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Profile Photos (Tasweer)
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Clear face photo preferred. Aap baad mein bhi profile se badal saktay hain.
                    </p>
                  </div>
                  {formData.hasCustomPhoto ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Photo Added
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Default Avatar
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="relative group shrink-0">
                    <img
                      src={formData.avatar}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
                    />
                    <label
                      htmlFor="main-photo-upload-step2"
                      className="absolute -bottom-1 -right-1 bg-slate-900 hover:bg-emerald-600 text-white p-1.5 rounded-xl cursor-pointer transition-colors shadow-md"
                      title="Upload new photo"
                    >
                      <Camera size={13} />
                    </label>
                    <input
                      id="main-photo-upload-step2"
                      type="file"
                      accept="image/*"
                      onChange={handleMainPhotoUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="main-photo-upload-step2"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload size={13} />
                        {formData.hasCustomPhoto ? 'Change Main Photo' : 'Upload Main Photo'}
                      </label>

                      {formData.hasCustomPhoto && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustImageSrc(formData.avatar);
                              setAdjustTarget('avatar');
                              setShowAdjustModal(true);
                            }}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                            title="Center & Adjust Karein"
                          >
                            <Sparkles size={12} className="text-amber-400" />
                            <span>Center Karein</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              avatar: prev.gender === 'female'
                                ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                                : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
                              hasCustomPhoto: false
                            }))}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
                          >
                            Reset
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Mobile camera ya gallery se tasveer select karein.
                    </p>
                  </div>
                </div>

                {/* Gallery Photos */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      Additional Photos (Optional - Max 3):
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formData.additionalPhotos.length}/3 photos
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {formData.additionalPhotos.map((photo, idx) => (
                      <div key={idx} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-300">
                        <img src={photo} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalPhoto(idx)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} className="text-rose-400" />
                        </button>
                      </div>
                    ))}

                    {formData.additionalPhotos.length < 3 && (
                      <label
                        htmlFor="additional-photo-upload-step2"
                        className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-white flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
                      >
                        <ImageIcon size={16} />
                        <span className="text-[9px] font-bold mt-0.5">+ Add</span>
                        <input
                          id="additional-photo-upload-step2"
                          type="file"
                          accept="image/*"
                          onChange={handleAdditionalPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mere Baaray Mein (Short Intro)
                </label>
                <textarea
                  rows={2}
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  placeholder="Apne baaray mein aik jumla likhein..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Family background, taleem aur hamsafar ki requirements aap login hone ke baad apni profile se mazeed detail ke sath bhar saktay hain.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer Navigation */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} /> Peechay (Back)
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              Account pehle se hai?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSwitchToLogin) onSwitchToLogin();
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Login Karein
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 flex items-center gap-2 transition-all"
          >
            {step === 1 ? (
              <>
                <span>Agla Marhala (Next)</span>
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <Check size={15} />
                <span>Account Mukammal Karein</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ImageAdjustModal
        isOpen={showAdjustModal}
        imageSrc={adjustImageSrc}
        onClose={() => setShowAdjustModal(false)}
        onConfirm={handleAdjustConfirmed}
        title={adjustTarget === 'avatar' ? 'Main Profile Photo Center Karein' : 'Additional Photo Center Karein'}
      />
    </div>
  );
};
