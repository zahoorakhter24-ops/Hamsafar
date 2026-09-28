import React, { useState } from 'react';
import { UserCheck, ShieldAlert, AlertTriangle, FileText, CheckCircle2, Clock } from 'lucide-react';

interface CaseItem {
  id: string;
  userName: string;
  type: 'Scam Detection' | 'Harassment' | 'Verification' | 'Mehram Mode Assistance';
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'In Review' | 'Resolved';
  time: string;
  notes: string;
}

export const RepresentativeDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cases, setCases] = useState<CaseItem[]>([
    {
      id: 'CASE-9402',
      userName: 'Syed Hamza Ali',
      type: 'Verification',
      priority: 'Medium',
      status: 'New',
      time: '10 mins ago',
      notes: 'Submitted CNIC front/back for blue identity badge validation.',
    },
    {
      id: 'CASE-9388',
      userName: 'Zainab Tariq',
      type: 'Scam Detection',
      priority: 'High',
      status: 'In Review',
      time: '25 mins ago',
      notes: 'Potential financial trigger: User was prompted by outside contact for mobile balance.',
    },
    {
      id: 'CASE-9350',
      userName: 'Dr. Fatima Noor',
      type: 'Mehram Mode Assistance',
      priority: 'Low',
      status: 'Resolved',
      time: '2 hours ago',
      notes: 'Assisted in generating invitation link for guardian/father limited access.',
    },
  ]);

  const handleResolve = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: 'Resolved' } : c))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <UserCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Representative Safety Console</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  OFFICIAL REP: AHMED (#REP-04)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audited privacy-first assistance panel. Conversations are only reviewed when user requests help.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            Close Console
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-xl font-extrabold text-slate-800">12</span>
              <p className="text-[11px] text-slate-500 font-medium">Assigned Users</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <span className="text-xl font-extrabold text-amber-700">2</span>
              <p className="text-[11px] text-amber-700 font-medium">Active Safety Alerts</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
              <span className="text-xl font-extrabold text-emerald-700">98%</span>
              <p className="text-[11px] text-emerald-700 font-medium">Resolution Rate</p>
            </div>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
            Active Safety & Support Cases
          </h4>

          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{c.userName}</span>
                    <span className="text-xs font-mono text-slate-400">({c.id})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : c.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{c.notes}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {c.time}
                    </span>
                    <span>Type: <strong>{c.type}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {c.status === 'Resolved' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 size={14} /> Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolve(c.id)}
                      className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
