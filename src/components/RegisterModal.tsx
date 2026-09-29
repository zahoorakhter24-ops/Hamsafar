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
  GraduationCap,
  Users,
  Home,
  BookOpen,
  Smartphone,
  CheckCircle2,
  Send,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

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
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Bunyadi Maloomat
    fullName: '',
    gender: 'male' as 'male' | 'female',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    hasCustomPhoto: false,
    additionalPhotos: [] as string[],
    dob: '',
    age: 0,
    currentCity: 'Lahore',
    nativeCity: '',
    country: 'Pakistan',
    religion: 'Islam (Practicing)',
    languages: ['Urdu', 'English'],
    mobileNumber: '',
    purpose: ['rishta'] as string[],
    seriousnessLevel: 'Marriage کے لیے serious',

    // Step 2: Marital Status & Family Background
    maritalStatus: 'Never Married',
    hasChildren: false,
    childrenCount: 0,
    familyType: 'Nuclear Family',
    fatherStatus: 'Alive (Working/Retired)',
    motherStatus: 'Alive (Homemaker)',
    brothersCount: 1,
    brothersMarried: 0,
    sistersCount: 1,
    sistersMarried: 0,
    livingArrangementPreference: 'Flexible',

    // Step 3: Education & Career
    educationLevel: 'Bachelor\'s',
    degreeField: 'Computer Science / Engineering',
    institution: '',
    profession: 'Software Engineer / IT Professional',
    jobType: 'Job',
    incomeRange: '100k - 250k PKR',
    aboutMe: '',

    // Step 4: Partner Requirements (Mandatory)
    partnerAgeMin: 22,
    partnerAgeMax: 29,
    partnerMaritalStatus: 'Never Married',
    partnerMinEducation: 'Bachelor\'s',
    partnerCity: 'Lahore, Islamabad or Anywhere in Pakistan',
    relocationWillingness: 'Maybe',
    smokingPreference: 'Must not smoke',
    dealBreakers: 'Smoking, Dishonesty, Bad temper',
    idealPartnerSummary: '',

    agreed18Plus: false,
    agreedTerms: false,
  });

  const [error, setError] = useState('');

  // Mobile OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [smsAlert, setSmsAlert] = useState<{ show: boolean; code: string } | null>(null);

  // OTP Countdown timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleSendOtp = () => {
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 11) {
      setError('Pehle 11-digit durust Pakistani mobile number darj karein (e.g. 03001234567).');
      return;
    }
    setError('');
    // Generate realistic 4-digit OTP
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
      setError('Ghalat OTP code! Bara-e-meherbani SMS notification mein diya gaya 4-digit code check karein.');
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
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    }));
  };

  const handleMainPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImage(e.target.files[0], 500, 0.75);
        setFormData((prev) => ({ ...prev, avatar: compressed, hasCustomPhoto: true }));
      } catch (err) {
        setError('Tasveer upload karne mein masla hua. Dobara try karein.');
      }
    }
  };

  const handleAdditionalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (formData.additionalPhotos.length >= 3) {
        setError('Aap zyada se zyada 3 additional photos add kar saktay hain.');
        return;
      }
      try {
        const compressed = await compressImage(e.target.files[0], 500, 0.75);
        setFormData((prev) => ({
          ...prev,
          additionalPhotos: [...prev.additionalPhotos, compressed],
        }));
      } catch (err) {
        setError('Tasveer upload karne mein masla hua.');
      }
    }
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhotos: prev.additionalPhotos.filter((_, i) => i !== index),
    }));
  };

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
      setError('Underage: Hamsafar is strictly 18+ only. Minors cannot register.');
    } else {
      setError('');
    }
  };

  const handlePurposeToggle = (purposeKey: string) => {
    setFormData((prev) => {
      const exists = prev.purpose.includes(purposeKey);
      if (exists) {
        if (prev.purpose.length === 1) return prev; // At least one required
        return { ...prev, purpose: prev.purpose.filter((p) => p !== purposeKey) };
      } else {
        return { ...prev, purpose: [...prev.purpose, purposeKey] };
      }
    });
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
      if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 11) {
        setError('Durust 11-digit Pakistani mobile number darj karein (e.g. 03001234567).');
        return;
      }
      if (!isPhoneVerified) {
        setError('Mobile verification lazmi hai! "Send OTP" daba kar apna mobile number verify karein.');
        return;
      }
      setStep(2);
    }
    // STEP 2 VALIDATION
    else if (step === 2) {
      setStep(3);
    }
    // STEP 3 VALIDATION
    else if (step === 3) {
      if (!formData.educationLevel || !formData.profession) {
        setError('Taleem aur Profession darj karna lazmi hai.');
        return;
      }
      if (!formData.aboutMe.trim() || formData.aboutMe.trim().length < 15) {
        setError('Apne baaray mein kam az kam 1-2 jumlay zaroor likhein.');
        return;
      }
      setStep(4);
    }
    // STEP 4 VALIDATION (FINAL)
    else if (step === 4) {
      if (!formData.agreed18Plus || !formData.agreedTerms) {
        setError('Bara-e-meherbani 18+ tasdeeq aur Hamsafar safety guidelines qabool karein.');
        return;
      }

      onSuccess(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[95vh] border border-slate-200">
        
        {/* Progress Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 px-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Marhala {step} of 4 (Mandatory Form)</span>
            <span className="text-emerald-700 font-bold">
              {step === 1 && '1. Bunyadi Shanakht, Umar & Rehaish'}
              {step === 2 && '2. Khandani Maloomat (Parents, Siblings, Marital)'}
              {step === 3 && '3. Taleem, Job & Mere Baaray Mein'}
              {step === 4 && '4. Hissa Dom: Mujhe Kaisa Hamsafar Chahiye?'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNext} className="flex-1 p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: BUNYADI MALOOMAT */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-slate-900 text-sm">Hissa Awwal: Bunyadi Maloomat (Basic Info)</h3>
                <p className="text-[11px] text-slate-500">Yeh maloomat profile verification aur identity ke liye lazmi hain.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mukammal Naam (As per CNIC) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Hamza Khan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jins (Gender) *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleGenderChange(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
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
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                  {formData.age > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                      Age: {formData.age} Years (Auto-calculated)
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Photo (Main & Additional) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Profile Photos (Main Photo & Gallery)
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Clear face photo preferred. Inappropriate ya fake tasweer block ho sakti hai.
                    </p>
                  </div>
                  {formData.hasCustomPhoto ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Photo Added
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      Default Avatar Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5">
                  {/* Main Avatar Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={formData.avatar}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
                    />
                    <label
                      htmlFor="main-photo-upload"
                      className="absolute -bottom-1 -right-1 bg-slate-900 hover:bg-emerald-600 text-white p-1.5 rounded-xl cursor-pointer transition-colors shadow-md"
                      title="Upload new photo"
                    >
                      <Camera size={13} />
                    </label>
                    <input
                      id="main-photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleMainPhotoUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="main-photo-upload"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Upload size={13} />
                        {formData.hasCustomPhoto ? 'Change Main Photo' : 'Upload Main Photo'}
                      </label>

                      {formData.hasCustomPhoto && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            avatar: prev.gender === 'female'
                              ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                              : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
                            hasCustomPhoto: false
                          }))}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      PNG, JPG ya WebP. Mobile gallery ya camera se upload karein.
                    </p>
                  </div>
                </div>

                {/* Additional Photos Gallery */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">
                      Additional Photos (Max 3 - Mehram / Family Photos):
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formData.additionalPhotos.length}/3 photos
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {formData.additionalPhotos.map((photo, idx) => (
                      <div key={idx} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-300">
                        <img src={photo} alt={`Additional ${idx + 1}`} className="w-full h-full object-cover" />
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
                        htmlFor="additional-photo-upload"
                        className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-white flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
                      >
                        <ImageIcon size={16} />
                        <span className="text-[9px] font-bold mt-0.5">+ Add</span>
                        <input
                          id="additional-photo-upload"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mojooda Rehaish (Living City) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore"
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aabai Sheher (Native City / Town)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sialkot / Multan"
                    value={formData.nativeCity}
                    onChange={(e) => setFormData({ ...formData, nativeCity: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mazhab & Practice (Religion) *</label>
                <select
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Islam (Practicing Muslim)">Islam (Practicing Muslim)</option>
                  <option value="Islam (Moderate)">Islam (Moderate)</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Mobile Number & Interactive OTP Verification */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Pakistani Mobile Number (SMS OTP Verification) *
                  </label>
                  {isPhoneVerified ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      OTP Lazmi Hai
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      disabled={isPhoneVerified}
                      placeholder="0300 1234567"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className={`w-full text-xs p-2.5 rounded-xl border font-mono ${
                        isPhoneVerified
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                      }`}
                    />
                  </div>

                  {!isPhoneVerified && (
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={handleSendOtp}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Smartphone size={14} />
                      {otpSent ? (otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Resend Code') : 'Send OTP'}
                    </button>
                  )}
                </div>

                {/* Simulated Real-Feel Incoming SMS Banner */}
                {smsAlert?.show && !isPhoneVerified && (
                  <div className="p-3 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-xl shadow-md border border-emerald-500/40 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Smartphone size={13} className="text-emerald-400 animate-pulse" />
                        🔔 SMS Received from &quot;HAMSAFAR&quot;
                      </span>
                      <span className="text-[10px] text-slate-300">Just now</span>
                    </div>
                    <p className="text-xs text-slate-100">
                      Aapka verification OTP code: <span className="font-mono font-black text-amber-300 tracking-widest text-sm bg-white/10 px-2 py-0.5 rounded-md ml-1">{smsAlert.code}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Neechay box mein yeh code daakhil karein.</p>
                  </div>
                )}

                {/* OTP Input and Verification Button */}
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
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={15} />
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Maqsad (Connection Purpose) *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => handlePurposeToggle('rishta')}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${
                      formData.purpose.includes('rishta')
                        ? 'border-emerald-600 bg-emerald-50/60'
                        : 'border-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">💍 Serious Rishta (Marriage)</span>
                    <span className="text-[10px] text-slate-500">Shadi ke liye ba-waqar talash</span>
                  </div>

                  <div
                    onClick={() => handlePurposeToggle('friendship')}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${
                      formData.purpose.includes('friendship')
                        ? 'border-teal-600 bg-teal-50/60'
                        : 'border-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-900 block">🤝 Verified Friendship</span>
                    <span className="text-[10px] text-slate-500">Intellectual peer networking</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: KHANDANI MALOOMAT & MARITAL STATUS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-slate-900 text-sm">Hissa Awwal: Khandani Maloomat (Family Background)</h3>
                <p className="text-[11px] text-slate-500">Walidain, behan bhai aur shadi ki halat darj karein.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shadi Ki Halat (Marital Status) *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Never Married">Never Married (Ghair Shadi Shuda)</option>
                    <option value="Divorced">Divorced (Talaq Yafta)</option>
                    <option value="Widowed">Widowed (Bewa / Bewa Mard)</option>
                    <option value="Separated">Separated (Alahda)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khandan Ki Naoiat (Family Type) *</label>
                  <select
                    value={formData.familyType}
                    onChange={(e) => setFormData({ ...formData, familyType: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Nuclear Family">Nuclear Family (Alag Ghar / Sirf Walidain)</option>
                    <option value="Joint Family">Joint Family System (Mushtarka Khandan)</option>
                    <option value="Extended Family">Extended Family</option>
                  </select>
                </div>
              </div>

              {/* Children conditional */}
              {formData.maritalStatus !== 'Never Married' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">Kya Aapke Bache Hain? (Children)</label>
                    <select
                      value={formData.hasChildren ? 'yes' : 'no'}
                      onChange={(e) => setFormData({ ...formData, hasChildren: e.target.value === 'yes' })}
                      className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                    >
                      <option value="no">No Children</option>
                      <option value="yes">Yes, have children</option>
                    </select>
                  </div>
                  {formData.hasChildren && (
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">Bacho Ki Tadaad</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.childrenCount}
                        onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg border border-amber-300"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Walid Ka Status (Father) *</label>
                  <select
                    value={formData.fatherStatus}
                    onChange={(e) => setFormData({ ...formData, fatherStatus: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Alive (Working / Business)">Hayat Hain (Working / Business)</option>
                    <option value="Alive (Retired)">Hayat Hain (Retired)</option>
                    <option value="Passed Away">Wafat Paa Chukay Hain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Walida Ka Status (Mother) *</label>
                  <select
                    value={formData.motherStatus}
                    onChange={(e) => setFormData({ ...formData, motherStatus: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Alive (Homemaker / Ghar Sambhalti Hain)">Hayat Hain (Homemaker)</option>
                    <option value="Alive (Working / Professional)">Hayat Hain (Working / Job)</option>
                    <option value="Passed Away">Wafat Paa Chuki Hain</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bhaiyon Ki Tadaad (Brothers Count)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={formData.brothersCount}
                    onChange={(e) => setFormData({ ...formData, brothersCount: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Behnon Ki Tadaad (Sisters Count)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={formData.sistersCount}
                    onChange={(e) => setFormData({ ...formData, sistersCount: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shadi Ke Baad Rehaish Ki Khwahish (Living Preference) *</label>
                <select
                  value={formData.livingArrangementPreference}
                  onChange={(e) => setFormData({ ...formData, livingArrangementPreference: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Flexible">Flexible (Aapas Ki Rza-mandi Se Tay Hoga)</option>
                  <option value="Separate home">Separate Home (Alag Rehaish)</option>
                  <option value="With parents">With Parents (Joint Family System)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: TALEEM, PESHA & ABOUT ME */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-slate-900 text-sm">Hissa Awwal: Taleem, Pesha & Mere Baaray Mein</h3>
                <p className="text-[11px] text-slate-500">Degree, rozgar aur apne baaray mein likhein.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taleem Ki Satah (Education Level) *</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Bachelor's">Bachelor's Degree (14-16 Years)</option>
                    <option value="Master's">Master's / MS / MPhil</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                    <option value="Intermediate / A-Levels">Intermediate / A-Levels</option>
                    <option value="Matric / O-Levels">Matric / O-Levels</option>
                    <option value="Religious Scholar / Dars-e-Nizami">Religious Scholar (Dars-e-Nizami)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree Ka Shoba (Field) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science / MBBS / Commerce"
                    value={formData.degreeField}
                    onChange={(e) => setFormData({ ...formData, degreeField: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pesha / Mulazmat (Profession) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Engineer / Doctor / Business"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mahana Aamdani (Approx Income) *</label>
                  <select
                    value={formData.incomeRange}
                    onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="100k - 250k PKR">100k - 250k PKR</option>
                    <option value="250k - 500k PKR">250k - 500k PKR</option>
                    <option value="500k+ PKR">500k+ PKR</option>
                    <option value="Under 100k PKR">Under 100k PKR</option>
                    <option value="Prefer not to say">Prefer not to say (Private)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mere Baaray Mein (About Me & Personality) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Apni shakhsiyat, aadat aur mustaqbil ke maqasid ke baaray mein likhein (Kam az kam 1-2 jumlay)..."
                  value={formData.aboutMe}
                  onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 leading-relaxed outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* STEP 4: HISSA DOM - MUJHE KAISA HAMSAFAR CHAHIYE */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-rose-800 text-sm flex items-center gap-1.5">
                  <Heart size={16} />
                  Hissa Dom: Mujhe Kaisa Hamsafar Chahiye? (Partner Requirements)
                </h3>
                <p className="text-[11px] text-slate-500">Matching algorithm in preferences ki bunyad par rishtay dhoonday ga.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Matlooba Umar (Partner Age Range) *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={18}
                      max={60}
                      value={formData.partnerAgeMin}
                      onChange={(e) => setFormData({ ...formData, partnerAgeMin: Number(e.target.value) })}
                      className="w-1/2 text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                    <span className="text-xs text-slate-400">se</span>
                    <input
                      type="number"
                      min={18}
                      max={70}
                      value={formData.partnerAgeMax}
                      onChange={(e) => setFormData({ ...formData, partnerAgeMax: Number(e.target.value) })}
                      className="w-1/2 text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Matlooba Taleem (Min Education) *</label>
                  <select
                    value={formData.partnerMinEducation}
                    onChange={(e) => setFormData({ ...formData, partnerMinEducation: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                    <option value="Any">No specific preference (Any)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Partner Marital Status *</label>
                  <select
                    value={formData.partnerMaritalStatus}
                    onChange={(e) => setFormData({ ...formData, partnerMaritalStatus: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Never Married">Never Married Only</option>
                    <option value="Divorced / Widowed Welcome">Divorced / Widowed Welcome</option>
                    <option value="Any">Any Marital Status</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Smoking Deal-Breaker *</label>
                  <select
                    value={formData.smokingPreference}
                    onChange={(e) => setFormData({ ...formData, smokingPreference: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Must not smoke">🔴 Must not smoke (Deal-breaker)</option>
                    <option value="Prefer non-smoker">🟡 Prefer non-smoker</option>
                    <option value="Flexible">🟢 Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Partner Preferred Cities / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore, Islamabad, Rawalpindi ya Anywhere in Pakistan"
                  value={formData.partnerCity}
                  onChange={(e) => setFormData({ ...formData, partnerCity: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Terms and Commitments */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreed18Plus}
                    onChange={(e) => setFormData({ ...formData, agreed18Plus: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded text-emerald-600"
                  />
                  <span className="text-[11px] text-emerald-950 leading-tight">
                    Main iqrar karta/karti hoon ke meri umar <strong>18 saal ya is se zyada</strong> hai aur tamam darj shuda data durust hai.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedTerms}
                    onChange={(e) => setFormData({ ...formData, agreedTerms: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded text-emerald-600"
                  />
                  <span className="text-[11px] text-emerald-950 leading-tight">
                    Main Hamsafar ke Etemad, Izzat aur Anti-Fraud qawaneen ki pabandi karunga/karungi.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Pichla Qadam
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
              {step === 4 ? 'Mukammal Account Register Karein' : 'Agla Qadam'}
              <ArrowRight size={14} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
