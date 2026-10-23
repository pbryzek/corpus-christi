import { useEffect, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowLeft, HandCoins, LogIn, NotebookPen } from 'lucide-react';
import { WIDGET_CSS } from '../lib/mpWidgets';

const TABS = [
  { to: '/login', label: 'Sign in', icon: LogIn },
  { to: '/My-Giving', label: 'My Giving', icon: HandCoins },
  { to: '/My-Pledges', label: 'My Pledges', icon: NotebookPen },
];

function AccountLayout({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#1e3a6e] px-6 pt-14 pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/preview"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Corpus Christi Rising
          </Link>
          <p className="mt-8 text-sm font-semibold tracking-widest uppercase text-blue-300">Your giving account</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold font-serif text-white leading-tight">{title}</h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl leading-relaxed">{intro}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-14 pb-20">
        <nav className="flex flex-wrap gap-2 mb-6" aria-label="Giving account pages">
          {TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-[#1e3a6e] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`
              }
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 min-h-[320px]">{children}</div>
        <p className="mt-6 text-sm text-slate-500 text-center">
          Questions about your giving? Contact the parish office at{' '}
          <a href="mailto:office@cc-parish.org" className="text-[#1e3a6e] font-semibold underline underline-offset-2">
            office@cc-parish.org
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export function MpLoginPage() {
  return (
    <AccountLayout
      title="Sign In"
      intro="Sign in to view your giving history, manage recurring gifts and download tax statements."
    >
      <mpp-user-login customcss={WIDGET_CSS}></mpp-user-login>
    </AccountLayout>
  );
}

export function MyGivingPage() {
  return (
    <AccountLayout title="My Giving" intro="Review your gifts to Corpus Christi and download your giving statements.">
      <mpp-my-giving hidesoftcredits="false" customcss={WIDGET_CSS}></mpp-my-giving>
    </AccountLayout>
  );
}

export function MyPledgesPage() {
  return (
    <AccountLayout title="My Pledges" intro="See your campaign pledges and how much you've given toward each one.">
      <mpp-my-pledges hidecancelbuttonpledge="true" customcss={WIDGET_CSS}></mpp-my-pledges>
    </AccountLayout>
  );
}
