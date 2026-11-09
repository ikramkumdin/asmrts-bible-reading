import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | ASMR Audio Bible",
  description:
    "How ASMR Audio Bible collects, stores and uses your personal information when you listen, subscribe or sign in.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "November 6, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </header>

        <article className="prose prose-gray max-w-none">
          <section>
            <h2>Overview</h2>
            <p>
              This Privacy Notice for <strong>ASMR Audio Bible</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) describes how we might collect, store and use your personal information when you use
              our services, including when you visit our website{" "}
              <a href="https://www.asmrbible.app">https://www.asmrbible.app</a> or engage with us through sign-in,
              subscriptions, newsletters, or support.
            </p>
          </section>

          <section>
            <h2>Table of Contents</h2>
            <ol>
              <li>What Information Do We Collect?</li>
              <li>How Do We Process Your Information?</li>
              <li>What Legal Bases Do We Rely On?</li>
              <li>When and With Whom Do We Share Your Information?</li>
              <li>Do We Use Cookies and Tracking Technologies?</li>
              <li>How Do We Handle Your Social Logins?</li>
              <li>How Long Do We Keep Your Information?</li>
              <li>How Do We Keep Your Information Safe?</li>
              <li>Do We Collect Information from Minors?</li>
              <li>What Are Your Privacy Rights?</li>
            </ol>
          </section>

          <section>
            <h2>1. What Information Do We Collect?</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on the Services,
              subscribe to a plan, email our team, or participate in features on the Services.
            </p>
            <ul>
              <li>
                <strong>Personal Information Provided by You:</strong> your name, email address, payment information,
                audio preferences (preferred voice, bookmarks, reading progress) and social-login identifiers.
              </li>
              <li>
                <strong>Automatically Collected Information:</strong> your IP address, browser type, device information,
                pages viewed, audio playback events and other usage data gathered by privacy-respecting analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2>2. How Do We Process Your Information?</h2>
            <p>
              We process your information to provide, personalise, improve and secure our services; to deliver audio
              content and recommendations; to process payments and manage subscriptions; to send transactional emails
              and, where you have opted in, newsletters; to detect fraud or abuse; and to comply with legal obligations.
            </p>
          </section>

          <section>
            <h2>3. What Legal Bases Do We Rely On?</h2>
            <p>
              We process your information in accordance with applicable legal bases, including your consent, performance
              of a contract with you, our legitimate interests in running and improving the service, and compliance with
              our legal obligations.
            </p>
          </section>

          <section>
            <h2>4. When and With Whom Do We Share Your Information?</h2>
            <p>
              We may share your information with third-party service providers that help us operate the Services,
              including: cloud hosting providers (Vercel), database and authentication providers (Google Firebase),
              audio file storage (Google Cloud Storage), payment processors, email delivery providers (SendGrid,
              Resend), and privacy-respecting analytics (self-hosted Umami). We may also share information when required
              to by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2>5. Do We Use Cookies and Tracking Technologies?</h2>
            <p>
              Yes. We use strictly-necessary cookies for authentication and session management, and we use a
              self-hosted, privacy-respecting analytics system (Umami) that does not use third-party advertising cookies
              and does not track you across other sites. Where your browser sends a Do Not Track signal, we honour it
              for our analytics.
            </p>
          </section>

          <section>
            <h2>6. How Do We Handle Your Social Logins?</h2>
            <p>
              If you register or sign in using a social account (for example Google), we collect the profile information
              that provider makes available &mdash; typically your name, profile image, email address and an opaque
              identifier. We use that information only to create and maintain your ASMR Audio Bible account.
            </p>
          </section>

          <section>
            <h2>7. How Long Do We Keep Your Information?</h2>
            <p>
              We keep your information only as long as necessary to provide the Services, satisfy the purposes outlined
              in this policy, or as required by law. When you delete your account, we delete or anonymise your personal
              data, except for records we are required to retain (for example billing records).
            </p>
          </section>

          <section>
            <h2>8. How Do We Keep Your Information Safe?</h2>
            <p>
              We have reasonable technical and organisational measures in place to protect your information, including
              encryption in transit, access controls, and regular security reviews. No system is perfectly secure, and
              we cannot guarantee complete security against unauthorised access.
            </p>
          </section>

          <section>
            <h2>9. Do We Collect Information from Minors?</h2>
            <p>
              The Services are not directed to children under 13. We do not knowingly collect personal information from
              children under 13. If you believe we have inadvertently collected such information, please{" "}
              <Link href="/contact">contact us</Link> and we will delete it.
            </p>
          </section>

          <section>
            <h2>10. What Are Your Privacy Rights?</h2>
            <p>
              Depending on your location, you may have rights to access, correct, update, port, restrict the processing
              of, or delete your personal information. You may also have the right to withdraw consent at any time. To
              exercise any of these rights, email us at{" "}
              <a href="mailto:support@asmrbible.app">support@asmrbible.app</a> or use the{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Notice from time to time. We will post the revised version here and update the
              &ldquo;Last updated&rdquo; date at the top. Material changes will be announced through the Services.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            &copy; {new Date().getFullYear()} ASMR Audio Bible. All Rights Reserved.
          </p>
        </article>
      </div>
    </main>
  );
}
