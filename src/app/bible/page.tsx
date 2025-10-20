'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Sparkles, 
  Heart, 
  Star,
  Clock,
  Users,
  ChevronDown,
  Play,
  Headphones,
  ArrowRight,
  CheckCircle,
  Flame
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BibleBookCard from '@/components/BibleBookCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '@/lib/bibleData';
import { trackPageView } from '@/lib/firebaseConfig';

export default function BibleBooksPage() {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Track page view
  useEffect(() => {
    trackPageView('bible_books', 'Bible Books - ASMR Audio Bible');
  }, []);

  const currentBooks = activeTab === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;
  
  const filteredBooks = currentBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show limited books initially, all books when expanded
  const displayedBooks = showAllBooks ? filteredBooks : filteredBooks.slice(0, 6);
  const hasMoreBooks = filteredBooks.length > 6;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset showAllBooks when tab changes
  useEffect(() => {
    setShowAllBooks(false);
  }, [activeTab]);

  const handleLoadMore = () => {
    setShowAllBooks(!showAllBooks);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-6xl font-bold">
                Sacred <span className="text-yellow-400">Scriptures</span>
              </h1>
            </div>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in the timeless wisdom of God's Word through our soothing ASMR narration. 
              Experience each book as a journey of spiritual discovery and inner peace.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold">66</span>
                </div>
                <p className="text-gray-200 text-sm">Sacred Books</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Headphones className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold">2</span>
                </div>
                <p className="text-gray-200 text-sm">ASMR Voices</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold">∞</span>
                </div>
                <p className="text-gray-200 text-sm">Peaceful Hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testament Navigation */}
        <section className="bg-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center mb-8">
              <div className="flex bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-2 shadow-lg">
                <button
                  onClick={() => setActiveTab('old')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'old'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                  }`}
                >
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                  Old Testament
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === 'new'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                  }`}
                >
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-500" />
                  </div>
                  New Testament
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'old' ? 'Old' : 'New'} Testament books...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-300 text-lg"
                />
              </div>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </button>
                <button className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl hover:border-purple-300 hover:text-purple-600 transition-all duration-300">
                  <Star className="w-5 h-5" />
                  Favorites
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testament Info */}
        <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                {activeTab === 'old' ? (
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <h2 className="text-3xl font-bold text-gray-900">
                  {activeTab === 'old' ? 'Old Testament' : 'New Testament'}
                </h2>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                {activeTab === 'old' 
                  ? 'The foundation of faith - 39 books containing the Law, History, Poetry, and Prophets that reveal God\'s covenant with His people'
                  : 'The fulfillment of promise - 27 books containing the Gospels, Acts, Epistles, and Revelation that reveal Christ\'s love and salvation'
                }
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{filteredBooks.length} books available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span>ASMR narration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Relaxing experience</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bible Books Grid */}
        <main className="max-w-6xl mx-auto px-4 py-16">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No books found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or browse all available books
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-2xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedBooks.map((book) => (
                  <BibleBookCard key={book.id} book={book} />
                ))}
              </div>
              
              {/* Load More / Show Less Section */}
              {isClient && hasMoreBooks && (
                <div className="text-center mt-16">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {showAllBooks ? 'Showing All Books' : 'Discover More Sacred Texts'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      {showAllBooks 
                        ? `You're viewing all ${filteredBooks.length} books from the ${activeTab === 'old' ? 'Old' : 'New'} Testament`
                        : `Continue your spiritual journey with more books from the ${activeTab === 'old' ? 'Old' : 'New'} Testament`
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button 
                        onClick={handleLoadMore}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAllBooks ? 'rotate-180' : ''}`} />
                        {showAllBooks ? 'Show Less Books' : 'Load More Books'}
                      </button>
                      
                      {!showAllBooks && (
                        <div className="text-gray-500 text-sm">
                          Showing {displayedBooks.length} of {filteredBooks.length} books
                        </div>
                      )}
                      
                      {showAllBooks && (
                        <div className="text-gray-500 text-sm">
                          Showing all {filteredBooks.length} books
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-4xl font-bold">Begin Your Spiritual Journey</h2>
            </div>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Choose your favorite book and start experiencing the Bible through our soothing ASMR narration. 
              Transform your daily reading into a peaceful, meditative experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3">
                <Play className="w-5 h-5" />
                Start Reading Now
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center gap-3">
                <Headphones className="w-5 h-5" />
                Try Free Sample
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}