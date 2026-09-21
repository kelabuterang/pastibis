import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers, Folder, ChevronRight, FileUp, RotateCcw } from 'lucide-react';
import { Article, Folder as FolderType, MarkedVocab } from '../types';

interface HomeDashboardProps {
  articles: Article[];
  folders: FolderType[];
  markedVocabs: MarkedVocab[];
  activeArticle: Article;
  onOpenArticle: (articleId: string) => void;
  onOpenReviewPractice: () => void;
  onOpenCollections: () => void;
  onOpenPdfImport: () => void;
  onStartQuiz: (articleId?: string) => void;
  onResetAllProgress?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  articles,
  folders,
  markedVocabs,
  activeArticle,
  onOpenArticle,
  onOpenReviewPractice,
  onOpenCollections,
  onOpenPdfImport,
  onStartQuiz,
  onResetAllProgress,
}) => {
  const needsReviewCount = markedVocabs.filter(v => v.srs.status === 'needs_review').length;
  const hasReadingProgress = (activeArticle?.readingProgress || 0) > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      {/* Curved Royal Blue Top Section matching Screenshot 3 */}
      <div className="bg-blue-600 text-white pt-6 pb-12 px-5 sm:px-8 rounded-b-[40px] shadow-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Brand bar */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪽</span>
            <span className="text-xl font-black tracking-tight text-white">
              pastibisa
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onResetAllProgress && (
              <button
                onClick={() => {
                  if (window.confirm('Reset semua progres membaca dan kosakata kembali ke awal (0%)?')) {
                    onResetAllProgress();
                  }
                }}
                title="Reset progres ke awal"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-xs backdrop-blur-xs transition-colors border border-white/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Reset</span>
              </button>
            )}

            <button
              onClick={onOpenPdfImport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-xs backdrop-blur-xs transition-colors border border-white/20"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Import PDF</span>
            </button>
          </div>
        </div>

        {/* Vocabulary Count Pill matching Screenshot 3 */}
        <div className="relative z-10 flex justify-center my-2">
          <button
            onClick={onOpenReviewPractice}
            className="px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
          >
            <span className="text-yellow-300">★</span>
            <span>{markedVocabs.length} MY VOCABULARY</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-md w-full mx-auto px-4 -mt-6 flex-1 flex flex-col gap-6 relative z-20">
        {/* "Continue your journey" section */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
            CONTINUE YOUR JOURNEY
          </h2>

          <div className="space-y-3">
            {/* Blue Gradient Banner Card */}
            <div
              onClick={() => onOpenArticle(activeArticle.id)}
              className="bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>NEW SESSION</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-1">
                  Start Learning
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  Choose your level and favourite read
                </p>
              </div>

              <div className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* CONTINUE / START READING active card */}
            <div
              onClick={() => onOpenArticle(activeArticle.id)}
              className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                  {hasReadingProgress ? 'CONTINUE READING' : 'START READING'}
                </div>
                <h4 className="font-extrabold text-gray-900 text-base group-hover:text-blue-600 transition-colors truncate">
                  {activeArticle.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {activeArticle.genre} · {activeArticle.level} · {activeArticle.wordCount} vocab
                </p>

                {/* Progress bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${activeArticle.readingProgress || 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    {hasReadingProgress ? `${activeArticle.readingProgress}%` : '0% · Siap'}
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        {/* "Your learning space" section matching Screenshot 3 */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
            YOUR LEARNING SPACE
          </h2>

          <div className="space-y-2.5">
            {/* My Vocabulary item */}
            <div
              onClick={onOpenReviewPractice}
              className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">My Vocabulary</h4>
                  <p className="text-xs text-gray-500">
                    {markedVocabs.length > 0
                      ? `${markedVocabs.length} vocab tersimpan`
                      : '0 vocab tersimpan · Tandai kata saat membaca'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>

            {/* Review Practice item */}
            <div
              onClick={onOpenReviewPractice}
              className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center relative">
                  <Layers className="w-5 h-5" />
                  {needsReviewCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">Review Practice</h4>
                    {needsReviewCount > 0 && (
                      <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[10px]">
                        {needsReviewCount} perlu review
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {needsReviewCount > 0
                      ? 'Latih vocab yang masih perlu diulang'
                      : 'Belum ada kata yang perlu direview'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>

            {/* Collections & Folders item */}
            <div
              onClick={onOpenCollections}
              className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 hover:border-blue-200 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Koleksi & Folder Artikel</h4>
                  <p className="text-xs text-gray-500">
                    {folders.length} folder · {articles.length} artikel tersimpan
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        </section>

        {/* Action Button */}
        {markedVocabs.length > 0 ? (
          <button
            onClick={() => onStartQuiz(activeArticle.id)}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Mulai Quiz Vocab Recall Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onOpenArticle(activeArticle.id)}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Mulai Membaca & Tandai Kosakata</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </main>
    </div>
  );
};

