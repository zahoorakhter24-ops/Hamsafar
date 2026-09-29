import React, { useState } from 'react';
import { UserProfile, PartnerRequirements } from '@/data/profiles';
import {
  User,
  Heart,
  Eye,
  CheckCircle,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Shield,
  X,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

interface DetailedProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const DetailedProfileModal: React.FC<DetailedProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'about_me' | 'partner_req' | 'preview'>('about_me');

  // Hissa Awwal: About Me State
  const [profileData, setProfileData] = useState<UserProfile>({ ...currentUser });

  // Hissa Dom: Partner Requirements State
  const [reqData, setReqData] = useState<PartnerRequirements>({
    gender: currentUser.gender === 'male' ? 'female' : 'male',
    ageRange: currentUser.requirements?.ageRange || [23, 30],
    flexibleAge: currentUser.requirements?.flexibleAge ?? true,
    preferredCities: currentUser.requirements?.preferredCities || [currentUser.city],
    relocationWillingness: currentUser.requirements?.relocationWillingness || 'Maybe',
    maritalStatusPreference: currentUser.requirements?.maritalStatusPreference || ['Never Married'],
    childrenPreference: currentUser.requirements?.childrenPreference || 'Prefer no children',
    minEducation: currentUser.requirements?.minEducation || 'Bachelor\'s',
    preferredFields: currentUser.requirements?.preferredFields || ['Medical', 'IT', 'Business', 'Education'],
    preferredProfessions: currentUser.requirements?.preferredProfessions || ['Any'],
    financialLifestyle: currentUser.requirements?.financialLifestyle || 'Moderate',
    familyTypePreference: currentUser.requirements?.familyTypePreference || 'Either',
    livingArrangementAfterMarriage: currentUser.requirements?.livingArrangementAfterMarriage || 'Flexible',
    religiousImportance: currentUser.requirements?.religiousImportance || 'Important',
    personalityTraits: currentUser.requirements?.personalityTraits || ['Kind', 'Respectful', 'Family-oriented'],
    lifestylePreferences: currentUser.requirements?.lifestylePreferences || ['Balanced', 'Family-oriented'],
    smokingPreference: currentUser.requirements?.smokingPreference || 'Must not smoke',
    careerAfterMarriage: currentUser.requirements?.careerAfterMarriage || 'Career strongly preferred',
    futureChildrenPreference: currentUser.requirements?.futureChildrenPreference || 'Want children',
    marriageTimeline: currentUser.requirements?.marriageTimeline || 'Within 1 year',
    seriousnessLevel: currentUser.requirements?.seriousnessLevel || 'Serious marriage',
    friendshipBeforeMarriage: currentUser.requirements?.friendshipBeforeMarriage || 'Prefer direct serious rishta',
    dealBreakers: currentUser.requirements?.dealBreakers || ['Smoking', 'Dishonesty'],
    importantQualities: currentUser.requirements?.importantQualities || ['Respect', 'Honesty', 'Family values'],
    flexibleIn: currentUser.requirements?.flexibleIn || ['City', 'Income range'],
    mustHaves: currentUser.requirements?.mustHaves || ['Educated', 'Family-oriented'],
    idealPartnerSummary: currentUser.requirements?.idealPartnerSummary || '',
  });

  const [dealBreakerInput, setDealBreakerInput] = useState('');
  const [qualityInput, setQualityInput] = useState('');

  if (!isOpen) return null;

  // Auto-generate "My Ideal Hamsafar" summary
  const generateIdealSummary = () => {
    const summary = `Talash hai aik ${reqData.mustHaves.join(', ')} aur ${reqData.personalityTraits.slice(0, 3).join(', ')} shareek-e-hayat ki. Umar taqreeban ${reqData.ageRange[0]}-${reqData.ageRange[1]} saal, taleem kam az kam ${reqData.minEducation}, aur sheher ${reqData.preferredCities.join(', ')} preferred hai. Mazhabi aur khandani aqdaar aham hain, jabkay deegar mamlaat (${reqData.flexibleIn.join(', ')}) mein lachak (flexibility) mojood hai.`;
    setReqData(prev => ({ ...prev, idealPartnerSummary: summary }));
  };

  const handleSaveAll = () => {
    const updated: UserProfile = {
      ...profileData,
      requirements: reqData,
      profileCompletionPercentage: 95,
    };
    onSaveProfile(updated);
    onClose();
  };

  const calculateCompletion = () => {
    let score = 30; // base
    if (profileData.about && profileData.about.length > 30) score += 20;
    if (profileData.familyType) score += 15;
    if (profileData.interests && profileData.interests.length > 0) score += 15;
    if (reqData.idealPartnerSummary) score += 20;
    return Math.min(score, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[680px] max-h-[94vh] border border-slate-200">
        
        {/* Top Header */}
        <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Hamsafar Complete Profile & Partner Requirements</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {calculateCompletion()}% Complete
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hissa Awwal: Mere Baaray Mein • Hissa Dom: Mujhe Kaisa Hamsafar Chahiye?
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('about_me')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'about_me'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User size={15} />
            <span>حصہ اول: میرے بارے میں (My Profile)</span>
          </button>

          <button
            onClick={() => setActiveTab('partner_req')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'partner_req'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart size={15} className="text-rose-500" />
            <span>حصہ دوم: مجھے کیسا Hamsafar چاہیے؟ (Requirements)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye size={15} />
            <span>Public Profile Preview</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">

          {/* TAB 1: HISSA AWWAL (ABOUT ME) */}
          {activeTab === 'about_me' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Profile Status Switcher */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Profile Status</h4>
                  <p className="text-[11px] text-slate-500">Agar match mil jaye toh profile hide kar sakte hain</p>
                </div>
                <select
                  value={profileData.profileStatus || 'active'}
                  onChange={(e) => setProfileData({ ...profileData, profileStatus: e.target.value as any })}
                  className="text-xs font-bold p-2 px-3 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="active">🟢 Active (Looking for matches)</option>
                  <option value="taking_a_break">🟡 Taking a break (Temporarily hidden)</option>
                  <option value="found_my_hamsafar">🔴 Found my Hamsafar (Closed)</option>
                </select>
              </div>

              {/* A. Bunyadi Maloomat */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  A. Bunyadi Maloomat (Basic Information)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mukammal Naam</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Sheher (City)</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Umar (Age)</label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData({ ...profileData, age: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* E. About Me Text */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    E. Mere Baaray Mein (About Me - 500-800 Chars)
                  </h4>
                  <span className="text-[11px] text-slate-400">{profileData.about.length} characters</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Apne baaray mein wazahat karein: Aapki shakhsiyat kaisi hai, farigh waqt mein kya pasand hai, zindagi mein sab se ahem cheez kya hai..."
                  value={profileData.about}
                  onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 leading-relaxed"
                />
              </div>

              {/* F & Lifestyle: Personality & Living Arrangement */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  I & Q. Family Background & Marriage Mindset
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Family Structure</label>
                    <select
                      value={profileData.familyType || 'Nuclear Family'}
                      onChange={(e) => setProfileData({ ...profileData, familyType: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Nuclear Family">Nuclear Family (Parents & Siblings)</option>
                      <option value="Joint Family">Joint Family</option>
                      <option value="Extended Family">Extended Family</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Living Preference After Marriage</label>
                    <select
                      value={profileData.livingArrangementPreference || 'Flexible'}
                      onChange={(e) => setProfileData({ ...profileData, livingArrangementPreference: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Flexible">Flexible / Discuss together</option>
                      <option value="Separate home">Separate home</option>
                      <option value="With parents">With parents (Joint family)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Relocation Willingness</label>
                    <select
                      value={profileData.relocationWillingness || 'Maybe'}
                      onChange={(e) => setProfileData({ ...profileData, relocationWillingness: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Maybe">Maybe / Flexible</option>
                      <option value="Yes">Yes (Willing to relocate)</option>
                      <option value="No">No (Prefer staying in current city)</option>
                      <option value="Depends">Depends on circumstances</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Income Range (Approximate)</label>
                    <select
                      value={profileData.incomeRange || 'Prefer not to say'}
                      onChange={(e) => setProfileData({ ...profileData, incomeRange: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Under 100k PKR">Under 100k PKR</option>
                      <option value="100k - 250k PKR">100k - 250k PKR</option>
                      <option value="250k - 500k PKR">250k - 500k PKR</option>
                      <option value="500k+ PKR">500k+ PKR</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: HISSA DOM (PARTNER REQUIREMENTS) */}
          {activeTab === 'partner_req' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-3">
                <Heart size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 leading-relaxed">
                  <strong>Partner Requirements Privacy:</strong> Yeh preferences public profile par show nahi hotin balkay matching engine inki bunyad par compatible matches recommend karta hai.
                </div>
              </div>

              {/* B & C. Age & Location Requirements */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  B & C. Age Range & Location Preferences
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Preferred Age Range: {reqData.ageRange[0]} - {reqData.ageRange[1]} Years
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={18}
                        max={50}
                        value={reqData.ageRange[0]}
                        onChange={(e) => setReqData({ ...reqData, ageRange: [Number(e.target.value), reqData.ageRange[1]] })}
                        className="w-full accent-rose-600"
                      />
                      <input
                        type="range"
                        min={18}
                        max={60}
                        value={reqData.ageRange[1]}
                        onChange={(e) => setReqData({ ...reqData, ageRange: [reqData.ageRange[0], Number(e.target.value)] })}
                        className="w-full accent-rose-600"
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqData.flexibleAge}
                        onChange={(e) => setReqData({ ...reqData, flexibleAge: e.target.checked })}
                        className="rounded text-rose-600"
                      />
                      <span className="text-[11px] text-slate-600">Flexible Age Range Allowed</span>
                    </label>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preferred Cities (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Islamabad, Rawalpindi"
                      value={reqData.preferredCities.join(', ')}
                      onChange={(e) => setReqData({ ...reqData, preferredCities: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* G & H: Education, Profession & Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  G, H & T. Education, Profession & Marriage Timeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Minimum Education</label>
                    <select
                      value={reqData.minEducation}
                      onChange={(e) => setReqData({ ...reqData, minEducation: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="No specific preference">No specific preference</option>
                      <option value="Bachelor's">Bachelor's Degree</option>
                      <option value="Master's">Master's Degree</option>
                      <option value="Doctorate / PhD">Doctorate / PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Marriage Timeline</label>
                    <select
                      value={reqData.marriageTimeline}
                      onChange={(e) => setReqData({ ...reqData, marriageTimeline: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Within 6 months">Within 6 months</option>
                      <option value="Within 1 year">Within 1 year</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="No fixed timeline">No fixed timeline</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Smoking Deal-Breaker</label>
                    <select
                      value={reqData.smokingPreference}
                      onChange={(e) => setReqData({ ...reqData, smokingPreference: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Must not smoke">🔴 Must not smoke (Deal-breaker)</option>
                      <option value="Prefer non-smoker">🟡 Prefer non-smoker</option>
                      <option value="Flexible">🟢 Flexible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Z & AA: Deal Breakers & Important Qualities */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Z & AA. Deal Breakers & Top 5 Qualities
                </h4>
                
                {/* Deal breakers list */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Deal Breakers (Max 5 Cheezein Jin Par Compromise Nahi):
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {reqData.dealBreakers.map((db, idx) => (
                      <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                        <span>{db}</span>
                        <X
                          size={12}
                          className="cursor-pointer hover:text-rose-900"
                          onClick={() => setReqData({ ...reqData, dealBreakers: reqData.dealBreakers.filter((_, i) => i !== idx) })}
                        />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add deal-breaker (e.g. Bad temper, Relocation refusal)..."
                      value={dealBreakerInput}
                      onChange={(e) => setDealBreakerInput(e.target.value)}
                      className="flex-1 text-xs p-2 rounded-xl border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (dealBreakerInput.trim() && reqData.dealBreakers.length < 5) {
                          setReqData({ ...reqData, dealBreakers: [...reqData.dealBreakers, dealBreakerInput.trim()] });
                          setDealBreakerInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* AE. Auto-Generated "My Ideal Hamsafar" Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AE. My Ideal Hamsafar Summary (Auto-Generated from Preferences)
                  </h4>
                  <button
                    type="button"
                    onClick={generateIdealSummary}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Sparkles size={13} />
                    Auto-Generate Summary
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={reqData.idealPartnerSummary}
                  onChange={(e) => setReqData({ ...reqData, idealPartnerSummary: e.target.value })}
                  placeholder="Click 'Auto-Generate Summary' or write in your own words what kind of Hamsafar you are looking for..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 leading-relaxed font-sans"
                />
              </div>

            </div>
          )}

          {/* TAB 3: PUBLIC PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="text-xs text-slate-400 border-b pb-2 font-bold uppercase tracking-wider">
                Preview: Doosray log aapka profile aisay dekhenge:
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/20"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{profileData.name}, {profileData.age} yrs</h3>
                  <p className="text-xs text-emerald-700 font-semibold">{profileData.profession}</p>
                  <p className="text-xs text-slate-500">{profileData.city}, Pakistan</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {profileData.about || 'Personal bio not written yet.'}
              </div>

              {reqData.idealPartnerSummary && (
                <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-rose-800 uppercase block">Looking For:</span>
                  <p className="text-xs text-rose-900 leading-relaxed">{reqData.idealPartnerSummary}</p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                🔒 Private information (CNIC, exact salary, phone number) is never displayed publicly.
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle size={15} />
            Save Profile & Requirements
          </button>
        </div>

      </div>
    </div>
  );
};
