import Link from 'next/link';

export const metadata = { title: 'Terms of Service — Exponent' };

export default function TermsPage() {
  return (
    <div className="sf-app min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/dashboard" className="text-sm" style={{ color: 'var(--sf-teal)' }}>
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">Terms of Service</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--sf-muted)' }}>Last updated: June 2026</p>

        <div className="mt-8 flex flex-col gap-6 leading-relaxed">
          <section>
            <h2 className="mb-2 text-xl font-bold">1. Acceptance</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              By creating an account or using Exponent you agree to these terms. If you do not agree,
              please do not use the service.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">2. Your account</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              You are responsible for keeping your login credentials secure and for activity on your
              account. Choose a username that does not impersonate others or contain offensive content.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">3. Fair play & conduct</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              Play fairly. Do not use automation, exploits, or third-party tools to gain an advantage
              in duels. Community chat must remain respectful; offensive language is filtered, and
              abuse may result in restrictions. Repeatedly disconnecting from matches is recorded and
              voids those matches.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">4. Content</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              You retain ownership of the profile picture you upload, but you grant Exponent permission
              to display it within the game where your identity appears. Do not upload illegal,
              infringing, or offensive images.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">5. Availability</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              Exponent is provided “as is” for a student project. We may change, suspend, or reset
              gameplay data, leaderboards, or services at any time, and the game may be unavailable
              during maintenance.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">6. Termination</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              We may suspend or terminate accounts that violate these terms. You may stop using the
              service and request account deletion at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
