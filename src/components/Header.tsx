'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Headphones, AlignJustify, User, LogIn } from 'lucide-react';
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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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

          {/* Mobile Auth & Menu */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100"
                  disabled={loading}
                >
                  Sign In
                </button>
                <a
                  href="https://www.asmrbible.app/#email-signup"
                  className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Subscribe
                </a>
              </>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <AlignJustify className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white z-50 md:hidden shadow-2xl mobile-sidebar-enter">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="text-xl font-bold">ASMR Bible</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 group"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <p className="text-sm text-white/70 text-center">
                  Experience the Bible in a whole new way
                </p>
              </div>
            </div>
          </div>
        </>
      )}

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