'use client';

import { useState } from 'react';
import { Headphones, Play, Heart, Star, Volume2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VoicesPage() {
  const [selectedVoice, setSelectedVoice] = useState('luna');

  const voices = [
    {
      id: 'luna',
      name: 'Luna',
      avatar: '👩‍🦰',
      description: 'Soft, gentle voice perfect for meditation and relaxation',
      specialties: ['Gospels', 'Psalms', 'Meditation'],
      rating: 4.9,
      followers: 12450,
      isFavorite: true,
      sampleAudio: 'luna_sample.mp3'
    },
    {
      id: 'river',
      name: 'River',
      avatar: '👨‍🦱',
      description: 'Deep, calming voice ideal for storytelling and wisdom books',
      specialties: ['Genesis', 'Proverbs', 'Narratives'],
      rating: 4.8,
      followers: 9870,
      isFavorite: false,
      sampleAudio: 'river_sample.mp3'
    },
    {
      id: 'aria',
      name: 'Aria',
      avatar: '👩‍🦳',
      description: 'Clear, melodic voice perfect for poetry and letters',
      specialties: ['Psalms', 'Epistles', 'Poetry'],
      rating: 4.7,
      followers: 15620,
      isFavorite: true,
      sampleAudio: 'aria_sample.mp3'
    },
    {
      id: 'heartsease',
      name: 'Heartsease',
      avatar: '👨‍🦲',
      description: 'Warm, comforting voice for healing and encouragement',
      specialties: ['Comfort', 'Healing', 'Encouragement'],
      rating: 4.9,
      followers: 11230,
      isFavorite: false,
      sampleAudio: 'heartsease_sample.mp3'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Headphones className="w-12 h-12" />
            <h1 className="text-4xl font-bold">ASMR Voices</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Choose your favorite narrator and experience the Bible through soothing ASMR audio. Each voice brings a unique style to your spiritual journey.
          </p>
        </div>
      </section>

      {/* Voices Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {voices.map((voice) => (
            <div key={voice.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-6xl">{voice.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{voice.name}</h3>
                    <button
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`p-2 rounded-full transition-colors ${
                        voice.isFavorite 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${voice.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{voice.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{voice.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-4 h-4" />
                      <span>{voice.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specialties */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {voice.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Sample Audio */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Sample Audio</h4>
                    <p className="text-xs text-gray-500">Listen to {voice.name}'s voice</p>
                  </div>
                  <button className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                    <Play className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Choose {voice.name}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Voice Selection Guide */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Choose Your Voice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Listen to Samples</h3>
              <p className="text-gray-600 text-sm">Try each voice to find the one that resonates with you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consider Your Mood</h3>
              <p className="text-gray-600 text-sm">Different voices work better for different times and moods</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Read Reviews</h3>
              <p className="text-gray-600 text-sm">See what other listeners say about each voice</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 