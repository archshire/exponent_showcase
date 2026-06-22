import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Exponent' };

export default function PrivacyPage() {
  return (
    <div className="sf-app min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/dashboard" className="text-sm" style={{ color: 'var(--sf-teal)' }}>
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">Privacy Policy</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--sf-muted)' }}>Last updated: June 2026</p>

        <div className="mt-8 flex flex-col gap-6 leading-relaxed" style={{ color: 'var(--sf-text)' }}>
          <section>
            <h2 className="mb-2 text-xl font-bold">1. What we collect</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              To run Exponent we store the account information you provide — your username, email
              address, and a securely hashed password (never the plain password). If you sign in with
              a third-party provider (such as 42), we store only the identifier needed to recognise
              your account. We also store an optional profile picture you choose to upload.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">2. Gameplay data</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              We keep your progression data: Aura Points, completed PvP match summaries, CPU unlock
              progress, friendships, and disconnect counts. Live match state, question events, and
              community chat messages are held only in server memory during a session and are not
              written to our database.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">3. How we use it</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              Your data is used solely to provide the game: authentication, matchmaking, leaderboards,
              friends, and chat. We do not sell your personal data or use it for advertising.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">4. Who can see your data</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              Other players can see public profile information — your username, profile picture, Aura
              Points, and online status. Your email address and password are never shown to anyone.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-xl font-bold">5. Your choices</h2>
            <p style={{ color: 'var(--sf-muted)' }}>
              You can change your username, email, password, profile picture, and language at any time
              from your profile and settings pages. To request deletion of your account, contact the
              site operator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
