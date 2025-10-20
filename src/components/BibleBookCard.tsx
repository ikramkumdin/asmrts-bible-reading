'use client';

import { BookOpen, ArrowRight, CheckCircle, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTracking } from '@/contexts/TrackingContext';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';

interface BibleBook {
  id: string;
  title: string;
  description: string;
  chapters?: number;
  progress?: number;
  status: 'completed' | 'available' | 'in-progress';
  action: 'arrow' | 'read' | 'resume';
  isSelected: boolean;
}

interface BibleBookCardProps {
  book: BibleBook;
}

export default function BibleBookCard({ book }: BibleBookCardProps) {
  const { isAuthenticated } = useAuth();
  const { getBookProgress } = useTracking();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get book progress from tracking system
  const bookProgress = isClient ? getBookProgress(book.id) : null;

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const renderAction = () => {
    switch (book.action) {
      case 'read':
        return (
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            Read Now
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      case 'resume':
        return (
          <div className="text-blue-600 flex items-center gap-2 cursor-pointer hover:text-blue-700">
            Resume
            <ArrowRight className="w-4 h-4" />
          </div>
        );
      default:
        return <ArrowRight className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderProgress = () => {
    // Always show basic chapter count to avoid hydration issues
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <BookOpen className="w-4 h-4" />
        <span>{book.chapters || 'Multiple'} chapters</span>
      </div>
    );
  };

  const CardContent = () => (
    <div className="bg-white rounded-xl shadow-xl border-2 border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{book.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{book.description}</p>
          
          {renderProgress()}
        </div>
        
        {/* Toggle Switch */}
        <div className="ml-4">
          <div className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
            book.isSelected ? 'bg-yellow-500' : 'bg-gray-300'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
              book.isSelected ? 'translate-x-6' : 'translate-x-0.5'
            } flex items-center justify-center`}>
              {book.isSelected ? (
                <CheckCircle className="w-3 h-3 text-yellow-600" />
              ) : (
                <Plus className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        {renderAction()}
      </div>
    </div>
  );

  return (
    <>
      {isAuthenticated ? (
        <Link href={`/bible/${book.id.toLowerCase()}`}>
          <CardContent />
        </Link>
      ) : (
        <div onClick={handleCardClick}>
          <CardContent />
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-xl w-full">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200 hover:bg-gray-50 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <LoginForm
              onLoginSuccess={() => setShowLoginModal(false)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}/* Force refresh */
