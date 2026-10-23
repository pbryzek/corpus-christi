import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, UserCircle } from 'lucide-react';
import { VideoPlaceholder, pillClasses } from '../components/rising/shared';
import GiveChooser from '../components/rising/GiveChooser';
import StepCalculator from '../components/rising/StepCalculator';
import FundANeed from '../components/rising/FundANeed';
import PrayVolunteerInvite from '../components/rising/PrayVolunteerInvite';
import { Legacy, Questions, WhyNow } from '../components/rising/LegacyAndQuestions';

const METERS = [
  { title: 'The 15% Step', value: '$[X] of $125,000', percent: 20, note: 'New regular giving toward our goal' },
  { title: 'Fund a Need', value: '$[X] funded', percent: 35, note: 'Parishioners have already funded [X] needs' },
  { title: '100% Participation', value: '[X]% of our parish', percent: 15, note: 'Every member of the Body counts' },
];

const STATS = [
  { value: '130+', label: 'new people welcomed into our parish this year' },
  { value: '483', label: 'parishioners contributed to Welcome the Stranger, Backpacks for Success and Giving Tree' },
  { value: '457', label: 'people attended new group events' },
  { value: '+215%', label: 'increase in OCIA' },
  { value: '+100%', label: 'increase in baptisms of older children' },
  { value: '+40%', label: 'new website traffic' },
];

function scrollTo(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
}

function GiveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={pillClasses('gold', 'lg', 'min-h-[64px] px-11 text-xl')}>
      Give now
    </button>
  );
}

function Hero({ onGive }: { onGive: () => void }) {
  return (
    <section className="bg-rising-navy text-rising-cream px-6 pt-20 pb-16">
      <div className="max-w-[1120px] mx-auto flex flex-wrap gap-12 items-center">
        <div className="flex-[1_1_440px] min-w-0 animate-[fadeIn_600ms_ease-out]">
          <p className="m-0 mb-4 text-[17px] font-bold tracking-[0.14em] uppercase text-rising-gold">
            A campaign to build up the Body of Christ
          </p>
          <h1 className="m-0 font-serif font-bold text-[clamp(44px,6.5vw,72px)] leading-[1.05]">Corpus Christi Rising</h1>
          <p className="mt-6 font-serif italic text-[22px] leading-[1.45] text-rising-ivory">
            “For where your treasure is, there your heart will be also.”
          </p>
          <p className="mt-1.5 text-[15px] tracking-[0.06em] text-rising-mist">MATTHEW 6:21</p>
          <p className="mt-6 text-[19px] text-rising-haze">
            You told us you wanted Corpus to become a welcoming parish with more ways to deepen your faith, community and
            love of God. It's been happening! Now we invite all parishioners to help sustain it, grow it and carry it
            forward.
          </p>
          <div className="flex flex-wrap items-center gap-5 mt-8">
            <GiveButton onClick={onGive} />
            <a href="#legacy" onClick={scrollTo('legacy')} className="text-rising-ivory font-semibold underline underline-offset-4 hover:text-white transition-colors">
              Planning a legacy gift? →
            </a>
          </div>
          <p className="mt-4 text-base text-rising-haze">
            Can't give right now?{' '}
            <a href="#pray" onClick={scrollTo('pray')} className="text-rising-ivory font-semibold underline underline-offset-4 hover:text-white transition-colors">
              Pray, volunteer or invite →
            </a>
          </p>
        </div>
        <div className="flex-[1_1_440px] min-w-0">
          <VideoPlaceholder label="[Fr. Leo's video, about 60 seconds, captioned]" />
        </div>
      </div>
    </section>
  );
}

function ProgressMeters() {
  return (
    <section className="bg-rising-deep text-rising-cream px-6 py-6">
      <div className="max-w-[1120px] mx-auto flex flex-wrap gap-x-10 gap-y-5">
        {METERS.map((m) => (
          <div key={m.title} className="flex-[1_1_260px] min-w-0">
            <div className="flex justify-between gap-3 font-bold">
              <span>{m.title}</span>
              <span className="text-rising-gold">{m.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.18] mt-2 overflow-hidden">
              <div className="h-full bg-rising-gold rounded-full" style={{ width: `${m.percent}%` }} />
            </div>
            <p className="mt-1.5 text-sm text-rising-mist">{m.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ParishRising() {
  return (
    <section className="px-6 py-[88px]">
      <div className="max-w-[1120px] mx-auto">
        <h2 className="m-0 font-serif font-bold text-[clamp(34px,5vw,52px)] leading-[1.1]">Our Parish Is Rising To the Occasion</h2>
        <p className="mt-4 text-xl font-semibold max-w-[760px] text-rising-muted">
          You asked for an engaged parish that welcomes everyone, deepens our faith and gathers in community. Look what's
          happening.
        </p>
        <div className="grid gap-5 mt-10 grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="bg-white rounded-2xl p-7 border border-rising-line transition-all duration-300 hover:-translate-y-1 hover:border-rising-gold"
            >
              <div className="font-serif text-[44px] font-bold text-rising-navy leading-none">{s.value}</div>
              <p className="mt-2.5 text-rising-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingBand({ onGive }: { onGive: () => void }) {
  return (
    <section className="bg-rising-navy text-rising-cream px-6 py-[72px] text-center">
      <p className="m-0 mx-auto max-w-[760px] font-serif italic text-[28px] leading-[1.4] text-rising-ivory">
        “For where your treasure is, there your heart will be also.”
      </p>
      <p className="mt-3 text-[15px] tracking-[0.06em] text-rising-mist">MATTHEW 6:21</p>
      <div className="flex justify-center mt-8">
        <GiveButton onClick={onGive} />
      </div>
    </section>
  );
}

export default function PreviewPage() {
  const [chooserOpen, setChooserOpen] = useState(false);
  const openChooser = useCallback(() => setChooserOpen(true), []);
  const closeChooser = useCallback(() => setChooserOpen(false), []);
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="text-rising-ink bg-rising-cream text-lg leading-relaxed">
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm px-6 py-2 flex items-center justify-center gap-2">
        <FlaskConical className="w-4 h-4" aria-hidden="true" />
        Draft preview for finance committee review — not yet part of the main site
      </div>
      <div className="bg-rising-deep text-blue-100 text-sm px-6 py-2.5">
        <div className="max-w-[1120px] mx-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-blue-200">
            <UserCircle className="w-4 h-4" aria-hidden="true" />
            Your giving account:
          </span>
          {[
            ['/login', 'Sign in'],
            ['/My-Giving', 'My Giving'],
            ['/My-Pledges', 'My Pledges'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="font-semibold text-white hover:text-blue-200 underline-offset-4 hover:underline transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <Hero onGive={openChooser} />
      <ProgressMeters />
      <ParishRising />
      <StepCalculator />
      <FundANeed />
      <PrayVolunteerInvite />
      <Legacy />
      <WhyNow />
      <Questions />
      <ClosingBand onGive={openChooser} />
      {chooserOpen && <GiveChooser onClose={closeChooser} />}
    </div>
  );
}
