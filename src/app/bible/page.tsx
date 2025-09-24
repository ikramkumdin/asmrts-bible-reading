'use client';

import { useState } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BibleBookCard from '@/components/BibleBookCard';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '@/lib/bibleData';

export default function BibleBooksPage() {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');
  const [searchTerm, setSearchTerm] = useState('');

  const currentBooks = activeTab === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;
  
  const filteredBooks = currentBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Testament Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('old')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'old'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Old Testament
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'new'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                New Testament
              </button>
            </div>
          </div>
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
                placeholder={`Search ${activeTab === 'old' ? 'Old' : 'New'} Testament books...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Testament Info */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {activeTab === 'old' ? 'Old Testament' : 'New Testament'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'old' 
                ? 'The first 39 books of the Bible, containing the Law, History, Poetry, and Prophets'
                : 'The last 27 books of the Bible, containing the Gospels, Acts, Epistles, and Revelation'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {filteredBooks.length} books available
            </p>
          </div>
        </div>
      </section>

      {/* Bible Books Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BibleBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
        
        {/* Load More Button */}
        {filteredBooks.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Load More Books
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}