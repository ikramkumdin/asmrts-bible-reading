'use client';

import { Sparkles, Heart, Mail, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

// Social URLs — set to real profiles when they exist. An empty string hides
// the icon so we never ship a visible link that points to "#".
const SOCIAL = {
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER ?? '',
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? '',
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? '',
};

type SocialIconProps = {
  href: string;
  label: string;
  Icon: typeof Twitter;
};

function SocialIcon({ href, label, Icon }: SocialIconProps) {
  if (!href) return null;
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold">ASMR Bible</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Experience the Bible through relaxing ASMR narration. Choose your favorite reader and immerse yourself in God&apos;s Word with soothing audio.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon href={SOCIAL.twitter} label="ASMR Bible on Twitter" Icon={Twitter} />
              <SocialIcon href={SOCIAL.instagram} label="ASMR Bible on Instagram" Icon={Instagram} />
              <SocialIcon href={SOCIAL.facebook} label="ASMR Bible on Facebook" Icon={Facebook} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/bible" className="text-gray-300 hover:text-white transition-colors">
                  Bible Books
                </Link>
              </li>
              <li>
                <Link href="/voices" className="text-gray-300 hover:text-white transition-colors">
                  ASMR Voices
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {year} ASMR Bible. Made with <Heart className="w-4 h-4 inline text-red-500" aria-hidden="true" /> for Christian community.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span className="text-gray-400 text-sm">Subscribe to our newsletter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
