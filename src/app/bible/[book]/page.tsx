'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Monitor, Sun, Moon, Clock, RotateCcw, MoreVertical, Edit, Trash2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface BibleStudyPageProps {
  params: {
    book: string;
  };
}

export default function BibleStudyPage({ params }: BibleStudyPageProps) {
  const [selectedReader, setSelectedReader] = useState('luna');
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [note, setNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const readers = [
    { id: 'luna', name: 'Luna', avatar: '👩‍🦰' },
    { id: 'river', name: 'River', avatar: '👨‍🦱' },
    { id: 'aria', name: 'Aria', avatar: '👩‍🦳' },
    { id: 'heartsease', name: 'Heartsease', avatar: '👨‍🦲' }
  ];

  const chapters = [
    { id: 1, title: 'Chapter 1', status: 'completed', hasError: false },
    { id: 2, title: 'Chapter 2', status: 'error', hasError: true },
    { id: 3, title: 'Chapter 3', status: 'pending', hasError: false }
  ];

  const comments = [
    {
      id: 1,
      user: 'marsdream',
      text: 'test',
      time: '37 minutes ago',
      likes: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">
              {params.book.charAt(0).toUpperCase() + params.book.slice(1)}
              <span className="ml-3 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Studying
              </span>
            </h1>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Monitor className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Sun className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Moon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Progress Tab */}
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
              Progress
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Preferences */}
          <div className="space-y-6">
            {/* Reader Selection */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your favorite:</h3>
              <div className="grid grid-cols-2 gap-3">
                {readers.map((reader) => (
                  <button
                    key={reader.id}
                    onClick={() => setSelectedReader(reader.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedReader === reader.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{reader.avatar}</div>
                    <div className="text-sm font-medium text-gray-900">{reader.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your newsletters:</h3>
              <p className="text-gray-600 mb-3">you have subscribed this!</p>
              <button className="text-blue-600 hover:text-blue-800 underline text-sm">
                un-subscribed
              </button>
            </div>

            {/* Email Frequency */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email frequency:</h3>
              <div className="space-y-2">
                {['daily', 'weekly', 'never'].map((freq) => (
                  <label key={freq} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="emailFrequency"
                      value={freq}
                      checked={emailFrequency === freq}
                      onChange={(e) => setEmailFrequency(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 capitalize">{freq}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Audio Player & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chapter Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapters</h3>
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center gap-3">
                    {chapter.status === 'completed' && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {chapter.status === 'error' && (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">⚠</span>
                      </div>
                    )}
                    {chapter.status === 'pending' && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full" />
                    )}
                    
                    <span className="text-gray-900 font-medium">{chapter.title}</span>
                    
                    {chapter.hasError && (
                      <span className="text-yellow-600 text-sm">Email error</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Audio of {params.book.charAt(0).toUpperCase() + params.book.slice(1)} - Chapter 1
              </h3>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    {isPlaying ? (
                      <div className="w-4 h-4 bg-gray-900" />
                    ) : (
                      <div className="w-0 h-0 border-l-[8px] border-l-gray-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <div className="text-white text-sm">0:00</div>
                  </div>
                  
                  <button className="w-8 h-8 text-white hover:text-gray-300">
                    🔊
                  </button>
                  
                  <button className="w-8 h-8 text-white hover:text-gray-300">
                    ⬇️
                  </button>
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <span>✓</span>
                  Mark as complete
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5" />
                </button>
                
                <span className="text-gray-600">1x</span>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chapter Text */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {params.book.charAt(0).toUpperCase() + params.book.slice(1)} - Chapter 1
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p><span className="font-semibold">1.</span> The book of the generation of Jesus Christ, the son of David, the son of Abraham.</p>
                <p><span className="font-semibold">2.</span> Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;</p>
                <p><span className="font-semibold">3.</span> And Judas begat Phares and Zara of Thamar; and Phares begat Esrom; and Esrom begat Aram;</p>
                <p><span className="font-semibold">4.</span> And Aram begat Aminadab; and Aminadab begat Naasson; and Naasson begat Salmon;</p>
                <p><span className="font-semibold">5.</span> And Salmon begat Booz of Rachab; and Booz begat Obed of Ruth; and Obed begat Jesse;</p>
                <p><span className="font-semibold">6.</span> And Jesse begat David the king; and David the king begat Solomon of her that had been the wife of Urias;</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My note:</h3>
              <div className="relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Want writedown some notes? type here!"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Comment
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{comment.user}</span>
                        <span className="text-sm text-gray-500">{comment.time}</span>
                      </div>
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.text}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-600">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                        reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 