import { Link, Navigate, useLocation } from 'react-router-dom';
import { useHubRole } from '../../lib/useHubRole';

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Awaiting approval',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  published: 'On the calendar',
  held: 'Held',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-amber-100 text-amber-800',
  changes_requested: 'bg-orange-100 text-orange-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-emerald-100 text-emerald-800',
  held: 'bg-indigo-100 text-indigo-800',
  closed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-700'}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-red-700 text-sm">
      {message}
    </div>
  );
}

/**
 * Gate plus chrome for every /hub page.
 *
 * Access needs a row in `user_roles`, not merely a session: the parish's
 * existing admin accounts and any future ministry-leader accounts are both
 * ordinary Supabase users, and signup is open, so "signed in" is not a
 * permission. RLS enforces the same thing server-side.
 */
export default function HubShell({ children }: { children: React.ReactNode }) {
  const { session, loading, hasHubAccess, isAdmin, isFinance, isComms, signOut } = useHubRole();
  const { pathname } = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasHubAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <h1 className="text-xl font-bold text-slate-800">No hub access yet</h1>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            You're signed in as <span className="font-medium">{session.user.email}</span>, but no
            ministry role has been assigned to this account yet. Ask the parish office to add you as
            a ministry leader.
          </p>
          <button
            onClick={() => void signOut()}
            className="mt-6 text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const tabs: { to: string; label: string }[] = [{ to: '/hub', label: 'My events' }];
  if (isAdmin) tabs.push({ to: '/hub/approvals', label: 'Approvals' });
  if (isFinance || isAdmin) tabs.push({ to: '/hub/finance', label: 'Finance' });
  if (isComms || isAdmin) tabs.push({ to: '/hub/communications', label: 'Communications' });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="min-w-0">
              <Link to="/hub" className="font-bold text-slate-800 truncate block">
                Ministry Hub
              </Link>
              <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 hidden sm:inline">
                Parish site
              </Link>
              <button
                onClick={() => void signOut()}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Sign out
              </button>
            </div>
          </div>
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(t => {
              const active = t.to === '/hub' ? pathname === '/hub' : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                    active
                      ? 'border-blue-700 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
