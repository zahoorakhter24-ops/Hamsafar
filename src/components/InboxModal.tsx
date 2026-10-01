import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/data/profiles';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Sparkles,
  X,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { fetchActiveConversations, ConversationSummary } from '@/lib/cloudMessages';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  allProfiles: UserProfile[];
  onOpenChatWith: (partner: UserProfile) => void;
  onOpenRequests: () => void;
}

export const InboxModal: React.FC<InboxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allProfiles,
  onOpenChatWith,
  onOpenRequests,
}) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setLoading(true);
      fetchActiveConversations(currentUser.id, allProfiles).then((res) => {
        setConversations(res);
        setLoading(false);
      });

      // Poll conversations list every 5s while modal is open
      const interval = setInterval(() => {
        fetchActiveConversations(currentUser.id, allProfiles).then(setConversations);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen, currentUser, allProfiles]);

  if (!isOpen) return null;

  const filtered = conversations.filter((c) =>
    c.partner.name.toLowerCase().includes(search.toLowerCase()) ||
    c.partner.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] max-h-[92vh] border border-emerald-500/20">
        
        {/* Luxury Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 px-6 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                  Inbox & Paighamat <Sparkles size={14} className="text-amber-400" />
                </h3>
                <p className="text-[11px] text-emerald-200/80">
                  Accepted connections ke sath mehfooz private chat
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-600 font-medium"
            />
          </div>
        </div>

        {/* Body / Conversations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {!currentUser ? (
            <div className="py-16 text-center space-y-3">
              <Lock size={32} className="mx-auto text-slate-400" />
              <p className="text-xs text-slate-600 font-medium">
                Inbox access karne ke liye pehle login karein.
              </p>
            </div>
          ) : loading ? (
            <div className="py-16 text-center text-xs text-slate-500">
              Conversations load ho rahi hain...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-14 text-center space-y-3 px-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <UserCheck size={26} />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Abhi Koi Active Chat Nahi Hai</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Jab aap kisi user ko connection request bhejte hain aur woh accept kar lete hain, ya koi aapki request accept karta hai, toh woh yahan conversation mein show honge.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenRequests();
                }}
                className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <UserCheck size={14} /> Check Pending Requests
              </button>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.partner.id}
                onClick={() => {
                  onClose();
                  onOpenChatWith(item.partner);
                }}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/40 hover:bg-emerald-50/20 cursor-pointer transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={item.partner.avatar}
                      alt={item.partner.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-800 transition-colors">
                        {item.partner.name}
                      </h4>
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.partner.age} saal • {item.partner.city} • {item.partner.profession}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      🟢 Chat Active • Tap to open
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-700 transition-colors">
                  <span className="text-[11px] font-bold hidden sm:inline">Message</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Safety Notice */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>End-to-end anti-scam monitoring enabled on all chats.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
