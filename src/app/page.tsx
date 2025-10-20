'use client';

import { useEffect } from 'react';
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
import { getAllBooks } from '@/lib/bibleData';
import Link from 'next/link';

export default function HomePage() {
  const bibleBooks = getAllBooks();
  const featuredBooks = bibleBooks.slice(0, 6);

  // Track page view
  useEffect(() => {
    trackPageView('home', 'ASMR Audio Bible - Home');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Experience the Bible in a 
            <span className="text-yellow-400"> Whole New Way</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in God's Word with our soothing ASMR Audio Bible. 
            Specially crafted to help you relax, meditate, and connect with Scripture 
            on a deeper level through immersive audio journeys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bible" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Play className="w-5 h-5 inline mr-2" />
              Start Listening Now
            </Link>
            <Link 
              href="/voices" 
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 backdrop-blur-sm border border-white/30"
            >
              <Headphones className="w-5 h-5 inline mr-2" />
              Try Free Sample
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why ASMR Audio Bible?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your Bible study with immersive audio experiences designed for relaxation and spiritual growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Immersive Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Our binaural recording techniques create a 3D audio experience that makes you feel present as the Scriptures are read with crystal-clear quality.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deep Relaxation</h3>
              <p className="text-gray-600 leading-relaxed">
                Soft whispers and gentle sounds create a calming atmosphere perfect for meditation, stress relief, and peaceful sleep.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scripture Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience the Bible in a fresh way that enhances comprehension and retention without distractions, perfect for busy lifestyles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bible Books Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore the Bible</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated collection of Bible books, each with multiple ASMR voice options for your perfect listening experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredBooks.map((book) => (
              <BibleBookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/bible" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 inline-flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse All 66 Books
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Listeners Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users who have transformed their Bible experience</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl relative">
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
            
            <div className="bg-gray-50 p-8 rounded-2xl relative">
              <div className="absolute top-6 left-6 text-6xl text-purple-200 font-serif">"</div>
              <p className="text-gray-700 italic mb-6 relative z-10">
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
            
            <div className="bg-gray-50 p-8 rounded-2xl relative">
              <div className="absolute top-6 left-6 text-6xl text-purple-200 font-serif">"</div>
              <p className="text-gray-700 italic mb-6 relative z-10">
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
      <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Premium Features</h2>
            <p className="text-xl text-gray-200">Everything you need for the perfect Bible listening experience</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-200 text-sm">Track your reading progress and mark chapters as complete</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Download className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Offline Access</h3>
              <p className="text-gray-200 text-sm">Download chapters for offline listening anywhere</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Smartphone className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mobile App</h3>
              <p className="text-gray-200 text-sm">Access your Bible on any device, anytime</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Shield className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-200 text-sm">Your data is protected with enterprise-grade security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Begin Your Audio Journey Today</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Join thousands of listeners who have transformed their Bible experience with our soothing ASMR recordings. 
            Start with our free samples or get full access now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bible" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300"
            >
              Get Full Access
            </Link>
            <Link 
              href="/voices" 
              className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 backdrop-blur-sm border border-white/30"
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