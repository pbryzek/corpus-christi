import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { GIVE_PATH, PASTOR_MAILTO, PillLink, SectionHeading, VideoPlaceholder } from './shared';

type Need = {
  title: string;
  description: string;
  amount: string;
  buttons?: string[];
  progress?: { percent: number; label: string };
  funded?: boolean;
};

type Category = { id: string; label: string; intro: string; needs: Need[] };

const CATEGORIES: Category[] = [
  {
    id: 'lit',
    label: 'Liturgy',
    intro: 'Beauty and welcome at every Mass.',
    needs: [
      {
        title: 'Livestream Refresh',
        description: 'The equipment that lets trained volunteers bring Mass to everyone who can’t be here.',
        amount: '$5,000',
      },
      {
        title: 'Guest Priests',
        description: 'Support visiting priests who celebrate with us in Fr. Leo’s absence.',
        amount: '$[TOTAL] for the year',
        buttons: ['Sponsor a daily Mass · $50', 'Sponsor a weekend Mass · $150', 'Fund the year · $[TOTAL]'],
      },
      {
        title: 'Church Décor',
        description:
          'Seasonal décor for Advent, Christmas, Lent, Easter, Palm Sunday, Pentecost and the Feast of Corpus Christi.',
        amount: '$[AMOUNT]',
      },
      {
        title: 'Christmas & Easter Musicians',
        description: 'Extra musicians to make our holiest liturgies soar.',
        amount: '$[AMOUNT]',
      },
      {
        title: 'Christmas & Easter Flowers',
        description: 'Fill the church with beauty for our holiest days.',
        amount: '$[AMOUNT]',
      },
    ],
  },
  {
    id: 'ff',
    label: 'Faith Formation',
    intro: 'Forming disciples of every age.',
    needs: [
      {
        title: 'Spiritual Enrichment',
        description: 'Among the top three needs voiced in our surveys and listening sessions.',
        amount: 'Any amount',
      },
      {
        title: 'Teen Ministry & Trip',
        description: 'Another top-three need you asked us to launch.',
        amount: 'Any amount',
      },
      {
        title: 'OCIA',
        description:
          'A record 22 people are participating in OCIA this year. Sponsor a seeker for $350 or fund everyone!',
        amount: '$7,700',
        buttons: ['Sponsor a seeker · $350', 'Fund everyone · $7,700'],
      },
      {
        title: 'Baptism–First Eucharist Ministry',
        description: 'Walking with families as their children receive the sacraments.',
        amount: 'Any amount',
      },
      {
        title: 'Parish Hallow App Membership',
        description:
          'Free access to the Hallow prayer app for every parishioner: daily prayer, Scripture and meditations.',
        amount: '$5,000',
      },
    ],
  },
  {
    id: 'ng',
    label: 'Groups/Belonging',
    intro: 'Welcoming newcomers and helping everyone belong.',
    needs: [
      {
        title: 'New Group Ministries',
        description: 'Speakers, leader support and essentials for our thriving new groups.',
        amount: '$10,000',
      },
      {
        title: 'Welcome Initiative',
        description:
          'Our largest wave of newcomers in 15 years, and a ministry that makes everyone feel they belong here.',
        amount: '$2,000',
        progress: { percent: 60, label: '$1,200 of $2,000 given' },
      },
      {
        title: 'Website',
        description: 'Help share our good news by ensuring our new website is updated, welcoming and easy to use.',
        amount: '$15,000',
      },
      {
        title: 'Social Media & Communications',
        description: 'Limited content assistance with Flocknote, social media, website and other communications needs.',
        amount: '$8,700',
      },
    ],
  },
  {
    id: 'bg',
    label: 'Buildings/Grounds',
    intro: 'Caring for our parish home, a place where all of us gather, grow and belong.',
    needs: [
      {
        title: 'Church Sound System',
        description: 'Upgrade our sound system so we can clearly hear Fr. Leo and our beautiful choir.',
        amount: '$[AMOUNT]',
      },
      {
        title: 'Gibson Center WiFi',
        description: 'Help ministry leaders show presentations, and help parishioners actually get a phone call.',
        amount: '$[AMOUNT]',
      },
      {
        title: 'Gibson Center A/V',
        description: 'A basic sound and projection setup for formation, events and speakers.',
        amount: '$4,500',
        funded: true,
      },
      {
        title: 'Bell Tower Tile Repair',
        description: 'Restoring the tiles on the bell tower that marks our parish home.',
        amount: '$[AMOUNT]',
      },
      {
        title: 'Tree Trimming',
        description: 'High-risk trees on St. James need trimming for everyone’s safety.',
        amount: '$4,000',
        funded: true,
      },
      {
        title: 'Retaining Wall Repair',
        description: 'A small repair that prevents a bigger problem.',
        amount: 'About $1,000',
      },
      {
        title: 'Plumbing Upgrade',
        description:
          'Our aging system was installed in 1964, the year the Beatles first came to America. It needs a lasting fix before it decides to twist and shout.',
        amount: '$[AMOUNT]',
      },
      {
        title: 'New Phone System',
        description:
          'Our phones have been unreliable for two years. If you’ve called the office and gotten nowhere, now you know why.',
        amount: '$[AMOUNT]',
      },
    ],
  },
];

function NeedCard({ need }: { need: Need }) {
  const buttons = need.buttons ?? ['Give now'];
  return (
    <article className="bg-white border border-rising-line rounded-2xl p-[26px] flex flex-col gap-3 min-h-[230px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(30,58,110,0.4)]">
      <div className="flex justify-between items-start gap-3">
        <h4 className="m-0 text-xl font-bold leading-[1.3]">{need.title}</h4>
        {need.funded && (
          <span className="flex-none inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rising-navy text-white text-sm font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Funded!
          </span>
        )}
      </div>
      <p className="m-0 text-base text-rising-muted">{need.description}</p>
      <div className="mt-auto">
        <div className="font-serif text-2xl font-bold">{need.amount}</div>
        {need.progress && (
          <>
            <div className="h-2 rounded-full bg-rising-parchment mt-2.5 overflow-hidden">
              <div className="h-full bg-rising-ochre rounded-full" style={{ width: `${need.progress.percent}%` }} />
            </div>
            <p className="mt-1.5 text-sm text-rising-muted">{need.progress.label}</p>
          </>
        )}
        {need.funded ? (
          <p className="mt-1.5 text-[15px] italic text-rising-muted">Thank you to a generous parishioner.</p>
        ) : (
          <div className="flex flex-wrap gap-x-2.5">
            {buttons.map((label, i) => (
              <PillLink key={label} to={GIVE_PATH} variant={i === 0 ? 'navy' : 'outline'} className="mt-3.5">
                {label}
              </PillLink>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function RoofsFeature() {
  return (
    <article className="col-span-full bg-rising-navy text-rising-cream rounded-2xl p-[30px] flex flex-wrap gap-7 items-center">
      <div className="flex-[1.2_1_320px] min-w-0">
        <h4 className="m-0 font-serif font-bold text-[28px] leading-[1.2]">Church, Rectory &amp; Gibson Center Roofs</h4>
        <p className="mt-2.5 text-[17px] text-rising-haze">
          Our church, rectory and Gibson Center roofs desperately need significant repair. Major leaks are on the
          horizon.
        </p>
      </div>
      <div className="flex-[1_1_300px] min-w-0">
        <div className="font-serif text-[30px] font-bold text-rising-gold">$[AMOUNT]</div>
        <div className="h-3.5 rounded-full bg-white/[0.18] mt-3 overflow-hidden">
          <div className="h-full w-1/4 bg-rising-gold rounded-full" />
        </div>
        <p className="mt-2 text-[15px] text-rising-mist">$[X] raised of $[AMOUNT]</p>
        <PillLink to={GIVE_PATH} variant="gold" className="mt-3.5 min-h-[48px] px-[26px]">
          Give now
        </PillLink>
      </div>
    </article>
  );
}

export default function FundANeed() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <section id="fund" className="px-6 py-[88px]">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex flex-wrap gap-10 items-center">
          <div className="flex-[1.2_1_420px] min-w-0">
            <SectionHeading>Fund a Need</SectionHeading>
            <p className="mt-5 text-xl">
              Every gift, of any size, builds up the Body of Christ. Choose a need close to your heart and give online
              right now.
            </p>
            <p className="mt-2.5 text-rising-muted">
              Considering a gift of $5,000 or more, or funding a need in full? Email Fr. Leo at{' '}
              <a href={PASTOR_MAILTO} className="text-rising-navy font-semibold underline">
                pastor@cc-parish.org
              </a>
              . Does your employer match gifts? Many do. Ask HR to double yours.
            </p>
            <div className="mt-5 inline-flex flex-wrap gap-x-5 gap-y-2 px-5 py-3.5 bg-rising-sand rounded-[14px] text-base font-semibold">
              <span>Already funded: $[X]</span>
              <span>Still needed: $[Y]</span>
              <span>Celebrating at Epiphany, Sunday, January 3 (OR Feb. 14, THE FIRST SUNDAY OF LENT?)</span>
            </div>
          </div>
          <div className="flex-[1_1_360px] min-w-0">
            <VideoPlaceholder label="[Video testimony: child/teen]" />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Fund a Need categories"
          className="grid gap-3.5 mt-10 grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))]"
        >
          {CATEGORIES.map((c) => {
            const on = c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`panel-${c.id}`}
                onClick={() => setActiveId(c.id)}
                className={`min-h-[84px] px-5 py-3 rounded-xl text-xl font-serif font-bold border-2 transition-all duration-200 ${
                  on
                    ? 'border-rising-navy bg-rising-navy text-white shadow-[0_12px_28px_-16px_rgba(30,58,110,0.7)]'
                    : 'border-rising-stone bg-white text-rising-ink hover:border-rising-navy'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div id={`panel-${active.id}`} role="tabpanel" key={active.id} className="animate-[fadeIn_250ms_ease-out]">
          <p className="mt-6 text-rising-muted text-lg">{active.intro}</p>
          <div className="grid gap-5 mt-6 grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))]">
            {active.needs.map((n) => (
              <NeedCard key={n.title} need={n} />
            ))}
            {active.id === 'bg' && <RoofsFeature />}
          </div>
        </div>
      </div>
    </section>
  );
}
