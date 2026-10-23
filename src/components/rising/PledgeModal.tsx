import { useEffect } from 'react';
import { X } from 'lucide-react';
import { WIDGET_CSS } from '../../lib/mpWidgets';

export default function PledgeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex p-4 sm:p-6 overflow-y-auto animate-[fadeIn_200ms_ease-out]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pledge-title"
        className="relative w-full max-w-[720px] m-auto bg-white rounded-2xl p-6 sm:p-9 shadow-2xl animate-[scaleIn_250ms_ease-out]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-11 h-11 rounded-full bg-slate-200 text-rising-navy flex items-center justify-center hover:bg-slate-300 transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        <h2 id="pledge-title" className="m-0 pr-12 font-serif font-bold text-[30px] leading-tight text-slate-900">
          Take the 15% Step
        </h2>
        <p className="mt-2 text-[17px] text-slate-600">Make your pledge below. It takes less than two minutes.</p>
        <div className="mt-6 min-h-[200px]">
          <mpp-pledge-campaign
            pledgecampaignid="2"
            pledgeemailtemplate="65"
            suggestedamounts="NULL"
            customcss={WIDGET_CSS}
          ></mpp-pledge-campaign>
        </div>
      </div>
    </div>
  );
}
