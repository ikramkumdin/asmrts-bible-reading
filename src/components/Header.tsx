'use client';

import { useState } from 'react';
import { X, Sparkles, BookOpen, Headphones, AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/Auth/UserProfile';
import LoginForm from '@/components/Auth/LoginForm';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Sparkles },
    { name: 'Bible Books', href: '/bible', icon: BookOpen },
    { name: 'ASMR Voices', href: '/voices', icon: Headphones }
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-purple-900">
              <Sparkles className="w-6 h-6 text-purple-600" />
              ASMR Bible
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                  disabled={loading}
                >
                  Sign In
                </button>
                <a
                  href="https://www.asmrbible.app/#email-signup"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Subscribe
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-purple-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <AlignJustify className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {isAuthenticated ? (
                  <UserProfile className="px-4" />
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-700 hover:text-purple-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                      disabled={loading}
                    >
                      Sign In
                    </button>
                    <a
                      href="https://www.asmrbible.app/#email-signup"
                      className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Subscribe
                    </a>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="relative max-w-xl w-full">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200 hover:bg-gray-50 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <LoginForm
              onLoginSuccess={() => setShowLoginModal(false)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </header>
  );
} 