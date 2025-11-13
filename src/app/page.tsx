'use client';

import { useEffect, useState } from 'react';
import { 
  Sparkles, 
  Headphones, 
  Heart, 
  BookOpen, 
  Play, 
  Star,
  Users,
  Clock,
  Shield,
  Download,
  Smartphone,
  Wifi
} from 'lucide-react';
import BibleBookCard from '@/components/BibleBookCard';
import EmailSignup from '@/components/EmailSignup';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { trackPageView } from '@/lib/firebaseConfig';
import type { BibleBook } from '@/lib/bibleData';
import Link from 'next/link';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<BibleBook[]>([]);
  
  useEffect(() => {
    // Dynamically import bibleData only on client side to avoid SSR issues with large file
    import('@/lib/bibleData').then(({ getAllBooks }) => {
      const bibleBooks = getAllBooks();
      setFeaturedBooks(bibleBooks.slice(0, 6));
    }).catch((error) => {
      console.error('Error loading bible data:', error);
    });
  }, []);

  // Track page view
  useEffect(() => {
    trackPageView('home', 'ASMR Audio Bible - Home');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Experience the Bible in a 
            <span className="text-yellow-400"> Whole New Way</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Immerse yourself in God's Word with our soothing ASMR Audio Bible. 
            Specially crafted to help you relax, meditate, and connect with Scripture 
            on a deeper level through immersive audio journeys.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link 
              href="/bible" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-center min-h-[44px] flex items-center justify-center"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
              Start Listening Now
            </Link>
            <Link 
              href="/voices" 
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-300 backdrop-blur-sm border border-white/30 text-center min-h-[44px] flex items-center justify-center"
            >
              <Headphones className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
              Try Free Sample
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Why ASMR Audio Bible?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Transform your Bible study with immersive audio experiences designed for relaxation and spiritual growth
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="text-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Headphones className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Immersive Experience</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Our binaural recording techniques create a 3D audio experience that makes you feel present as the Scriptures are read with crystal-clear quality.
              </p>
            </div>
            
            <div className="text-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Deep Relaxation</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Soft whispers and gentle sounds create a calming atmosphere perfect for meditation, stress relief, and peaceful sleep.
              </p>
            </div>
            
            <div className="text-center p-4 md:p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Scripture Focus</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Experience the Bible in a fresh way that enhances comprehension and retention without distractions, perfect for busy lifestyles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bible Books Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Explore the Bible</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Choose from our carefully curated collection of Bible books, each with multiple ASMR voice options for your perfect listening experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {featuredBooks.map((book) => (
              <BibleBookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/bible" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-300 inline-flex items-center justify-center min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Browse All 66 Books
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">What Listeners Say</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">Join thousands of satisfied users who have transformed their Bible experience</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-gray-50 p-4 md:p-8 rounded-2xl relative">
              <div className="absolute top-6 left-6 text-6xl text-purple-200 font-serif">"</div>
              <p className="text-gray-700 italic mb-6 relative z-10">
                "I've struggled with anxiety for years. Listening to the Psalms with ASMR has become my daily therapy. It calms my mind like nothing else."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SJ
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah J.</h4>
                  <p className="text-gray-600">California</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-8 rounded-2xl relative">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-4xl md:text-6xl text-purple-200 font-serif">"</div>
              <p className="text-sm md:text-base text-gray-700 italic mb-4 md:mb-6 relative z-10">
                "As someone with ADHD, traditional Bible reading was challenging. This format helps me focus and actually remember what I've heard!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MR
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael R.</h4>
                  <p className="text-gray-600">Texas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 md:p-8 rounded-2xl relative">
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-4xl md:text-6xl text-purple-200 font-serif">"</div>
              <p className="text-sm md:text-base text-gray-700 italic mb-4 md:mb-6 relative z-10">
                "I fall asleep listening to the Gospels every night. It's transformed both my sleep quality and my relationship with Scripture."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  EP
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Elizabeth P.</h4>
                  <p className="text-gray-600">Florida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Premium Features</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 px-2">Everything you need for the perfect Bible listening experience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Clock className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-sm md:text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-200 text-xs md:text-sm">Track your reading progress and mark chapters as complete</p>
            </div>
            
            <div className="text-center p-4 md:p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Download className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-sm md:text-xl font-semibold mb-2">Offline Access</h3>
              <p className="text-gray-200 text-xs md:text-sm">Download chapters for offline listening anywhere</p>
            </div>
            
            <div className="text-center p-4 md:p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-sm md:text-xl font-semibold mb-2">Mobile App</h3>
              <p className="text-gray-200 text-xs md:text-sm">Access your Bible on any device, anytime</p>
            </div>
            
            <div className="text-center p-4 md:p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Shield className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-sm md:text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-200 text-xs md:text-sm">Your data is protected with enterprise-grade security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Begin Your Audio Journey Today</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of listeners who have transformed their Bible experience with our soothing ASMR recordings. 
            Start with our free samples or get full access now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link 
              href="/bible" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-300 text-center min-h-[44px] flex items-center justify-center"
            >
              Get Full Access
            </Link>
            <Link 
              href="/voices" 
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-300 backdrop-blur-sm border border-white/30 text-center min-h-[44px] flex items-center justify-center"
            >
              Try Free Samples
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <EmailSignup />
      
      <Footer />
    </div>
  );
}