import React from 'react';
import { UserProfile } from '@/data/profiles';
import { VerificationBadges } from './VerificationBadges';
import { Check, X, MessageSquare, Clock, UserCheck } from 'lucide-react';

export interface ConnectionRequestItem {
  id: string;
  sender: UserProfile;
  recipientId: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

interface ConnectionRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ConnectionRequestItem[];
  onAccept: (req: ConnectionRequestItem) => void;
  onDecline: (req: ConnectionRequestItem) => void;
  onStartChat: (profile: UserProfile) => void;
}

export const ConnectionRequestsModal: React.FC<ConnectionRequestsModalProps> = ({
  isOpen,
  onClose,
  requests,
  onAccept,
  onDecline,
  onStartChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="text-emerald-600" size={22} />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Safe Connection Requests ({requests.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Random direct messaging band hai. Sirf accepted connections hi chat kar sakti hain.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* Requests List */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Filhaal koi pending connection request nahi hai.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.sender.avatar}
                    alt={req.sender.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500/20"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{req.sender.name}</h4>
                    <p className="text-xs text-slate-500">{req.sender.profession} • {req.sender.city}</p>
                    <div className="mt-1">
                      <VerificationBadges badges={req.sender.badges} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Status / Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => onDecline(req)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs font-semibold"
                        title="Decline"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => onAccept(req)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check size={15} />
                        Accept
                      </button>
                    </>
                  ) : req.status === 'accepted' ? (
                    <button
                      onClick={() => {
                        onClose();
                        onStartChat(req.sender);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                    >
                      <MessageSquare size={14} className="text-emerald-700" />
                      Chat Safely Now
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Declined</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
