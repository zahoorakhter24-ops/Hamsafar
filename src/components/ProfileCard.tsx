import React, { useState } from 'react';
import { UserProfile } from '@/data/profiles';
import { VerificationBadges } from './VerificationBadges';
import { Heart, UserPlus, Shield, MapPin, Briefcase, GraduationCap, Info, Lock } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  onRequestConnect: (profile: UserProfile) => void;
  onViewDetails: (profile: UserProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onRequestConnect,
  onViewDetails,
}) => {
  const [requested, setRequested] = useState(false);

  const handleConnect = () => {
    setRequested(true);
    onRequestConnect(profile);
  };

  const isRishta = profile.purpose.includes('rishta');
  const isFriendship = profile.purpose.includes('friendship');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Top Banner / Avatar area */}
      <div className="p-5 pb-3">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-inner"
            />
            {profile.isDemo && (
              <span className="absolute -top-1.5 -left-1.5 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                DEMO
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {profile.name}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {profile.age} yrs
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">{profile.city}, {profile.country}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <Briefcase size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">{profile.profession}</span>
            </div>
          </div>
        </div>

        {/* Verification Badges Row */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <VerificationBadges badges={profile.badges} size="sm" showLabels={true} />
        </div>

        {/* Purpose Tags */}
        <div className="flex items-center gap-1.5 mt-3">
          {isRishta && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-100">
              💍 Serious Rishta
            </span>
          )}
          {isFriendship && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
              🤝 Verified Friendship
            </span>
          )}
          {profile.familyInvolvementPreference === 'Required' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">
              🛡️ Mehram / Family Mode
            </span>
          )}
        </div>

        {/* About Bio Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
          {profile.about}
        </p>

        {/* Education & Info */}
        <div className="mt-3 pt-2.5 border-t border-dashed border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[70%]">
            <GraduationCap size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{profile.education}</span>
          </div>
          <button
            onClick={() => onViewDetails(profile)}
            className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-0.5 shrink-0"
          >
            Details <Info size={12} />
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 rounded-b-2xl flex items-center gap-2">
        <button
          onClick={handleConnect}
          disabled={requested}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            requested
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white'
          }`}
        >
          {requested ? (
            <>
              <Shield size={14} className="text-emerald-700" />
              Request Sent
            </>
          ) : (
            <>
              <UserPlus size={14} />
              Connect Safely
            </>
          )}
        </button>

        <button
          onClick={() => onViewDetails(profile)}
          className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200 transition-colors"
          title="Full Profile"
        >
          <Lock size={15} />
        </button>
      </div>
    </div>
  );
};
