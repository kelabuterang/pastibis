import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Layers, Volume2, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { MarkedVocab } from '../types';
import { speakEnglish } from '../utils/audio';

interface ReviewPracticeProps {
  vocabs: MarkedVocab[];
  onBack: () => void;
  onStartQuizWithVocabs: (selectedVocabs: MarkedVocab[], title: string) => void;
  onMarkAsMastered: (vocabId: string) => void;
  onResetToReview: (vocabId: string) => void;
}

export const ReviewPractice: React.FC<ReviewPracticeProps> = ({
  vocabs,
  onBack,
  onStartQuizWithVocabs,
  onMarkAsMastered,
  onResetToReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'needs_review' | 'mastered'>('needs_review');

  const needsReviewVocabs = useMemo(() => {
    return vocabs.filter(v => v.srs.status === 'needs_review');
  }, [vocabs]);

  const masteredVocabs = useMemo(() => {
    return vocabs.filter(v => v.srs.status === 'mastered');
  }, [vocabs]);

  const displayedList = useMemo(() => {
    const base = activeTab === 'needs_review' ? needsReviewVocabs : masteredVocabs;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      v => v.word.toLowerCase().includes(q) || v.translation.toLowerCase().includes(q)
    );
  }, [activeTab, needsReviewVocabs, masteredVocabs, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-12">
      {/* Royal Blue Top Bar matching Screenshot 1 */}
      <div className="bg-blue-600 text-white pt-4 pb-8 px-4 sm:px-6 rounded-b-[36px] shadow-md">
        {/* Navigation & Brand */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-blue-700 active:bg-blue-800 text-white transition-colors"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
            <span className="text-xl">🪽</span>
            <span className="text-lg font-black tracking-tight">pastibisa</span>
          </div>

          <div className="w-8" />
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Review Practice
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1">
            Practise vocab you previously answered incorrectly
          </p>
        </div>

        {/* Counter cards matching Screenshot 1 */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('needs_review')}
            className={`p-4 rounded-2xl text-left transition-all border ${
              activeTab === 'needs_review'
                ? 'bg-white/20 border-white text-white shadow-xs'
                : 'bg-blue-700/40 border-transparent text-blue-200 hover:bg-blue-700/60'
            }`}
          >
            <div className="text-2xl sm:text-3xl font-black mb-0.5 leading-none">
              {needsReviewVocabs.length}
            </div>
            <div className="text-xs font-bold tracking-wide uppercase">
              Needs review
            </div>
          </button>

          <button
            onClick={() => setActiveTab('mastered')}
            className={`p-4 rounded-2xl text-left transition-all border ${
              activeTab === 'mastered'
                ? 'bg-white/20 border-white text-white shadow-xs'
                : 'bg-blue-700/40 border-transparent text-blue-200 hover:bg-blue-700/60'
            }`}
          >
            <div className="text-2xl sm:text-3xl font-black mb-0.5 leading-none">
              {masteredVocabs.length}
            </div>
            <div className="text-xs font-bold tracking-wide uppercase">
              Mastered
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md w-full mx-auto px-4 -mt-4 flex-1 flex flex-col">
        {/* Search input matching Screenshot 1 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vocab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium text-gray-800 placeholder-gray-400 shadow-xs border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Start Practice Action Bar if there are words to review */}
        {activeTab === 'needs_review' && needsReviewVocabs.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => onStartQuizWithVocabs(needsReviewVocabs, 'Review Practice: Needs Review')}
              className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Mulai Latihan Spaced Repetition ({needsReviewVocabs.length} kata)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* List or Empty State */}
        {displayedList.length === 0 ? (
          /* Empty state matching Screenshot 1 */
          <div className="bg-white rounded-3xl p-8 shadow-xs border-2 border-dashed border-gray-200 text-center my-auto flex flex-col items-center justify-center min-h-[260px]">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
              <Layers className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-gray-700 font-bold text-sm max-w-[240px] leading-snug">
              {activeTab === 'needs_review'
                ? 'Nothing to review yet. Incorrect quiz answers will appear here.'
                : 'Belum ada vocab yang ditandai Mastered.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayedList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex items-center justify-between gap-3 hover:border-blue-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 text-base truncate">
                      {item.word}
                    </span>
                    <button
                      onClick={() => speakEnglish(item.word)}
                      className="text-blue-600 hover:text-blue-700 p-1 -m-1"
                      title="Dengar pengucapan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 truncate">
                    {item.translation}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    Dari: {item.articleTitle}
                  </p>
                </div>

                {/* Status indicator & toggle */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.srs.status === 'needs_review' ? (
                    <button
                      onClick={() => onMarkAsMastered(item.id)}
                      className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Tandai sudah hafal/mastered"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Kuasai</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onResetToReview(item.id)}
                      className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 text-xs font-bold transition-colors flex items-center gap-1"
                      title="Kembalikan ke daftar perlu review"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
