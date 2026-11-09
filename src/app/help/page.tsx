import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Centre | ASMR Audio Bible",
  description:
    "Answers to the most common questions about ASMR Audio Bible: voices, subscriptions, playback and account.",
  alternates: { canonical: "/help" },
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "support@asmrbible.app";

type QA = { q: string; a: React.ReactNode };

const SECTIONS: { title: string; items: QA[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "What is ASMR Audio Bible?",
        a: (
          <>
            ASMR Audio Bible is a web application that narrates scripture with soothing, ASMR-style voices. You can
            listen a chapter at a time or verse by verse, bookmark where you stopped, and switch between voices.
          </>
        ),
      },
      {
        q: "Do I need an account to listen?",
        a: (
          <>
            You can browse books and play sample audio without signing in. Signing in (with Google) unlocks progress
            tracking, bookmarks, cross-device sync and subscription features.
          </>
        ),
      },
      {
        q: "Which voices are available?",
        a: (
          <>
            Right now two voices are live: <strong>Aria</strong> (warm, feminine) and <strong>Heartsease</strong>
            (gentle, breathy). More are planned &mdash; subscribe to the newsletter or email us to request a voice.
          </>
        ),
      },
    ],
  },
  {
    title: "Audio &amp; playback",
    items: [
      {
        q: "Why does a chapter say &ldquo;No Audio&rdquo;?",
        a: (
          <>
            Our audio library is being generated and uploaded in batches. If a chapter says audio is unavailable, it
            hasn&rsquo;t been produced yet. We&rsquo;re working book-by-book to fill the gaps. Aria has the broadest
            coverage today; Heartsease is catching up.
          </>
        ),
      },
      {
        q: "Can I play verse by verse?",
        a: (
          <>
            Yes. On the chapter page, tap any verse to play just that verse; tap &ldquo;Play chapter&rdquo; at the top
            to play the whole chapter end to end. The player remembers where you stopped.
          </>
        ),
      },
      {
        q: "Does the app work offline?",
        a: (
          <>
            Audio is streamed, so an internet connection is required. If you need offline support for a trip or quiet
            place, let us know &mdash; it&rsquo;s on our roadmap.
          </>
        ),
      },
    ],
  },
  {
    title: "Account &amp; sign-in",
    items: [
      {
        q: "How do I sign in?",
        a: (
          <>
            Use the &ldquo;Sign In&rdquo; button in the header, then choose Google. We don&rsquo;t currently support
            email/password sign-in &mdash; social sign-in is faster and more secure for an app like this.
          </>
        ),
      },
      {
        q: "Can I delete my account?",
        a: (
          <>
            Yes. Email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the address you signed up
            with and we&rsquo;ll remove your account and all personal data, except records we&rsquo;re legally required
            to keep (for example billing receipts).
          </>
        ),
      },
    ],
  },
  {
    title: "Subscriptions &amp; credits",
    items: [
      {
        q: "What&rsquo;s the difference between a subscription and a credit pack?",
        a: (
          <>
            Subscriptions renew monthly or annually and give you ongoing access to premium features. Credit packs are
            one-time purchases; the credits never expire. If you&rsquo;re new, the Taste pack is a low-risk way to try
            the service.
          </>
        ),
      },
      {
        q: "Where do I manage my subscription?",
        a: (
          <>
            On the <Link href="/account" className="text-purple-700 underline">account page</Link>. You can see your
            current plan, next renewal date and remaining credits there, and cancel at any time.
          </>
        ),
      },
      {
        q: "I was charged but didn&rsquo;t receive credits",
        a: (
          <>
            Email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with the order ID from the payment
            confirmation. Include &ldquo;URGENT&rdquo; in the subject and we&rsquo;ll reconcile the balance.
          </>
        ),
      },
    ],
  },
  {
    title: "Privacy &amp; data",
    items: [
      {
        q: "What data do you collect?",
        a: (
          <>
            See our <Link href="/privacy" className="text-purple-700 underline">Privacy Policy</Link>. In short: your
            email + profile picture from Google, your listening progress and bookmarks, and privacy-respecting
            analytics that do not track you across other sites.
          </>
        ),
      },
      {
        q: "Do you sell my data?",
        a: <>No. We never sell or rent personal information to third parties.</>,
      },
    ],
  },
];

export default function HelpCentrePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Help Centre</h1>
          <p className="mt-3 text-lg text-gray-600">
            The questions people ask most. If yours isn&rsquo;t here, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-purple-700 underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </header>

        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2
                className="text-2xl font-semibold text-gray-900 mb-4"
                dangerouslySetInnerHTML={{ __html: section.title }}
              />
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <details
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm open:shadow-md transition-shadow"
                  >
                    <summary
                      className="cursor-pointer font-medium text-gray-900 marker:text-purple-500"
                      dangerouslySetInnerHTML={{ __html: item.q }}
                    />
                    <div className="mt-3 text-gray-700 leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-700">
            Our team reads every message. Reach us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-purple-700 underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            or through the <Link href="/contact" className="text-purple-700 underline">contact page</Link>.
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-12">
          &copy; {new Date().getFullYear()} ASMR Audio Bible. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
