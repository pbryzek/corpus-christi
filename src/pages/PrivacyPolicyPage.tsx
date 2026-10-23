import { usePageData } from '../lib/usePageData';

export default function PrivacyPolicyPage() {
  const { content } = usePageData('privacy');
  const hero = content['hero'];
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{hero?.title || 'Privacy Policy'}</h1>
        <p className="text-sm text-gray-400 mb-10">{hero?.subtitle || 'Effective date: October 20, 2026'}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Overview</h2>
            <p>
              Corpus Christi Catholic Church, Piedmont ("we," "us," or "our") is committed to
              protecting your privacy. This policy describes what information we collect through
              this website, how we use it, and how we protect it. We do not sell, rent, or share
              your personal information with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Information We Collect</h2>
            <p>We collect information only when you voluntarily submit it through one of our forms:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <span className="font-medium text-slate-800">Contact form</span> — name, email
                address, and message content.
              </li>
              <li>
                <span className="font-medium text-slate-800">Prayer request form</span> — your
                name and the prayer intention you submit. Prayer requests are visible to parish
                staff and may be shared prayerfully with the parish community.
              </li>
              <li>
                <span className="font-medium text-slate-800">Registration forms</span> — name,
                contact information, and program-specific details (e.g., sacrament preparation,
                faith formation enrollment).
              </li>
              <li>
                <span className="font-medium text-slate-800">Sacrament inquiry forms</span> —
                name, contact information, and notes about your inquiry.
              </li>
            </ul>
            <p className="mt-4">
              We use Google Analytics to understand how visitors use our website, such as which
              pages are viewed and how people find us. This information is collected automatically
              and in aggregate; it does not include your name, email address, or anything you enter
              into our forms. See the Third-Party Services section below for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">How We Use Your Information</h2>
            <p>Information submitted through our forms is used solely to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Respond to your inquiry or request.</li>
              <li>Process your program registration or sacramental inquiry.</li>
              <li>Send transactional confirmation emails related to your submission.</li>
              <li>Pray for and support you as a member of our parish community.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Data Storage &amp; Security</h2>
            <p>
              Form submissions are stored securely in a hosted database (Supabase) with row-level
              security controls. Access is limited to authorized parish staff. We take reasonable
              technical measures to protect your data, though no system is completely secure.
            </p>
            <p className="mt-3">
              Admin staff authentication uses secure token-based sessions stored in your browser's
              local storage — not cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Children's Privacy</h2>
            <p>
              Our website is not directed at children under 13. We do not knowingly collect personal
              information from children. Registration forms for programs that include minors collect
              family contact information provided by a parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Third-Party Services</h2>
            <p>This website uses the following third-party services:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <span className="font-medium text-slate-800">Supabase</span> — database and
                authentication hosting. See{' '}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  Supabase Privacy Policy
                </a>.
              </li>
              <li>
                <span className="font-medium text-slate-800">Google Analytics</span> — measures
                website traffic using cookies. It collects information such as the pages you visit,
                time spent on the site, your general location (city or region), device and browser
                type, and the website that referred you. Google Analytics does not tell us who you
                are. You can opt out by installing the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>{' '}
                or by blocking cookies in your browser. See{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  How Google uses information from sites that use its services
                </a>.
              </li>
              <li>
                <span className="font-medium text-slate-800">YouTube (embedded)</span> — some
                pages embed YouTube videos. YouTube may set cookies when you interact with embedded
                video players. See{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  Google Privacy Policy
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Rights</h2>
            <p>
              You may contact us at any time to request access to, correction of, or deletion of
              any personal information you have submitted. We will honor such requests to the extent
              practicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Contact Us</h2>
            <p>If you have questions about this policy, please contact the parish office:</p>
            <div className="mt-3 space-y-1">
              <p>Corpus Christi Catholic Church</p>
              <p>322 St. James Drive, Piedmont, CA</p>
              <p>
                <a href="tel:5105304343" className="text-slate-700 underline hover:text-slate-900">
                  510.530.4343
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. The effective date at the top of this
              page reflects when it was last revised.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
