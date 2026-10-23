import { useState } from 'react';
import { Mail } from 'lucide-react';
import { PillLink, SectionHeading, VideoPlaceholder } from './shared';

function inviteLink(subject: string, body: string) {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildInvites(origin: string) {
  return [
    {
      label: 'Mass',
      href: inviteLink(
        'Join me at Mass?',
        `I'd love for you to come to Mass with me at Corpus Christi. It's a warm, welcoming community, and I think you'd feel at home. Here's what to expect and the Mass times: ${origin}/new-visitors\n\nLet me know which Sunday works. We can sit together!`,
      ),
    },
    {
      label: 'A parish event',
      href: inviteLink(
        'Come to this with me?',
        `There's something coming up at Corpus Christi I think you'd enjoy. It's a great way to meet people, and I'd love to go together. Here's what's on the calendar: ${origin}/calendar\n\nWant to join me?`,
      ),
    },
    {
      label: 'Volunteer with me',
      href: inviteLink(
        'Want to volunteer together?',
        `I've been looking for ways to give back at Corpus Christi, and I'd love to do it with you. There are lots of ways to help, from welcoming newcomers to serving our neighbors. Take a look: ${origin}/ministries\n\nWhich one sounds fun to you?`,
      ),
    },
  ];
}

const cardClasses =
  'bg-white border border-rising-line rounded-2xl p-[26px] flex flex-col gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(30,58,110,0.4)]';

export default function PrayVolunteerInvite() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const invites = buildInvites(window.location.origin);

  return (
    <section id="pray" className="px-6 py-[88px] bg-rising-sand">
      <div className="max-w-[1120px] mx-auto">
        <SectionHeading>
          Pray. Volunteer. Invite.
          <span className="block">Everyone has something to give.</span>
        </SectionHeading>
        <div className="flex flex-wrap gap-10 items-center mt-7">
          <div className="flex-[1.2_1_420px] min-w-0">
            <p className="m-0 text-xl">
              <b>Our goal is 100% participation.</b> Not everyone can give financially, and everyone has something to
              offer. However you take part, count yourself in.
            </p>
          </div>
          <div className="flex-[1_1_360px] min-w-0">
            <VideoPlaceholder label="[Video testimony: a longtime parishioner]" />
          </div>
        </div>

        <div className="grid gap-5 mt-10 grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))]">
          <div className={cardClasses}>
            <h3 className="m-0 font-serif font-bold text-[26px] text-rising-navy">Pray</h3>
            <p className="m-0 text-rising-muted">Join the campaign prayer list and receive the Corpus Christi Rising prayer.</p>
            <div className="mt-auto">
              <PillLink to="/contact" variant="outline" className="mt-2">Join the prayer list</PillLink>
            </div>
          </div>
          <div className={cardClasses}>
            <h3 className="m-0 font-serif font-bold text-[26px] text-rising-navy">Volunteer</h3>
            <p className="m-0 text-rising-muted">Find a ministry that fits your gifts and your schedule.</p>
            <div className="mt-auto">
              <PillLink to="/ministries" variant="outline" className="mt-2">Find a ministry</PillLink>
            </div>
          </div>
          <div className={cardClasses}>
            <h3 className="m-0 font-serif font-bold text-[26px] text-rising-navy">Invite</h3>
            <p className="m-0 text-rising-muted">Bring someone to Mass or a parish event. Everyone is welcome here.</p>
            <div className="mt-auto">
              <button
                type="button"
                onClick={() => setInviteOpen((o) => !o)}
                aria-expanded={inviteOpen}
                aria-controls="invite-panel"
                className={`inline-flex items-center min-h-[44px] mt-2 px-5 rounded-lg border-2 border-rising-navy font-bold text-base transition-all duration-200 hover:-translate-y-0.5 ${
                  inviteOpen ? 'bg-rising-navy text-white' : 'bg-white text-rising-navy hover:bg-rising-navy hover:text-white'
                }`}
              >
                Invite someone
              </button>
            </div>
          </div>
        </div>

        {inviteOpen && (
          <div
            id="invite-panel"
            className="mt-5 bg-white border-2 border-rising-navy rounded-2xl p-6 animate-[fadeIn_200ms_ease-out]"
          >
            <p className="m-0 font-bold text-[19px]">What would you like to invite them to?</p>
            <p className="mt-1 text-rising-muted text-base">We'll open an email you can personalize and send to anyone.</p>
            <div className="flex flex-wrap gap-2.5 mt-3.5">
              {invites.map((inv) => (
                <a
                  key={inv.label}
                  href={inv.href}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-lg bg-rising-navy text-white font-semibold text-base transition-all duration-200 hover:bg-rising-deep hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {inv.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <p className="mt-12 mx-auto max-w-[760px] text-center font-serif italic text-2xl leading-[1.45] text-rising-navy">
          “There are different workings but the same God who produces all of them in everyone.”
        </p>
        <p className="mt-2 text-center text-[15px] tracking-[0.06em] text-rising-muted">1 CORINTHIANS 12:6</p>
      </div>
    </section>
  );
}
