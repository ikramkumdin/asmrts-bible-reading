'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Monitor, Sun, Moon, Clock, RotateCcw, MoreVertical, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface BibleStudyPageProps {
  params: Promise<{
    book: string;
  }>;
}

export default function BibleStudyPage({ params }: BibleStudyPageProps) {
  const [book, setBook] = useState('');
  const [selectedReader, setSelectedReader] = useState('luna');
  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [note, setNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle async params
  useEffect(() => {
    params.then(({ book: bookName }) => setBook(bookName));
  }, [params]);

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

  if (!book) {
    return <div>Loading...</div>;
  }

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
              {book.charAt(0).toUpperCase() + book.slice(1)}
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
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="frequency"
                    value="daily"
                    checked={emailFrequency === 'daily'}
                    onChange={(e) => setEmailFrequency(e.target.value)}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">Daily</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="frequency"
                    value="weekly"
                    checked={emailFrequency === 'weekly'}
                    onChange={(e) => setEmailFrequency(e.target.value)}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">Weekly</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="frequency"
                    value="monthly"
                    checked={emailFrequency === 'monthly'}
                    onChange={(e) => setEmailFrequency(e.target.value)}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">Monthly</span>
                </label>
              </div>
            </div>
          </div>

          {/* Center Column - Chapter Progress */}
          <div className="space-y-6">
            {/* Chapter Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapter Progress</h3>
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        chapter.status === 'completed' ? 'bg-green-100 text-green-800' :
                        chapter.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {chapter.status === 'completed' ? '✓' : 
                         chapter.status === 'error' ? '✗' : '⏳'}
                      </div>
                      <span className="font-medium text-gray-900">{chapter.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg">
                        <RotateCcw className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Player</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Chapter 1</h4>
                    <p className="text-sm text-gray-600">00:00 / 15:30</p>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    {isPlaying ? (
                      <div className="w-4 h-4 bg-white rounded-sm" />
                    ) : (
                      <ArrowRight className="w-5 h-5 ml-1" />
                    )}
                  </button>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chapter Text & Notes */}
          <div className="space-y-6">
            {/* Chapter Text */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapter Text</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  And God said, Let there be light: and there was light. And God saw the light, that it was good: and God divided the light from the darkness.
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Notes</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your thoughts and insights..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex items-center gap-2 mt-3">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Save Note
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Clear
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Comments</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-800">
                            {comment.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{comment.user}</span>
                        <span className="text-sm text-gray-500">{comment.time}</span>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <p className="text-gray-700 mb-3">{comment.text}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                        <MessageCircle className="w-4 h-4" />
                        Reply
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