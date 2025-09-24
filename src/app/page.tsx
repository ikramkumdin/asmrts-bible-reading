'use client';

import { Sparkles } from 'lucide-react';
import BibleBookCard from '@/components/BibleBookCard';
import EmailSignup from '@/components/EmailSignup';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBooks } from '@/lib/bibleData';

export default function HomePage() {
  const bibleBooks = getAllBooks();

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