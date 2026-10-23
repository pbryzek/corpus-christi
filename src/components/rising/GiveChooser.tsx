import { useEffect } from 'react';
import { X } from 'lucide-react';
import { pillClasses } from './shared';

const OPTIONS = [
  {
    title: 'Take the 15% Step',
    body: 'Increase your regular giving and set it up online, automatically.',
    target: 'feed',
    cta: 'Take the 15% Step',
  },
  {
    title: 'Fund a Need',
    body: 'Choose a need close to your heart, from liturgy to our parish home.',
    target: 'fund',
    cta: 'See the needs',
  },
  {
    title: 'Leave a Legacy',
    body: 'Remember Corpus Christi in your will, trust or retirement account.',
    target: 'legacy',
    cta: 'Learn more',
  },
];

export default function GiveChooser({ onClose }: { onClose: () => void }) {
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

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex p-6 overflow-y-auto animate-[fadeIn_200ms_ease-out]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gc-title"
        className="relative w-full max-w-[920px] m-auto bg-slate-50 rounded-2xl p-9 shadow-2xl animate-[scaleIn_250ms_ease-out]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 w-11 h-11 rounded-full bg-slate-200 text-rising-navy flex items-center justify-center hover:bg-slate-300 transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
        <h2 id="gc-title" className="m-0 pr-12 font-serif font-bold text-[34px] leading-tight text-slate-900">
          How would you like to give?
        </h2>
        <div className="grid gap-4 mt-6 grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))]">
          {OPTIONS.map((o) => (
            <div
              key={o.title}
              className="bg-white border-2 border-slate-200 rounded-2xl p-[22px] flex flex-col gap-2 transition-all duration-200 hover:border-blue-300 hover:-translate-y-0.5"
            >
              <h3 className="m-0 font-serif font-bold text-2xl text-rising-navy">{o.title}</h3>
              <p className="m-0 mb-2.5 text-[17px] text-slate-600">{o.body}</p>
              <a href={`#${o.target}`} onClick={go(o.target)} className={pillClasses('navy', 'md', 'mt-auto w-full')}>
                {o.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[17px] text-slate-600">
          Can't give right now?{' '}
          <a href="#pray" onClick={go('pray')} className="text-rising-navy font-bold underline underline-offset-4">
            Pray, volunteer or invite →
          </a>
        </p>
      </div>
    </div>
  );
}
