'use client';

import { BookOpen, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BibleBookCard from '@/components/BibleBookCard';

export default function BibleBooksPage() {
  const allBibleBooks = [
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
      id: 'exodus',
      title: 'EXODUS',
      description: 'The story of God\'s deliverance of Israel from Egypt',
      chapters: 40,
      status: 'free',
      action: 'free',
      isSelected: false
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
    },
    {
      id: 'acts',
      title: 'ACTS',
      description: 'The continuing works of Jesus through His apostles',
      chapters: 28,
      status: 'free',
      action: 'free',
      isSelected: false
    },
    {
      id: 'romans',
      title: 'ROMANS',
      description: 'Paul\'s letter explaining the gospel of grace',
      chapters: 16,
      status: 'free',
      action: 'free',
      isSelected: false
    },
    {
      id: 'psalms',
      title: 'PSALMS',
      description: 'Songs and prayers of praise, lament, and wisdom',
      chapters: 150,
      status: 'free',
      action: 'free',
      isSelected: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Bible Books</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Explore the complete Bible through relaxing ASMR narration. Choose your favorite books and start your spiritual journey.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Bible books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bible Books Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBibleBooks.map((book) => (
            <BibleBookCard key={book.id} book={book} />
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Load More Books
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
} 