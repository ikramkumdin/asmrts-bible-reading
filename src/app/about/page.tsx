'use client';

import { BookOpen, Headphones, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About ASMR Bible</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            We believe that experiencing God&apos;s Word should be both spiritually enriching and physically relaxing. 
            Our mission is to make Bible study accessible, enjoyable, and beneficial for your overall well-being.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600">
            To provide a unique Bible study experience that combines the power of God&apos;s Word with the therapeutic 
            benefits of ASMR. We help Christians find peace, relaxation, and spiritual growth in their daily Bible reading.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose ASMR Bible?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Bible Coverage</h3>
              <p className="text-gray-600">Access to all 66 books with chapter-by-chapter ASMR narration</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multiple Voice Options</h3>
              <p className="text-gray-600">Choose from various ASMR narrators with unique styles</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Spiritual Wellness</h3>
              <p className="text-gray-600">Combine relaxation with spiritual growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of believers who have transformed their Bible study experience.
          </p>
          <button
            onClick={() => window.location.href = '/bible'}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explore Bible Books
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
} 