import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/data/profiles';
import { ShieldAlert, Send, PhoneOff, AlertOctagon, UserCheck, X } from 'lucide-react';
import { fetchCloudMessagesBetween, sendCloudMessage, markMessagesAsRead } from '@/lib/cloudMessages';

interface ChatModalProps {
  partner: UserProfile | null;
  currentUser: UserProfile | null;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them' | 'system';
  text: string;
  timestamp: string;
  isWarning?: boolean;
}

// Fraud triggers list from specification
const SCAM_PATTERNS = [
  { regex: /(money|paise|paisa|cash|loan|udhaar|bank|account|easypaisa|jazzcash|crypto|invest)/i, message: '⚠️ Financial Safety Warning: Never send money, loans, or banking information to anyone met online.' },
  { regex: /(otp|code|password|pin)/i, message: '🛑 High Alert: Never disclose your phone OTP or system password.' },
  { regex: /(whatsapp|number|telegram|insta|contact me on)/i, message: 'ℹ️ Safety Tip: Prematurely leaving Hamsafar removes automated safety and representative oversight.' }
];

export const ChatModal: React.FC<ChatModalProps> = ({ partner, currentUser, onClose }) => {
  if (!partner) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'sys-1',
      sender: 'system',
      text: 'Assalam-o-Alaikum. You are connected in a verified secure chat. End-to-end safety monitoring is enabled.',
      timestamp: 'Just now',
    },
    {
      id: 'm-1',
      sender: 'them',
      text: `Assalam-o-Alaikum! Thank you for connecting. I am ${partner.name}. Let me know if you would like to discuss our profiles.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync cloud messages on mount & every 3s
  useEffect(() => {
    if (!currentUser || !partner) return;

    const loadMessages = async () => {
      try {
        const cloudMsgs = await fetchCloudMessagesBetween(currentUser.id, partner.id);
        if (cloudMsgs && cloudMsgs.length > 0) {
          const formatted: Message[] = [
            {
              id: 'sys-1',
              sender: 'system',
              text: 'Assalam-o-Alaikum. You are connected in a verified secure chat. End-to-end safety monitoring is enabled.',
              timestamp: 'Secure Session',
            },
          ];

          cloudMsgs.forEach((cm) => {
            const isMe = cm.senderId === currentUser.id;
            formatted.push({
              id: cm.id,
              sender: isMe ? 'me' : 'them',
              text: cm.content,
              timestamp: new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });

            if (cm.hasSafetyWarning && cm.warningType) {
              formatted.push({
                id: `warn-${cm.id}`,
                sender: 'system',
                text: cm.warningType,
                timestamp: 'System',
                isWarning: true,
              });
            }
          });

          setMessages(formatted);
          markMessagesAsRead(partner.id, currentUser.id);
        }
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [currentUser, partner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const textToSend = inputText.trim();
    setInputText('');

    // Detect Scam or High-risk keywords
    let warningTriggered: string | null = null;
    for (const pattern of SCAM_PATTERNS) {
      if (pattern.regex.test(textToSend)) {
        warningTriggered = pattern.message;
        break;
      }
    }

    const optimisticMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    if (warningTriggered) {
      setActiveAlert(warningTriggered);
      // Auto inject system safety message into chat
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-warn-${Date.now()}`,
            sender: 'system',
            text: warningTriggered!,
            timestamp: 'Just now',
            isWarning: true,
          },
        ]);
      }, 400);
    }

    // Persist to Supabase if logged in
    if (currentUser) {
      setIsSending(true);
      try {
        await sendCloudMessage(currentUser, partner, textToSend, warningTriggered || undefined);
      } catch (e) {
        console.error('Error sending message:', e);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] border border-slate-200">
        
        {/* Header */}
        <div className="p-3.5 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-10 h-10 rounded-full object-cover border border-emerald-500"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm">{partner.name}</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
              </div>
              <span className="text-[11px] text-slate-500">
                {partner.city} • Verified User
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Assigned Representative Ahmed has been notified for your support.')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1.5 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1 transition-colors"
              title="Call Representative"
            >
              <UserCheck size={14} />
              <span className="hidden sm:inline">Rep Support</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* In-chat Persistent Safety Notice */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-[11px] text-amber-900 flex items-center gap-2">
          <ShieldAlert size={14} className="text-amber-600 shrink-0" />
          <span>
            <strong>Safety Rule:</strong> Never send OTPs, loans, or money. Official reps never request passwords.
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
          {messages.map((m) => {
            if (m.sender === 'system') {
              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl text-xs text-center mx-auto max-w-sm border ${
                    m.isWarning
                      ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              );
            }

            const isMe = m.sender === 'me';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                  {m.timestamp}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type a safe message... (e.g. Try testing 'loan' or 'bank' to see anti-scam warnings)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
};
