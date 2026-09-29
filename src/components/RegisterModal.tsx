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
  BookOpen
} from 'lucide-react';

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
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
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

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (For Verification) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
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
