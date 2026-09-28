import React from 'react';
import { Smartphone, CheckCircle, Camera, Users, ShieldCheck } from 'lucide-react';

interface VerificationBadgesProps {
  badges: {
    mobileVerified: boolean;
    identityVerified: boolean;
    photoVerified: boolean;
    familyVerified: boolean;
    noActiveRestrictions: boolean;
  };
  size?: 'sm' | 'md';
  showLabels?: boolean;
}

export const VerificationBadges: React.FC<VerificationBadgesProps> = ({
  badges,
  size = 'md',
  showLabels = false,
}) => {
  const iconSize = size === 'sm' ? 14 : 16;
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {badges.mobileVerified && (
        <span
          title="Mobile Verified"
          className={`inline-flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full ${paddingClass}`}
        >
          <Smartphone size={iconSize} className="text-emerald-600" />
          {showLabels && <span>Mobile</span>}
        </span>
      )}

      {badges.identityVerified && (
        <span
          title="Identity Verified (Govt ID Checked)"
          className={`inline-flex items-center gap-1 font-medium bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full ${paddingClass}`}
        >
          <CheckCircle size={iconSize} className="text-blue-600" />
          {showLabels && <span>ID Verified</span>}
        </span>
      )}

      {badges.photoVerified && (
        <span
          title="Photo Verified (Real Selfie Match)"
          className={`inline-flex items-center gap-1 font-medium bg-purple-50 text-purple-700 border border-purple-200/80 rounded-full ${paddingClass}`}
        >
          <Camera size={iconSize} className="text-purple-600" />
          {showLabels && <span>Photo</span>}
        </span>
      )}

      {badges.familyVerified && (
        <span
          title="Family Verification Completed"
          className={`inline-flex items-center gap-1 font-medium bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full ${paddingClass}`}
        >
          <Users size={iconSize} className="text-amber-600" />
          {showLabels && <span>Family Verified</span>}
        </span>
      )}

      {badges.noActiveRestrictions && (
        <span
          title="Shield: Clean Safety Record"
          className={`inline-flex items-center gap-1 font-medium bg-slate-50 text-slate-700 border border-slate-200/80 rounded-full ${paddingClass}`}
        >
          <ShieldCheck size={iconSize} className="text-slate-600" />
          {showLabels && <span>Safe Standing</span>}
        </span>
      )}
    </div>
  );
};
