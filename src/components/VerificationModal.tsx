import React, { useState } from 'react';
import { ShieldCheck, Upload, FileText, Camera, CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSubmitted: (badges: any) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationSubmitted,
}) => {
  const [cnicNumber, setCnicNumber] = useState('');
  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnicNumber || cnicNumber.length < 13) {
      setError('Bara-e-meherbani 13-digit valid CNIC number darj karein (e.g. 35201-xxxxxxx-x)');
      return;
    }
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onVerificationSubmitted({
        cnicNumber,
        cnicFrontName: cnicFront ? cnicFront.name : 'CNIC_Front_Image.jpg',
        selfieName: selfie ? selfie.name : 'Selfie_Verification.jpg',
      });
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={22} />
            <h3 className="font-bold text-slate-900 text-sm">
              Official Identity & Selfie Verification
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Documents Submitted (Under Review)</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Aapke CNIC aur Live Selfie documents verification queue mein submit ho chuke hain. Verification Officer review karne ke baad Blue Identity Badge activate karega.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Safety notice banner */}
            <div className="bg-blue-50 border border-blue-200/80 p-3.5 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
              <Lock size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Encrypted Privacy Protection: </span>
                Aapka CNIC ya personal document kabhi bhi public profiles par show nahi hoga. Ye sirf verified safety officer ke audited portal par review hota hai.
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* CNIC Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                National Identity Card (CNIC) Number
              </label>
              <input
                type="text"
                required
                maxLength={15}
                placeholder="35201-1234567-1"
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-mono"
              />
            </div>

            {/* CNIC Front Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CNIC Front Image (Clear Photo)
              </label>
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <FileText className="text-slate-400 mb-1" size={24} />
                <span className="text-xs font-semibold text-slate-700">
                  {cnicFront ? cnicFront.name : 'Click to Upload CNIC Photo'}
                </span>
                <span className="text-[11px] text-slate-400">JPG, PNG (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setCnicFront(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            </div>

            {/* Live Selfie Verification */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Live Selfie Match (Real Face Verification)
              </label>
              <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-purple-50/30">
                <Camera className="text-purple-500 mb-1" size={24} />
                <span className="text-xs font-semibold text-slate-700">
                  {selfie ? selfie.name : 'Take or Upload a Real-time Selfie'}
                </span>
                <span className="text-[11px] text-slate-400">Matches photo on your ID card</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setSelfie(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            </div>

            {/* Submit Action */}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying Documents...' : 'Submit For Official Verification'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
