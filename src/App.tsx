import React, { useState, useEffect } from 'react';
import { Article, Folder, MarkedVocab, DisplaySettings, PhraseType, CEFRLevel } from './types';
import {
  getSavedArticles,
  saveArticles,
  getSavedFolders,
  saveFolders,
  getSavedVocab,
  saveVocab,
  getSavedSettings,
  saveSettings,
  getActiveArticleId,
  saveActiveArticleId,
  updateVocabSRS,
  resetAllProgressData,
} from './utils/storage';
import { HomeDashboard } from './components/HomeDashboard';
import { ArticleReader } from './components/ArticleReader';
import { VocabRecallQuiz } from './components/VocabRecallQuiz';
import { ReviewPractice } from './components/ReviewPractice';
import { CollectionsView } from './components/CollectionsView';
import { PdfImportModal } from './components/PdfImportModal';
import { Home, BookOpen, FolderOpen, RotateCcw } from 'lucide-react';
import { normalizeText } from './utils/textAnalyzer';

type AppView = 'home' | 'reader' | 'quiz' | 'review' | 'collections';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [articles, setArticles] = useState<Article[]>(getSavedArticles);
  const [folders, setFolders] = useState<Folder[]>(getSavedFolders);
  const [markedVocabs, setMarkedVocabs] = useState<MarkedVocab[]>(getSavedVocab);
  const [activeArticleId, setActiveArticleId] = useState<string>(getActiveArticleId);
  const [settings, setSettings] = useState<DisplaySettings>(getSavedSettings);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Custom quiz dataset (e.g. from Review Practice)
  const [quizConfig, setQuizConfig] = useState<{
    vocabs: MarkedVocab[];
    title: string;
  } | null>(null);

  // Sync state to local storage
  useEffect(() => {
    saveArticles(articles);
  }, [articles]);

  useEffect(() => {
    saveFolders(folders);
  }, [folders]);

  useEffect(() => {
    saveVocab(markedVocabs);
  }, [markedVocabs]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveActiveArticleId(activeArticleId);
  }, [activeArticleId]);

  // Current active article fallback
  const activeArticle = articles.find(a => a.id === activeArticleId) || articles[0];

  // Handlers
  const handleOpenArticle = (id: string) => {
    setActiveArticleId(id);
    setCurrentView('reader');
  };

  const handleToggleMarkVocab = (
    word: string,
    translation: string,
    phraseType: PhraseType,
    level: CEFRLevel,
    context?: string
  ) => {
    const cleanWord = normalizeText(word);
    const existingIndex = markedVocabs.findIndex(v => normalizeText(v.word) === cleanWord);

    if (existingIndex >= 0) {
      // Unmark
      const updated = markedVocabs.filter((_, idx) => idx !== existingIndex);
      setMarkedVocabs(updated);
    } else {
      // Mark new
      const newVocab: MarkedVocab = {
        id: `voc-${Date.now()}`,
        articleId: activeArticle.id,
        articleTitle: activeArticle.title,
        word,
        translation,
        phraseType,
        level,
        contextSentence: context,
        dateAdded: new Date().toISOString(),
        srs: {
          status: 'needs_review',
          repetitionLevel: 0,
          nextReviewDate: new Date().toISOString(),
          incorrectAttempts: 0,
          correctAttempts: 0,
        },
      };
      setMarkedVocabs([newVocab, ...markedVocabs]);
    }
  };

  const handleUpdateVocabSRS = (vocabId: string, wasCorrect: boolean) => {
    setMarkedVocabs(prev =>
      prev.map(v => {
        if (v.id === vocabId) {
          return updateVocabSRS(v, wasCorrect);
        }
        return v;
      })
    );
  };

  const handleStartQuiz = (articleId?: string) => {
    if (articleId) {
      const filtered = markedVocabs.filter(v => v.articleId === articleId);
      const art = articles.find(a => a.id === articleId);
      setQuizConfig({
        vocabs: filtered.length > 0 ? filtered : markedVocabs.slice(0, 10),
        title: art?.title || 'Vocab Recall Quiz',
      });
    } else {
      setQuizConfig({
        vocabs: markedVocabs.length > 0 ? markedVocabs : [],
        title: 'Semua Vocab Recall',
      });
    }
    setCurrentView('quiz');
  };

  const handleStartReviewQuiz = (vocabsToReview: MarkedVocab[], title: string) => {
    setQuizConfig({
      vocabs: vocabsToReview,
      title,
    });
    setCurrentView('quiz');
  };

  const handleArticleImported = (newArticle: Article) => {
    setArticles([newArticle, ...articles]);
    setActiveArticleId(newArticle.id);
    setCurrentView('reader');
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    setFolders([...folders, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    const fallbackFolder = folders.find(f => f.id !== folderId);
    if (fallbackFolder) {
      setArticles(prev =>
        prev.map(a => (a.folderId === folderId ? { ...a, folderId: fallbackFolder.id } : a))
      );
    }
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const handleMoveArticle = (articleId: string, newFolderId: string) => {
    setArticles(prev =>
      prev.map(a => (a.id === articleId ? { ...a, folderId: newFolderId } : a))
    );
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
    if (activeArticleId === articleId) {
      const remaining = articles.filter(a => a.id !== articleId);
      if (remaining.length > 0) {
        setActiveArticleId(remaining[0].id);
      }
    }
  };

  const handleMarkAsMastered = (vocabId: string) => {
    setMarkedVocabs(prev =>
      prev.map(v => (v.id === vocabId ? { ...v, srs: { ...v.srs, status: 'mastered' } } : v))
    );
  };

  const handleResetToReview = (vocabId: string) => {
    setMarkedVocabs(prev =>
      prev.map(v => (v.id === vocabId ? { ...v, srs: { ...v.srs, status: 'needs_review' } } : v))
    );
  };

  const handleUpdateArticleProgress = (articleId: string, progress: number) => {
    setArticles(prev =>
      prev.map(a =>
        a.id === articleId
          ? {
              ...a,
              readingProgress: Math.max(a.readingProgress || 0, progress),
              lastReadAt: new Date().toISOString(),
            }
          : a
      )
    );
  };

  const handleResetAllProgress = () => {
    const res = resetAllProgressData();
    setArticles(res.articles);
    setMarkedVocabs(res.vocab);
    setActiveArticleId(res.articles[0]?.id || 'art-garden');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col">
      {/* Dynamic Views */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeDashboard
            articles={articles}
            folders={folders}
            markedVocabs={markedVocabs}
            activeArticle={activeArticle}
            onOpenArticle={handleOpenArticle}
            onOpenReviewPractice={() => setCurrentView('review')}
            onOpenCollections={() => setCurrentView('collections')}
            onOpenPdfImport={() => setIsPdfModalOpen(true)}
            onStartQuiz={handleStartQuiz}
            onResetAllProgress={handleResetAllProgress}
          />
        )}

        {currentView === 'reader' && (
          <ArticleReader
            article={activeArticle}
            onBack={() => setCurrentView('home')}
            onStartQuiz={handleStartQuiz}
            markedVocabs={markedVocabs}
            onToggleMarkVocab={handleToggleMarkVocab}
            settings={settings}
            onUpdateSettings={setSettings}
            onUpdateProgress={handleUpdateArticleProgress}
          />
        )}

        {currentView === 'quiz' && (
          <VocabRecallQuiz
            articleTitle={quizConfig?.title}
            vocabs={quizConfig?.vocabs || markedVocabs}
            onBack={() => setCurrentView('reader')}
            onUpdateVocabSRS={handleUpdateVocabSRS}
            onStartReviewPractice={() => setCurrentView('review')}
          />
        )}

        {currentView === 'review' && (
          <ReviewPractice
            vocabs={markedVocabs}
            onBack={() => setCurrentView('home')}
            onStartQuizWithVocabs={handleStartReviewQuiz}
            onMarkAsMastered={handleMarkAsMastered}
            onResetToReview={handleResetToReview}
          />
        )}

        {currentView === 'collections' && (
          <CollectionsView
            articles={articles}
            folders={folders}
            onBack={() => setCurrentView('home')}
            onSelectArticle={handleOpenArticle}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
            onMoveArticle={handleMoveArticle}
            onDeleteArticle={handleDeleteArticle}
            onOpenPdfImport={() => setIsPdfModalOpen(true)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden during Quiz) */}
      {currentView !== 'quiz' && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-3 sm:px-6 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                currentView === 'home' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[11px]">Beranda</span>
            </button>

            <button
              onClick={() => setCurrentView('reader')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                currentView === 'reader' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[11px]">Baca</span>
            </button>

            <button
              onClick={() => setCurrentView('collections')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                currentView === 'collections' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span className="text-[11px]">Koleksi</span>
            </button>

            <button
              onClick={() => setCurrentView('review')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors relative ${
                currentView === 'review' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-[11px]">Review</span>
              {markedVocabs.filter(v => v.srs.status === 'needs_review').length > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>
        </nav>
      )}

      {/* PDF & Article Import Modal */}
      <PdfImportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        folders={folders}
        onArticleImported={handleArticleImported}
      />
    </div>
  );
}
