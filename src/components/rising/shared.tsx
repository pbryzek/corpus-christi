import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { ReactNode } from 'react';

export const GIVE_PATH = '/give';
export const PASTOR_MAILTO =
  'mailto:pastor@cc-parish.org?cc=ministry@cc-parish.org&subject=Corpus%20Christi%20Rising';

type Variant = 'gold' | 'navy' | 'outline';

const variantClasses: Record<Variant, string> = {
  gold: 'bg-white text-rising-navy hover:bg-blue-50 shadow-md hover:shadow-xl',
  navy: 'bg-rising-navy text-white hover:bg-rising-deep shadow-md hover:shadow-lg',
  outline: 'bg-white text-rising-navy border-2 border-rising-navy hover:bg-blue-50',
};

export function pillClasses(variant: Variant = 'navy', size: 'md' | 'lg' = 'md', className = '') {
  const sizing = size === 'lg' ? 'min-h-[52px] px-8 text-lg' : 'min-h-[44px] px-5 text-base';
  return `inline-flex items-center justify-center rounded-lg font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${sizing} ${variantClasses[variant]} ${className}`;
}

export function PillLink({
  to,
  children,
  variant = 'navy',
  size = 'md',
  className = '',
}: {
  to: string;
  children: ReactNode;
  variant?: Variant;
  size?: 'md' | 'lg';
  className?: string;
}) {
  const classes = pillClasses(variant, size, className);
  if (to.startsWith('mailto:') || to.startsWith('#')) {
    return <a href={to} className={classes}>{children}</a>;
  }
  return <Link to={to} className={classes}>{children}</Link>;
}

export function VideoPlaceholder({ label }: { label: string }) {
  return (
    <div className="group aspect-video w-full rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center gap-3 p-4 text-center shadow-lg">
      <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <Play className="w-6 h-6 text-rising-navy fill-rising-navy ml-1" aria-hidden="true" />
      </span>
      <p className="m-0 text-[15px] text-blue-200">{label}</p>
    </div>
  );
}

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`m-0 font-serif font-bold text-[clamp(32px,4.5vw,46px)] leading-[1.15] text-slate-900 ${className}`}>
      {children}
    </h2>
  );
}
