import { PASTOR_MAILTO, PillLink, SectionHeading } from './shared';

const LEGACY_OPTIONS = [
  {
    title: 'In your will or trust',
    body: 'Name Corpus Christi Parish as a beneficiary. [Legal name and tax ID from the diocese]',
  },
  {
    title: 'Retirement accounts and life insurance',
    body: 'Name Corpus Christi as a beneficiary of a retirement account or life insurance policy.',
  },
  { title: 'Gifts of stock', body: 'Give appreciated stock directly and you may avoid capital gains tax.' },
  {
    title: 'From your IRA',
    body: "If you're 70½ or older, give directly from your IRA. It may count toward your required distribution.",
  },
  { title: 'Donor-advised funds', body: 'Recommend a grant to Corpus Christi.' },
];

const QUESTIONS = [
  {
    q: 'Why is there a gap?',
    a: 'Inflation is up 25% since COVID while giving has declined. In 2026, four of our six staff members retired; we welcomed their successors and added a new parish life role, just as we launched the revitalization plan you shaped. Our parish has not formally asked for money since XYZ.',
  },
  {
    q: 'Has the parish cut costs?',
    a: "Yes. We're reducing annual expenses by about $YXZ, including bringing livestream production in-house with trained volunteers. Your gifts sustain and grow ministry.",
  },
  {
    q: 'Who is on the Finance Committee, and how do they work with Corpus Christi?',
    a: "Our Finance Committee is made up of parishioners steeped in financial experience: XYZ. They meet quarterly to review our budget and spending, advise Fr. Leo on planning for our parish's future, and help guide this campaign. We'll post campaign progress on this page, so you can see exactly where your gifts go.",
  },
  {
    q: 'Why the 15% Step?',
    a: "It's a 15% increase in regular giving, about $125,000 a year, that puts the everyday life of our parish on solid ground: Mass, sacraments, formation and welcome.",
  },
  {
    q: 'Why 15% when the gap is $99,000?',
    a: "Not everyone can increase their giving, and costs keep rising. A 15% goal lets us close the gap even if some can't take the step, and keep pace next year.",
  },
  {
    q: 'Why online instead of the basket?',
    a: 'Recurring donations give the parish steady support it can plan around, and they eliminate hours of staff and volunteer time. The basket remains, and every gift is welcome.',
  },
  {
    q: 'Can I still give by cash or check?',
    a: 'Absolutely. Give at any Mass, or mail or drop off your gift at the parish office. Make checks payable to Corpus Christi Parish, with “Corpus Christi Rising” in the memo. [PARISH ADDRESS]',
  },
  {
    q: 'Do I need an account to give online?',
    a: "A profile is optional, but we encourage you set one up! We've just launched an updated database system and it would help us tremendously. Creating a profile gives you 24/7 access to your giving, allowing you to update it and receive digital tax documentation. It takes less than two mins.",
  },
  {
    q: 'Can I give anonymously?',
    a: "Yes. We're also happy to share your generosity publicly with the larger community or you can donate in honor of someone.",
  },
  {
    q: 'When does the campaign close?',
    a: "We celebrate Fund a Need at Epiphany, Sunday, January 3, and our 15% Step results on the First Sunday of Lent, February 14. You can join anytime and we're leaving the campaign donate buttons live after the deadlines so all donations can be accepted. CHECK WITH DAVID.",
  },
];

export function Legacy() {
  return (
    <section id="legacy" className="px-6 py-[88px]">
      <div className="max-w-[1120px] mx-auto">
        <SectionHeading>
          Leave A Legacy.
          <span className="block">Secure Corpus Christi's Next 100 Years</span>
        </SectionHeading>
        <div className="flex flex-wrap gap-14 mt-7">
          <div className="flex-[999_1_460px] min-w-0 text-xl">
            <p className="m-0">
              Corpus Christi has been a welcoming spiritual home for generations. As we approach our centennial in 2029,
              parishioners are choosing to make our parish part of their lasting legacy.
            </p>
            <p className="mt-5">
              You do not need to make a commitment today to learn more. We welcome a confidential conversation about how
              you might support the future of Corpus Christi.
            </p>
            <p className="mt-5">
              If you've already included Corpus Christi in your plans, please let us know so we can thank you and
              welcome you into our <strong>Centennial Circle</strong>.
            </p>
            <PillLink to={PASTOR_MAILTO} size="lg" className="mt-6">Contact Fr. Leo</PillLink>
            <p className="mt-3.5 text-rising-muted">We encourage you to consult your attorney or financial adviser.</p>
          </div>
          <div className="flex-[1_1_400px] min-w-0 flex flex-col gap-3.5">
            {LEGACY_OPTIONS.map((o) => (
              <div
                key={o.title}
                className="bg-white border border-rising-line rounded-2xl px-[26px] py-[22px] transition-colors duration-200 hover:border-blue-300"
              >
                <h3 className="m-0 text-xl font-bold">{o.title}</h3>
                <p className="mt-1 text-xl text-rising-muted">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyNow() {
  return (
    <section className="bg-rising-sand px-6 py-[72px]">
      <div className="max-w-[1120px] mx-auto flex flex-wrap gap-x-14 gap-y-8">
        <div className="flex-[1_1_420px] min-w-0">
          <h3 className="m-0 font-serif font-bold text-[30px] leading-[1.2] text-rising-navy">Why now?</h3>
          <p className="mt-3 text-xl">
            Our parish has grown, but giving hasn't kept pace: inflation is up 25% since COVID while giving has declined.
            We're reducing our own budget by $YXZ. Now we invite every parishioner to help close the gap.
          </p>
        </div>
        <div className="flex-[1_1_420px] min-w-0">
          <h3 className="m-0 font-serif font-bold text-[30px] leading-[1.2] text-rising-navy">How we care for your gift</h3>
          <p className="mt-3 text-xl">
            Every gift is carefully managed, with oversight from our parishioner-led Finance Committee. We'll share our
            progress openly, right here: how we're strengthening our everyday budget, meeting parish needs, and investing
            in the liturgy, ministries, buildings and community life that make Corpus Christi our spiritual home.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Questions() {
  return (
    <section className="px-6 py-[88px]">
      <div className="max-w-[1120px] mx-auto">
        <div className="max-w-[820px]">
          <SectionHeading>Questions</SectionHeading>
          <div className="flex flex-col gap-7 mt-9">
            {QUESTIONS.map(({ q, a }) => (
              <div key={q}>
                <h3 className="m-0 text-[21px] font-bold">{q}</h3>
                <p className="mt-1.5">{a}</p>
              </div>
            ))}
            <div>
              <h3 className="m-0 text-[21px] font-bold">Who can I talk to?</h3>
              <p className="mt-1.5">
                Fr. Leo at{' '}
                <a href={PASTOR_MAILTO} className="text-rising-navy font-semibold underline">
                  pastor@cc-parish.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
