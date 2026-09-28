import React, { useState } from 'react';
import { Users, Shield, Copy, Check, UserPlus, Heart, X, Lock } from 'lucide-react';

interface MehramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export const MehramModal: React.FC<MehramModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [guardianRole, setGuardianRole] = useState<'Father' | 'Mother' | 'Brother' | 'Sister' | 'Legal Guardian'>('Father');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'view_matches' | 'full_involvement'>('view_matches');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianName.trim() || !guardianPhone.trim()) return;

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const link = `https://hamsafar.pk/mehram-join?code=HSF-FAM-${code}&role=${guardianRole.toLowerCase()}`;
    setGeneratedInviteLink(link);
    onSuccess({
      guardianRole,
      guardianName,
      guardianPhone,
      code,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 px-6 bg-amber-500/10 border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-amber-800" size={22} />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Mehram / Family Guardian Involvement Mode
              </h3>
              <p className="text-[11px] text-amber-900 font-medium">
                Khandani Etemad & Shariat Ke Ain Mutabiq Safe Rishta Matching
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-amber-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Concept Banner */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield size={15} className="text-emerald-700" />
              Family Involvement Ki Privacy:
            </div>
            <p className="text-[11px]">
              Family member (Father / Mother / Brother) ko sirf aapki pasandeeda profiles aur match details nazar aayengi. Aapki private baatein ya data bina ijazat share nahi kiya jata.
            </p>
          </div>

          {!generatedInviteLink ? (
            <form onSubmit={handleGenerateInvite} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kis Family Member Ko Shamil Karna Chahte Hain?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Father', 'Mother', 'Brother', 'Sister', 'Legal Guardian'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setGuardianRole(role)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        guardianRole === role
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Family Member Ka Mukammal Naam
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haji Muhammad Aslam"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Family Member Ka Mobile Number (WhatsApp / SMS)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300 9876543"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Level (Ijazat Ki Had)
                </label>
                <select
                  value={permissionLevel}
                  onChange={(e) => setPermissionLevel(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-amber-600 outline-none"
                >
                  <option value="view_matches">Limited: Sirf Rishta Profile Details Dekhein</option>
                  <option value="full_involvement">Full: Family Direct Coordinator Se Baat Kar Sakay</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <UserPlus size={15} />
                  Family Invite Link Banayein
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check size={20} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Mehram / Family Access Link Tayyar Hai!
                </h4>
                <p className="text-xs text-slate-600">
                  Yeh link apne {guardianRole} ({guardianName}) ke sath WhatsApp ya SMS par share karein:
                </p>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedInviteLink}
                  className="text-xs bg-transparent border-none outline-none flex-1 font-mono text-slate-700 select-all"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Gold Badge (Family Verified) activate ho chuka hai.
                </span>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
