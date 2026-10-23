import { useState } from 'react';
import { Activity, Clock, Heart } from 'lucide-react';
import { SectionHeading, VideoPlaceholder, pillClasses } from './shared';
import PledgeModal from './PledgeModal';

const PRESETS = [50, 100, 250, 500];
type Step = '15' | '20' | 'own';
const STEPS: { value: Step; label: string }[] = [
  { value: '15', label: '15%' },
  { value: '20', label: '20%' },
  { value: 'own', label: 'Your own amount' },
];

const QUICK_REFERENCE = [
  ['$50', '$57.50', '25¢', '$60', '35¢'],
  ['$100', '$115', '50¢', '$120', '65¢'],
  ['$250', '$287.50', '$1.25', '$300', '$1.65'],
  ['$500', '$575', '$2.45', '$600', '$3.30'],
];

const BENEFITS = [
  {
    icon: Activity,
    title: 'Steady support we can plan around',
    body: ", week after week, whether or not you're in the pew. Gives us greater control over our budgeting.",
  },
  {
    icon: Clock,
    title: 'Time returned to ministry.',
    body: ' Securely counting the basket takes eight staff/volunteers several hours every week.',
  },
  {
    icon: Heart,
    title: 'Your gift, prayerfully decided once',
    body: ', offered faithfully every month.',
  },
];

function money(n: number) {
  const rounded = Math.round(n * 100) / 100;
  return '$' + (Math.abs(rounded % 1) < 0.005 ? rounded.toFixed(0) : rounded.toFixed(2));
}

function daily(increase: number) {
  const d = Math.round((increase * 12) / 365 / 0.05) * 0.05;
  if (d <= 0) return '0¢';
  return d < 1 ? `${Math.round(d * 100)}¢` : `$${d.toFixed(2)}`;
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[48px] px-5 rounded-lg font-semibold border-2 transition-all duration-200 ${
        active
          ? 'border-rising-navy bg-rising-navy text-white'
          : 'border-rising-stone bg-white text-rising-ink hover:border-rising-navy'
      }`}
    >
      {children}
    </button>
  );
}

const inputClasses =
  'w-[140px] min-h-[48px] px-3 text-lg border border-rising-stone rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-rising-navy';

export default function StepCalculator() {
  const [monthly, setMonthly] = useState('100');
  const [step, setStep] = useState<Step>('15');
  const [own, setOwn] = useState('');
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const current = Number(monthly) || 0;
  const isOwn = step === 'own';
  const newGift = isOwn ? Number(own) || current : current * (1 + Number(step) / 100);
  const increase = Math.max(0, newGift - current);

  return (
    <section id="feed" className="bg-rising-sand px-6 py-[88px]">
      <div className="max-w-[1120px] mx-auto flex flex-wrap gap-14">
        <div className="flex-[999_1_480px] min-w-0">
          <SectionHeading>Take the 15% Step</SectionHeading>
          <p className="mt-2 text-[22px] font-semibold text-rising-navy">
            Small enough to say yes. Big enough to make a real difference.
          </p>
          <p className="mt-5 text-xl">
            If every parishioner increases their offertory giving by 15%, it's enough to put our everyday
            ministry on solid ground. If you give $25 per week now, +15% is just 50 cents more a day.
          </p>
          <h3 className="mt-10 text-[22px] font-bold">Ditch the collection basket: give online, automatically</h3>
          <div className="flex flex-col gap-[18px] mt-[18px]">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-3.5 items-start">
                <Icon className="w-[26px] h-[26px] flex-none mt-[3px] text-rising-bronze" aria-hidden="true" />
                <p className="m-0">
                  <strong>{title}</strong>
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-7">
            <VideoPlaceholder label="[Video testimony: young family]" />
          </div>
        </div>

        <div className="flex-[1_1_380px] min-w-0 self-start bg-white rounded-[20px] p-9 border border-rising-line shadow-[0_24px_48px_-32px_rgba(30,58,110,0.35)]">
          <h3 className="m-0 font-serif font-bold text-[26px] leading-tight">
            What does the 15% Step look like for me?
          </h3>
          <p className="mt-3.5 text-[15px] font-bold">Current Monthly gift</p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            {PRESETS.map((p) => (
              <Pill key={p} active={current === p} onClick={() => setMonthly(String(p))}>
                ${p}
              </Pill>
            ))}
          </div>
          <label htmlFor="monthly-gift" className="block mt-3.5 text-[15px] font-semibold">
            Or enter your monthly gift
          </label>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xl font-bold">$</span>
            <input
              id="monthly-gift"
              type="number"
              min={1}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className={inputClasses}
            />
          </div>

          <p className="mt-5 text-[15px] font-bold">Choose your step</p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            {STEPS.map((s) => (
              <Pill key={s.value} active={step === s.value} onClick={() => setStep(s.value)}>
                {s.label}
              </Pill>
            ))}
          </div>
          {isOwn && (
            <div className="animate-[fadeIn_200ms_ease-out]">
              <label htmlFor="own-gift" className="block mt-3.5 text-[15px] font-semibold">
                Your new monthly gift
              </label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xl font-bold">$</span>
                <input
                  id="own-gift"
                  type="number"
                  min={1}
                  value={own}
                  onChange={(e) => setOwn(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-rising-line flex flex-col gap-2.5" aria-live="polite">
            <div className="flex justify-between items-baseline gap-3">
              <span className="font-bold">{isOwn ? 'Your new monthly gift' : `Take the ${step}% Step`}</span>
              <span className="font-serif text-[40px] font-bold text-rising-navy leading-[1.1]">{money(newGift)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-rising-muted">Increase</span>
              <strong>{money(increase)}/month</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-rising-muted">Daily increase</span>
              <strong>{daily(increase)}</strong>
            </div>
          </div>
          <button type="button" onClick={() => setPledgeOpen(true)} className={pillClasses('navy', 'lg', 'w-full mt-6')}>
            Take the 15% Step
          </button>
          <p className="mt-2.5 text-center text-[15px] text-rising-muted">Giving takes less than two minutes.</p>
          <p className="mt-2 text-center text-[15px] text-rising-muted">
            Does your employer match gifts? Many do. Ask HR to double yours.
          </p>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto mt-12">
        <h3 className="m-0 text-[22px] font-bold">Affordability Guide</h3>
        <div className="overflow-x-auto mt-3 rounded-xl">
          <table className="w-full min-w-[560px] border-collapse bg-white text-[17px]">
            <thead>
              <tr>
                {['Monthly gift', 'Take the 15% Step', 'Daily increase', 'Take the 20% Step', 'Daily increase'].map(
                  (h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 border-b-2 border-rising-ink font-bold ${i === 0 ? 'text-left' : 'text-right'}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {QUICK_REFERENCE.map((row, r) => (
                <tr key={r} className="hover:bg-rising-cream transition-colors">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-4 py-3 ${r < QUICK_REFERENCE.length - 1 ? 'border-b border-rising-line' : ''} ${
                        i === 0 ? '' : 'text-right'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {pledgeOpen && <PledgeModal onClose={() => setPledgeOpen(false)} />}
    </section>
  );
}
