import { useState } from 'react';
import { Link } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const interests = [
  { value: "New to the parish",    label: "I'm new to the parish" },
  { value: "Exploring Catholicism", label: "I'm exploring Catholicism or new to the faith" },
  { value: "Kids' sacraments",     label: "I have kids interested in sacraments" },
  { value: "Just want to connect", label: "I just want to connect and learn more" },
];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function RegistrationPage() {
  const [firstName, setFirstName]   = useState('');
  const [lastName,  setLastName]    = useState('');
  const [email,     setEmail]       = useState('');
  const [phone,     setPhone]       = useState('');
  const [checked,   setChecked]     = useState<string[]>([]);
  const [message,   setMessage]     = useState('');
  const [website,   setWebsite]     = useState('');
  const [status,    setStatus]      = useState<FormState>('idle');

  function toggleCheck(value: string) {
    setChecked(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    if (!/\S+@\S+\.\S+/.test(email)) return;

    if (website) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        email:     email.trim(),
        phone:     phone.trim() || null,
        interests: checked.length ? checked.join(', ') : null,
        message:   message.trim() || null,
      };

      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-form`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submission failed');

      fetch(`${SUPABASE_URL}/functions/v1/send-registration-emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{
      fontFamily: 'Georgia, serif',
      background: '#FDFAF6',
      color: '#1C1C1E',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 16px 48px',
    }}>

      {/* Back button */}
      <div style={{ width: '100%', maxWidth: 600, padding: '20px 0 0' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          letterSpacing: '0.06em',
          color: '#2C3E6B',
          textDecoration: 'none',
          borderBottom: '1px solid #2C3E6B44',
          paddingBottom: 1,
        }}>
          ← Back to Homepage
        </Link>
      </div>

      {/* Header */}
      <header style={{ width: '100%', maxWidth: 600, padding: '28px 0 0', textAlign: 'center' }}>
        <span style={{ color: '#2C3E6B', fontSize: 22, lineHeight: 1, display: 'block', marginBottom: 4 }}>✛</span>
        <p style={{
          fontSize: 13,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#B8972E',
          fontFamily: 'Georgia, serif',
          marginBottom: 0,
        }}>
          Corpus Christi Catholic Parish · Piedmont, CA
        </p>
      </header>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 600,
        background: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
        padding: '36px 32px',
        marginTop: 20,
      }}>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🕊️</div>
            <h2 style={{ fontSize: 24, color: '#2C3E6B', marginBottom: 12, fontWeight: 'normal' }}>
              Welcome to the community.
            </h2>
            <p style={{
              fontSize: 15,
              color: '#6B6B6B',
              lineHeight: 1.7,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              maxWidth: 420,
              margin: '0 auto',
            }}>
              We're grateful you reached out. Watch for an email from us soon — and if you'd like to visit before then, we'd love to see you at Mass.<br /><br />
              <em>— The Corpus Christi Team</em>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>

            {/* Welcome copy */}
            <h1 style={{ fontSize: 26, fontWeight: 'normal', color: '#2C3E6B', lineHeight: 1.3, marginBottom: 12 }}>
              You found us.<br />We're so glad you're here.
            </h1>
            <p style={{
              fontSize: 15,
              color: '#6B6B6B',
              lineHeight: 1.65,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              marginBottom: 28,
            }}>
              Tell us a little about yourself and someone from our welcome ministry will reach out.
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid #E2DDD6', marginBottom: 28 }} />

            {/* Anti-spam honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>

            {/* Name row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <FieldLabel>First Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="First"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  type="text"
                  placeholder="Last"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 24 }}>
              <FieldLabel optional>Phone</FieldLabel>
              <Input
                type="tel"
                placeholder="(510) 555-0100"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            {/* Interests */}
            <p style={{
              fontSize: 13,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#6B6B6B',
              marginBottom: 12,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}>
              What brings you here?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {interests.map(item => (
                <label key={item.value} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checked.includes(item.value)}
                    onChange={() => toggleCheck(item.value)}
                    style={{ width: 20, height: 20, accentColor: '#2C3E6B', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span style={{
                    fontSize: 15,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    color: '#1C1C1E',
                    lineHeight: 1.4,
                  }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Message */}
            <div style={{ marginBottom: 24 }}>
              <FieldLabel optional>Anything else you'd like us to know?</FieldLabel>
              <textarea
                placeholder="We're listening..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{
                  border: '1px solid #E2DDD6',
                  borderRadius: 8,
                  padding: '11px 14px',
                  fontSize: 15,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  color: '#1C1C1E',
                  background: '#fff',
                  width: '100%',
                  resize: 'vertical',
                  minHeight: 80,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              style={{
                width: '100%',
                background: status === 'submitting' ? '#aaa' : '#2C3E6B',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 24px',
                fontSize: 16,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em',
                transition: 'background 0.2s',
              }}
            >
              {status === 'submitting' ? 'Sending…' : 'Say Hello →'}
            </button>

            {status === 'error' && (
              <p style={{
                color: '#B00020',
                fontSize: 13,
                marginTop: 10,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                textAlign: 'center',
              }}>
                Something went wrong. Please try again or email us at office@cc-parish.org.
              </p>
            )}
          </form>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: 24,
        textAlign: 'center',
        fontSize: 12,
        color: '#bbb',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        322 St. James Drive, Piedmont, CA 94611 &nbsp;·&nbsp; office@cc-parish.org
      </footer>
    </div>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <div style={{
      fontSize: 12,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#6B6B6B',
      marginBottom: 6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {children}
      {optional && (
        <span style={{ fontSize: 11, letterSpacing: 0, textTransform: 'none', color: '#aaa', marginLeft: 4 }}>
          (optional)
        </span>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        border: '1px solid #E2DDD6',
        borderRadius: 8,
        padding: '11px 14px',
        fontSize: 15,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#1C1C1E',
        background: '#fff',
        width: '100%',
        boxSizing: 'border-box',
        WebkitAppearance: 'none',
      }}
    />
  );
}
