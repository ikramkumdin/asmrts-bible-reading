'use client';

import { BookOpen, ArrowRight, CheckCircle, Plus, Play } from 'lucide-react';
import Link from 'next/link';

interface BibleBook {
  id: string;
  title: string;
  description: string;
  chapters?: number;
  progress?: number;
  status: 'completed' | 'free' | 'in-progress';
  action: 'arrow' | 'free' | 'resume';
  isSelected: boolean;
}

interface BibleBookCardProps {
  book: BibleBook;
}

export default function BibleBookCard({ book }: BibleBookCardProps) {
  const renderAction = () => {
    switch (book.action) {
      case 'free':
        return (
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            FREE THIS MONTH
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
    if (book.status === 'completed') {
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{book.chapters} chapters</span>
        </div>
      );
    }
    
    if (book.status === 'in-progress' && book.progress !== undefined) {
      return (
        <div className="w-full">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{book.progress}/{book.chapters} chapters</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(book.progress / book.chapters) * 100}%` }}
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Link href={`/bible/${book.id.toLowerCase()}`}>
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
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
              }`}>
                {book.isSelected ? (
                  <CheckCircle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
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
    </Link>
  );
} 