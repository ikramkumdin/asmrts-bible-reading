'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import BibleBookCard from '@/components/BibleBookCard';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import EmailSignup from '@/components/EmailSignup';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);

  const bibleBooks = [
    {
      id: 'genesis',
      title: 'GENESIS',
      description: 'The Story of Jesus',
      chapters: 43,
      status: 'completed' as const,
      action: 'arrow' as const,
      isSelected: true
    },
    {
      id: 'mark',
      title: 'MARK',
      description: 'The beginning of the gospel of Jesus Christ, the Son of God;',
      status: 'free' as const,
      action: 'free' as const,
      isSelected: false
    },
    {
      id: 'luke',
      title: 'LUKE',
      description: 'Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us',
      chapters: 84,
      progress: 0,
      status: 'in-progress' as const,
      action: 'resume' as const,
      isSelected: true
    },
    {
      id: 'john',
      title: 'JOHN',
      description: 'Get the 1st sentence form chapter 1',
      status: 'free' as const,
      action: 'free' as const,
      isSelected: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 text-yellow-500" />
            Relaxing Bible Reading, Soft Spoken
            <Sparkles className="w-10 h-10 text-yellow-500" />
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the Bible through soothing ASMR narration. Choose your favorite reader and immerse yourself in God&apos;s Word with relaxing audio.
          </p>
        </div>
      </section>

      {/* Subscription Banner */}
      {showBanner && (
        <SubscriptionBanner onClose={() => setShowBanner(false)} />
      )}

      {/* Bible Books Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {bibleBooks.map((book) => (
            <BibleBookCard key={book.id} book={book} />
          ))}
        </div>
      </main>

      {/* Email Signup Section */}
      <EmailSignup />
      
      <Footer />
    </div>
  );
}
