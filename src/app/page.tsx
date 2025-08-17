'use client';

import { useState } from 'react';
import { Sparkles, Info, X, BookOpen, ArrowRight, CheckCircle, Plus, Play } from 'lucide-react';
import BibleBookCard from '@/components/BibleBookCard';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import EmailSignup from '@/components/EmailSignup';

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);

  const bibleBooks = [
    {
      id: 'genesis',
      title: 'GENESIS',
      description: 'The Story of Jesus',
      chapters: 43,
      status: 'completed',
      action: 'arrow',
      isSelected: true
    },
    {
      id: 'mark',
      title: 'MARK',
      description: 'The beginning of the gospel of Jesus Christ, the Son of God;',
      status: 'free',
      action: 'free',
      isSelected: false
    },
    {
      id: 'luke',
      title: 'LUKE',
      description: 'Forasmuch as many have taken in hand to set forth in order a declaration of those things which are most surely believed among us',
      chapters: 84,
      progress: 0,
      status: 'in-progress',
      action: 'resume',
      isSelected: true
    },
    {
      id: 'john',
      title: 'JOHN',
      description: 'Get the 1st sentence form chapter 1',
      status: 'free',
      action: 'free',
      isSelected: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Relaxing Bible Reading, Soft Spoken
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </h1>
      </header>

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
    </div>
  );
}
