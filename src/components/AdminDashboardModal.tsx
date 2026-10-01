import React, { useState } from 'react';
import { UserProfile } from '@/data/profiles';
import { VerificationBadges } from './VerificationBadges';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Trash2,
  Ban,
  UserCheck,
  Search,
  Eye,
  AlertTriangle,
  X,
  FileText,
  Users,
  Lock,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  onApproveVerification: (userId: string) => void;
  onRejectVerification: (userId: string) => void;
  onBanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onClearDemoData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onApproveVerification,
  onRejectVerification,
  onBanUser,
  onDeleteUser,
  onClearDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'rejected' | 'users'>('verifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocUser, setSelectedDocUser] = useState<UserProfile | null>(null);
  
  // Admin Security Password Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Master Admin Password
    if (adminPin === 'admin123' || adminPin === 'Hamsafar@2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Ghalat Password! Sirf authorized admin hi access kar sakta hai.');
    }
  };

  // If not authenticated, show secure login gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Admin Portal Locked</h3>
            <p className="text-xs text-slate-500 mt-1">
              Admin access ke liye security password darj karein.
            </p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-3">
            {authError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {authError}
              </div>
            )}
            <input
              type="password"
              placeholder="Admin Password..."
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full text-center text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-600 outline-none font-mono"
              autoFocus
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Unlock Access
              </button>
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Hint: Default password is <strong>admin123</strong>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filter profiles that have genuinely pending verification (Exclude already rejected)
  const pendingVerifications = profiles.filter(
    (p) =>
      (p.verificationStatus === 'pending' || Boolean(p.submittedDocuments)) &&
      p.verificationStatus !== 'rejected' &&
      !p.badges.identityVerified
  );

  // Filter profiles that have been rejected or suspended
  const rejectedProfiles = profiles.filter(
    (p) => p.verificationStatus === 'rejected' || p.badges.noActiveRestrictions === false
  );

  const verifiedCount = profiles.filter((p) => p.badges.identityVerified).length;

  const filteredUsers = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92vh] border border-slate-200">
        
        {/* Top Header */}
        <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Hamsafar Super Admin Portal</h3>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                  FULL SYSTEM ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Verification Approvals, User Moderation & Safety Audits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Kya aap waqai saara Demo Data clear karna chahte hain?')) {
                  onClearDemoData();
                }
              }}
              className="text-xs bg-rose-900/60 hover:bg-rose-800 text-rose-200 px-3 py-1.5 rounded-xl border border-rose-500/30 flex items-center gap-1 transition-colors"
              title="Delete all demo test accounts"
            >
              <Trash2 size={13} />
              <span>Clear Demo Data</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50 border-b border-slate-200 text-center text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-lg font-black text-slate-900">{profiles.length}</span>
            <p className="text-slate-500 text-[11px]">Total Members</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-lg font-black text-emerald-600">{verifiedCount}</span>
            <p className="text-slate-500 text-[11px]">Identity Verified</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-lg font-black text-amber-600">{pendingVerifications.length}</span>
            <p className="text-slate-500 text-[11px]">Pending Reviews</p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-lg font-black text-rose-600">{rejectedProfiles.length}</span>
            <p className="text-slate-500 text-[11px]">Rejected / Restricted</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'verifications'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck size={16} />
            <span>Verification Queue ({pendingVerifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'rejected'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <XCircle size={16} className="text-rose-600" />
            <span>Rejected Profiles ({rejectedProfiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users size={16} />
            <span>User Management ({profiles.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          
          {/* 1. VERIFICATION QUEUE TAB */}
          {activeTab === 'verifications' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                As an Admin, yahan users ke submitted CNIC & selfie dekh kar 1-click Approve ya Reject karein:
              </div>

              {pendingVerifications.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                  Zabardast! Koi pending verification baqi nahi hai. Tamam accounts verified hain.
                </div>
              ) : (
                pendingVerifications.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {user.age} yrs • {user.city}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{user.profession} • {user.education}</p>
                        <div className="mt-1">
                          <VerificationBadges badges={user.badges} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedDocUser(user)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye size={13} />
                        View Documents
                      </button>

                      <button
                        onClick={() => onRejectVerification(user.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>

                      <button
                        onClick={() => onApproveVerification(user.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <CheckCircle2 size={14} />
                        Approve (Grant Blue Badge)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. REJECTED PROFILES TAB */}
          {activeTab === 'rejected' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                Yeh accounts admin ki taraf se reject ya restrict kiye gaye hain:
              </div>

              {rejectedProfiles.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                  Filhaal koi profile reject ya restrict nahi hai.
                </div>
              ) : (
                rejectedProfiles.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-white rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-rose-300"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                          <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md border border-rose-200">
                            Verification Rejected ❌
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{user.city} • {user.profession}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onApproveVerification(user.id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        Re-Approve Profile
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Kya aap waqai ${user.name} ko mukammal delete karna chahte hain?`)) {
                            onDeleteUser(user.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, city or job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">City / Age</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{u.name}</span>
                              <span className="text-[10px] text-slate-400">{u.profession}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{u.city}, {u.age}y</td>
                        <td className="p-3">
                          <span className="capitalize">{u.purpose.join(', ')}</span>
                        </td>
                        <td className="p-3">
                          {u.verificationStatus === 'rejected' ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              Rejected ❌
                            </span>
                          ) : u.badges.identityVerified ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onRejectVerification(u.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                              title="Reject Verification"
                            >
                              <XCircle size={15} />
                            </button>
                            <button
                              onClick={() => onBanUser(u.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                              title="Ban / Suspend User"
                            >
                              <Ban size={15} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Kya aap waqai ${u.name} ko mukammal delete karna chahte hain?`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                              title="Delete Permanently"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Document Preview Sub-Modal */}
      {selectedDocUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-sm text-slate-900">
                Official Document Preview: {selectedDocUser.name}
              </h4>
              <button onClick={() => setSelectedDocUser(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold block text-slate-700 mb-1">National ID Card (CNIC) Front:</span>
                <div className="h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-mono text-xs">
                  [Verified Government CNIC Front Image Attached]
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold block text-slate-700 mb-1">Live Selfie Photo:</span>
                <img
                  src={selectedDocUser.avatar}
                  alt="Live selfie match"
                  className="w-24 h-24 rounded-xl object-cover mx-auto border-2 border-emerald-500"
                />
                <p className="text-[11px] text-center text-emerald-700 font-medium mt-1">
                  ✓ Facial features match CNIC photograph
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedDocUser(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onApproveVerification(selectedDocUser.id);
                  setSelectedDocUser(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Approve Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
