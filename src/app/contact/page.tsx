import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | ASMR Audio Bible",
  description:
    "Get in touch with the ASMR Audio Bible team. Support, feedback, partnership and press requests.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "support@asmrbible.app";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-3 text-lg text-gray-600">
            We read every message. Here&rsquo;s the fastest way to reach the right person.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">General support</h2>
            </div>
            <p className="text-gray-700 mb-3">
              Account issues, billing questions, audio playback problems or anything else.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 text-purple-700 font-medium hover:text-purple-900"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Feedback &amp; suggestions</h2>
            </div>
            <p className="text-gray-700 mb-3">
              Tell us which voices to add, which translations you&rsquo;d love to hear, or what to build next.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Feedback`}
              className="inline-flex items-center gap-2 text-purple-700 font-medium hover:text-purple-900"
            >
              Send feedback
            </a>
          </div>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Response time</h2>
          </div>
          <p className="text-gray-700">
            We aim to reply to every message within two business days. If your request is time-sensitive &mdash;
            for example a failed payment or a blocked account &mdash; please include &ldquo;URGENT&rdquo; in the
            subject line and we&rsquo;ll prioritise it.
          </p>
        </section>

        <section className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Before you email</h2>
          <p className="text-gray-700 mb-3">
            Check the <Link href="/help" className="text-purple-700 underline">Help Centre</Link> &mdash; the most
            common questions are already answered there, often with step-by-step screenshots.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">
          &copy; {new Date().getFullYear()} ASMR Audio Bible. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
