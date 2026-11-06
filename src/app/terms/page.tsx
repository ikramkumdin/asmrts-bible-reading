import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | ASMR Audio Bible",
  description:
    "The terms that govern your use of ASMR Audio Bible, including subscriptions, acceptable use and intellectual property.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "November 6, 2026";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </header>

        <article className="prose prose-gray max-w-none">
          <section>
            <h2>Agreement to Our Legal Terms</h2>
            <p>
              We are <strong>ASMR Audio Bible</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
              &ldquo;our&rdquo;). By accessing or using our services at{" "}
              <a href="https://www.asmrbible.app">https://www.asmrbible.app</a>, you agree to be bound by these Terms.
              If you do not agree with these Terms, you must discontinue use immediately.
            </p>
          </section>

          <section>
            <h2>Table of Contents</h2>
            <ol>
              <li>Our Services</li>
              <li>Intellectual Property Rights</li>
              <li>User Representations</li>
              <li>Purchases and Payment</li>
              <li>Subscriptions and Cancellation</li>
              <li>User Contributions</li>
              <li>Prohibited Activities</li>
              <li>Disclaimer</li>
              <li>Limitation of Liability</li>
              <li>Termination</li>
            </ol>
          </section>

          <section>
            <h2>1. Our Services</h2>
            <p>
              ASMR Audio Bible provides immersive, ASMR-style narration of scripture through a web application. The
              Services are offered for personal, non-commercial use. The information provided is not intended for
              distribution to or use by any person or entity in any jurisdiction where such distribution or use would be
              contrary to law. If you access the Services from another location, you do so on your own initiative and
              are solely responsible for compliance with local laws.
            </p>
          </section>

          <section>
            <h2>2. Intellectual Property Rights</h2>
            <p>
              We are the owner or licensee of the application code, website design, synthesised audio narration, voice
              preset artwork, trademarks and other materials provided through the Services (collectively the
              &ldquo;Content&rdquo; and &ldquo;Marks&rdquo;).
            </p>
            <p>
              Scripture text is provided for reading and listening in connection with the Services. Public-domain
              translations are redistributed freely; where a translation is used under licence, it remains the property
              of the relevant publisher. You may not re-distribute the generated audio files or extract them for
              commercial reuse without our written permission.
            </p>
          </section>

          <section>
            <h2>3. User Representations</h2>
            <p>By using the Services, you represent and warrant that:</p>
            <ul>
              <li>All registration information you submit is true, accurate, current and complete;</li>
              <li>You will maintain the accuracy of such information;</li>
              <li>You have the legal capacity to agree to these Terms;</li>
              <li>
                You are not a minor in your jurisdiction, or if you are, you have your parent or guardian&rsquo;s
                permission;
              </li>
              <li>You will not access the Services through automated or non-human means;</li>
              <li>You will not use the Services for any illegal or unauthorised purpose.</li>
            </ul>
          </section>

          <section>
            <h2>4. Purchases and Payment</h2>
            <p>
              We may provide paid products, credit packs and subscription plans within the Services. Pricing is
              displayed in the application before any transaction is completed. You agree to pay all charges at the
              prices then in effect and you authorise our payment processors to charge your chosen payment method.
            </p>
          </section>

          <section>
            <h2>5. Subscriptions and Cancellation</h2>
            <p>
              Subscription plans renew automatically at the end of each billing period unless cancelled beforehand. You
              may cancel a subscription at any time from your account page; access to paid features continues through
              the end of the already-paid period. Credit packs are one-time purchases; purchased credits do not expire.
            </p>
            <p>
              Refunds are handled on a case-by-case basis. If you believe you have been charged in error, email us at{" "}
              <a href="mailto:support@asmrbible.app">support@asmrbible.app</a> within 14 days of the charge.
            </p>
          </section>

          <section>
            <h2>6. User Contributions</h2>
            <p>
              The Services may invite you to submit feedback, requests, prayer intentions or other Contributions. Any
              Contribution you submit may be used by us to improve the Services, subject to our{" "}
              <Link href="/privacy">Privacy Policy</Link>. You retain any rights you have in your original words.
            </p>
          </section>

          <section>
            <h2>7. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Systematically retrieve data or content from the Services to build a competing collection, database or
                directory without our written permission;
              </li>
              <li>Download, mirror or redistribute the generated audio files outside the Services;</li>
              <li>Use the Services to send unsolicited messages or create accounts by automated means;</li>
              <li>Use the Services to advertise or sell unrelated goods and services;</li>
              <li>Interfere with the security or performance of the Services, or attempt to bypass access controls.</li>
            </ul>
          </section>

          <section>
            <h2>8. Disclaimer</h2>
            <p>
              The Services are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. We make no
              warranties of any kind about the completeness, accuracy, reliability or availability of the audio
              narration or scripture text. ASMR Audio Bible is not a substitute for pastoral care or professional mental
              health, medical or spiritual advice.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              In no event will we or our directors, employees or agents be liable to you or any third party for any
              indirect, consequential, exemplary, incidental, special or punitive damages, including lost profit, lost
              revenue, loss of data or other damages arising from your use of the Services, even if we have been advised
              of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your access to the Services immediately, without prior notice or liability,
              for any reason, including if you breach these Terms. Upon termination, your right to use the Services will
              cease immediately. Sections which by their nature should survive termination will survive.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these Terms? Reach us at{" "}
              <a href="mailto:support@asmrbible.app">support@asmrbible.app</a> or through the{" "}
              <Link href="/contact">contact page</Link>.
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
