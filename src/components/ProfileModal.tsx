import React, { useState } from 'react';
import { UserProfile } from '@/data/profiles';
import { VerificationBadges } from './VerificationBadges';
import { X, ShieldCheck, MapPin, Briefcase, GraduationCap, Heart, AlertTriangle, Users, BookOpen, Lock } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onConnect: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onClose,
  onConnect,
}) => {
  const [reportState, setReportState] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!profile) return null;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportState(false);
      setReportReason('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={20} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Verified Identity Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Main Identity Box */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md"
            />
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {profile.age} Years Old
                </span>
              </div>

              <p className="text-sm font-medium text-emerald-700">
                {profile.profession}
              </p>

              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <MapPin size={14} className="text-slate-400" />
                {profile.city}, {profile.country}
              </p>

              <div className="pt-2">
                <VerificationBadges badges={profile.badges} size="sm" showLabels={true} />
              </div>
            </div>
          </div>

          {/* Verification Legal Disclaimer Notice */}
          <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-3.5 text-xs text-emerald-900 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Trust & Safety Standard: </span>
              «Verification confirms the official information checked by Hamsafar. It does not guarantee a person's future intentions. Keep initial conversations strictly within Hamsafar.»
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Personal Bio & Values
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {profile.about}
            </p>
          </div>

          {/* Rishta Attributes */}
          {profile.purpose.includes('rishta') && (
            <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                💍 Serious Rishta Preferences
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Marital Status:</span>
                  <span className="font-semibold text-slate-800">{profile.maritalStatus || 'Single'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Family Involvement:</span>
                  <span className="font-semibold text-slate-800">{profile.familyInvolvementPreference || 'Preferred'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Religious Practice:</span>
                  <span className="font-semibold text-slate-800">{profile.religiousCommitment || 'Practicing'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Preferred Cities:</span>
                  <span className="font-semibold text-slate-800">{profile.preferredCity || 'Flexible'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Friendship / Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Shared Interests & Topics
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <Lock size={13} className="text-slate-400 shrink-0" />
            <span>Sensitive documents (CNIC, phone number, private address) are never displayed publicly.</span>
          </div>

          {/* Report User Area */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {!reportState ? (
              <button
                onClick={() => setReportState(true)}
                className="text-slate-500 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
              >
                <AlertTriangle size={14} />
                Report Suspicious Activity / Profile
              </button>
            ) : reportSubmitted ? (
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg font-medium w-full text-center">
                Report logged under Case ID #HSF-{Math.floor(10000 + Math.random() * 90000)}. Safety Officer will review.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="w-full space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                  <AlertTriangle size={14} className="text-rose-600" />
                  Report Category:
                </div>
                <select
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="">Select Reason...</option>
                  <option value="fake">Fake Profile or Stolen Picture</option>
                  <option value="financial">Financial Request / Money Ask</option>
                  <option value="harassment">Harassment or Inappropriate Language</option>
                  <option value="impersonation">Impersonation / False Information</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportState(false)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onConnect(profile);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-95"
          >
            Send Safe Connection Request
          </button>
        </div>

      </div>
    </div>
  );
};
