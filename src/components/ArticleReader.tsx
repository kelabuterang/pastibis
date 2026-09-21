import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  SlidersHorizontal,
  ChevronLeft,
  ArrowRight,
  Volume2,
  Sparkles,
  Type,
  MessageSquare,
  Globe2,
} from 'lucide-react';
import { Article, DisplaySettings, MarkedVocab, PhraseType, CEFRLevel } from '../types';
import {
  BUILTIN_DICTIONARY,
  PHRASE_TYPE_COLORS,
  findTranslation,
  normalizeText,
  extractAutomaticPhrases,
} from '../utils/textAnalyzer';
import { TranslationPopup } from './TranslationPopup';
import { DisplayModeModal } from './DisplayModeModal';
import { speakEnglish } from '../utils/audio';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onStartQuiz: (articleId?: string) => void;
  markedVocabs: MarkedVocab[];
  onToggleMarkVocab: (word: string, translation: string, phraseType: PhraseType, level: CEFRLevel, context?: string) => void;
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: DisplaySettings) => void;
  onUpdateProgress?: (articleId: string, progress: number) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onStartQuiz,
  markedVocabs,
  onToggleMarkVocab,
  settings,
  onUpdateSettings,
  onUpdateProgress,
}) => {
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [readingMode, setReadingMode] = useState<'phrase' | 'sentence'>('phrase');
  const [selectedTextPopup, setSelectedTextPopup] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // Track user reading progress as they scroll through the article
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 30) {
        if ((article.readingProgress || 0) < 100) {
          onUpdateProgress?.(article.id, 100);
        }
        return;
      }
      const percent = Math.min(100, Math.max(0, Math.round((scrollY / totalHeight) * 100)));
      if (percent > (article.readingProgress || 0)) {
        onUpdateProgress?.(article.id, percent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id, article.readingProgress, onUpdateProgress]);

  const [selectedWord, setSelectedWord] = useState<{
    word: string;
    translation: string;
    phraseType: PhraseType;
    level: CEFRLevel;
    ipa?: string;
    context?: string;
  } | null>(null);

  const articleContainerRef = useRef<HTMLDivElement>(null);

  // Marked vocabs for this specific article
  const articleMarkedCount = useMemo(() => {
    return markedVocabs.filter((v) => v.articleId === article.id).length;
  }, [markedVocabs, article.id]);

  // Map of lowercase marked words for quick lookup
  const markedMap = useMemo(() => {
    const map = new Map<string, MarkedVocab>();
    markedVocabs.forEach((v) => {
      map.set(normalizeText(v.word), v);
    });
    return map;
  }, [markedVocabs]);

  // Automatically analyze the article content and identify all multi-word phrases & grammar patterns
  const autoIdentifiedPhrases = useMemo(() => {
    return extractAutomaticPhrases(article.content);
  }, [article.content]);

  // Combined phrase lookup map (Builtin + Auto-extracted from article text)
  const phrasesMap = useMemo(() => {
    const map = new Map<string, { type: PhraseType; level: CEFRLevel; translation?: string }>();

    // 1. Builtin dictionary phrases
    for (const [key, val] of Object.entries(BUILTIN_DICTIONARY)) {
      map.set(normalizeText(key), { type: val.phraseType, level: val.level, translation: val.translation });
    }

    // 2. Dynamically extracted phrases from current article (e.g. from imported PDF)
    for (const item of autoIdentifiedPhrases) {
      const clean = normalizeText(item.phrase);
      if (!map.has(clean)) {
        map.set(clean, { type: item.type, level: item.level });
      }
    }

    return map;
  }, [autoIdentifiedPhrases]);

  // Sorted phrases by length descending to match longest phrases first
  const sortedPhrases = useMemo(() => {
    const multiWords: string[] = [];
    for (const key of phrasesMap.keys()) {
      if (key.includes(' ') || key.includes('-')) {
        multiWords.push(key);
      }
    }
    return multiWords.sort((a, b) => b.length - a.length);
  }, [phrasesMap]);

  // Statistics for identified phrases banner
  const phraseStats = useMemo(() => {
    const stats: Record<string, number> = {
      noun: 0,
      verb: 0,
      connector: 0,
      preposition: 0,
      adj: 0,
    };
    autoIdentifiedPhrases.forEach((p) => {
      if (p.type === 'noun_phrase') stats.noun++;
      else if (p.type === 'verb_phrase') stats.verb++;
      else if (p.type === 'connector') stats.connector++;
      else if (p.type === 'preposition') stats.preposition++;
      else if (p.type === 'adj_phrase') stats.adj++;
    });
    return stats;
  }, [autoIdentifiedPhrases]);

  // Listen for user text selection to allow translating arbitrary words/sentences
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedTextPopup(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length >= 2 && text.length <= 300) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setSelectedTextPopup({
              text,
              x: Math.min(window.innerWidth - 120, Math.max(16, rect.left + rect.width / 2 - 60)),
              y: Math.max(10, rect.top - 44),
            });
          }
        } catch {
          setSelectedTextPopup(null);
        }
      } else {
        setSelectedTextPopup(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleWordClick = (rawWord: string, contextSentence?: string) => {
    const cleaned = normalizeText(rawWord);
    if (!cleaned) return;

    // Check if it exists in our phrase map
    const phraseInfo = phrasesMap.get(cleaned);
    const data = findTranslation(rawWord);

    const phraseType = phraseInfo?.type || data.phraseType;
    const level = phraseInfo?.level || data.level;
    const translation = phraseInfo?.translation || data.translation;

    setSelectedWord({
      word: rawWord,
      translation,
      phraseType,
      level,
      ipa: data.ipa,
      context: contextSentence,
    });
  };

  const handleSentenceClick = (sentence: string) => {
    const trimmed = sentence.trim();
    if (!trimmed) return;

    setSelectedWord({
      word: trimmed,
      translation: '', // will be translated live in TranslationPopup
      phraseType: 'fixed_expression',
      level: 'B1',
      context: trimmed,
    });
  };

  const isWordMarked = (text: string) => {
    return markedMap.has(normalizeText(text));
  };

  // Font size class mapping
  const textSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[settings.textSize];

  // Render paragraph content tokenized by automatic phrases or words
  const renderParagraphInPhraseMode = (paragraph: string, pIndex: number) => {
    if (!paragraph.trim()) return null;

    const tokens: React.ReactNode[] = [];
    let remaining = paragraph;
    let tokenKey = 0;

    while (remaining.length > 0) {
      let matchedPhrase: string | null = null;

      // Check if remainder starts with any identified multi-word phrase with proper word boundary
      for (const phrase of sortedPhrases) {
        const pLen = phrase.length;
        if (
          remaining.length >= pLen &&
          remaining.slice(0, pLen).toLowerCase() === phrase.toLowerCase()
        ) {
          // Check word boundary right after phrase
          const charAfter = remaining[pLen];
          if (!charAfter || /[\s.,!?;:()"'\-\/\[\]]/.test(charAfter)) {
            matchedPhrase = remaining.slice(0, pLen);
            break;
          }
        }
      }

      if (matchedPhrase) {
        const phraseKey = normalizeText(matchedPhrase);
        const phraseInfo = phrasesMap.get(phraseKey) || findTranslation(matchedPhrase);
        const marked = isWordMarked(matchedPhrase);
        const phraseType: PhraseType =
          'type' in phraseInfo && phraseInfo.type
            ? phraseInfo.type
            : 'phraseType' in phraseInfo && phraseInfo.phraseType
            ? phraseInfo.phraseType
            : 'noun_phrase';

        const phraseLevel: CEFRLevel =
          'level' in phraseInfo && phraseInfo.level ? phraseInfo.level : 'A2';

        // Apply display mode styling
        let styleClass = '';

        if (settings.mode === 'full_color') {
          const cfg = PHRASE_TYPE_COLORS[phraseType as PhraseType] || PHRASE_TYPE_COLORS.noun_phrase;
          styleClass = `${cfg.textColor} ${cfg.underline}`;
        } else if (settings.mode === 'focus') {
          if (settings.focusCategory === 'all' || settings.focusCategory === phraseType) {
            const cfg = PHRASE_TYPE_COLORS[phraseType as PhraseType] || PHRASE_TYPE_COLORS.noun_phrase;
            styleClass = `${cfg.textColor} ${cfg.underline} font-bold`;
          } else {
            styleClass = 'text-gray-400 opacity-60';
          }
        } else if (settings.mode === 'sentence_pattern') {
          if (phraseType === 'noun_phrase') {
            styleClass = 'text-blue-700 underline decoration-blue-500 font-semibold';
          } else if (phraseType === 'verb_phrase') {
            styleClass = 'text-rose-700 underline decoration-rose-500 font-semibold';
          } else {
            styleClass = 'text-emerald-700 underline decoration-emerald-500';
          }
        } else if (settings.mode === 'word_level') {
          if (phraseLevel === 'A1') styleClass = 'text-green-700 underline decoration-green-500';
          else if (phraseLevel === 'A2') styleClass = 'text-blue-700 underline decoration-blue-500';
          else styleClass = 'text-purple-700 underline decoration-purple-500 font-medium';
        }

        tokens.push(
          <span
            key={`p-${pIndex}-token-${tokenKey++}`}
            onClick={(e) => {
              e.stopPropagation();
              handleWordClick(matchedPhrase!, paragraph);
            }}
            className={`inline-block cursor-pointer px-1 py-0.5 rounded-md transition-all hover:bg-amber-100 hover:text-gray-900 select-none ${styleClass} ${
              marked ? 'bg-amber-200/90 font-bold ring-1 ring-amber-400' : ''
            }`}
          >
            {matchedPhrase}
            {marked && <span className="ml-0.5 text-xs text-amber-700">★</span>}
          </span>
        );

        remaining = remaining.slice(matchedPhrase.length);
      } else {
        // Match up to the next word boundary, supporting hyphenated words
        const match = remaining.match(/^(\s+|[^\w\s-]+|[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)/);
        if (match) {
          const piece = match[0];
          const isWord = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(piece);

          if (isWord) {
            const wordKey = normalizeText(piece);
            const dictEntry = BUILTIN_DICTIONARY[wordKey];
            const autoInfo = phrasesMap.get(wordKey);
            const fallbackInfo = findTranslation(piece);
            const marked = isWordMarked(piece);

            const detectedType: PhraseType =
              dictEntry?.phraseType ||
              ('type' in (autoInfo || {}) ? (autoInfo as any).type : undefined) ||
              fallbackInfo.phraseType;

            const detectedLevel: CEFRLevel =
              dictEntry?.level ||
              ('level' in (autoInfo || {}) ? (autoInfo as any).level : undefined) ||
              fallbackInfo.level;

            let styleClass = '';
            const cfg = PHRASE_TYPE_COLORS[detectedType] || PHRASE_TYPE_COLORS.noun_phrase;

            if (settings.mode === 'full_color') {
              styleClass = `${cfg.textColor} ${cfg.underline}`;
            } else if (settings.mode === 'focus') {
              if (settings.focusCategory === 'all' || settings.focusCategory === detectedType) {
                styleClass = `${cfg.textColor} ${cfg.underline} font-medium`;
              } else {
                styleClass = 'text-gray-400 opacity-60';
              }
            } else if (settings.mode === 'sentence_pattern') {
              if (detectedType === 'noun_phrase') {
                styleClass = 'text-blue-700 underline decoration-blue-500 font-medium';
              } else if (detectedType === 'verb_phrase') {
                styleClass = 'text-rose-700 underline decoration-rose-500 font-medium';
              } else {
                styleClass = 'text-emerald-700 underline decoration-emerald-500';
              }
            } else if (settings.mode === 'word_level') {
              if (detectedLevel === 'A1') styleClass = 'text-green-700 underline decoration-green-500';
              else if (detectedLevel === 'A2') styleClass = 'text-blue-700 underline decoration-blue-500';
              else styleClass = 'text-purple-700 underline decoration-purple-500 font-medium';
            }

            tokens.push(
              <span
                key={`p-${pIndex}-token-${tokenKey++}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWordClick(piece, paragraph);
                }}
                className={`inline-block cursor-pointer px-0.5 rounded-sm transition-colors select-none ${styleClass} ${
                  marked ? 'bg-amber-200/90 font-bold ring-1 ring-amber-400' : ''
                }`}
              >
                {piece}
                {marked && <span className="ml-0.5 text-[10px] text-amber-700">★</span>}
              </span>
            );
          } else {
            // Space or punctuation
            tokens.push(<span key={`p-${pIndex}-token-${tokenKey++}`}>{piece}</span>);
          }

          remaining = remaining.slice(piece.length);
        } else {
          tokens.push(remaining);
          break;
        }
      }
    }

    return (
      <p key={`para-${pIndex}`} className={`mb-5 text-gray-800 ${textSizeClass}`}>
        {tokens}
      </p>
    );
  };

  // Render paragraph broken into sentences for Sentence Mode
  const renderParagraphInSentenceMode = (paragraph: string, pIndex: number) => {
    if (!paragraph.trim()) return null;

    // Split paragraph into sentences
    const sentences = paragraph.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [paragraph];

    return (
      <p key={`para-sent-${pIndex}`} className={`mb-5 ${textSizeClass}`}>
        {sentences.map((sentence, sIdx) => {
          const marked = isWordMarked(sentence.trim());
          return (
            <span
              key={`s-${pIndex}-${sIdx}`}
              onClick={() => handleSentenceClick(sentence)}
              className={`cursor-pointer px-1.5 py-1 rounded-xl transition-all inline hover:bg-blue-100/80 hover:text-blue-900 border-b border-dashed border-blue-300 mr-1.5 ${
                marked ? 'bg-amber-100 font-medium' : ''
              }`}
            >
              {sentence}
              <span className="text-[10px] text-blue-500 font-semibold ml-1 inline-flex items-center">
                <Globe2 className="w-3 h-3 inline mr-0.5" /> Terjemahkan
              </span>
            </span>
          );
        })}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-blue-600 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 p-1.5 -ml-1.5 rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors text-white"
          aria-label="Kembali ke Beranda"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-center flex-1 px-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
            MEMBACA ARTIKEL
          </p>
          <p className="text-xs font-semibold text-white/90 truncate max-w-[200px] sm:max-w-xs mx-auto">
            {article.title}
          </p>
        </div>

        <button
          onClick={() => setIsDisplayModalOpen(true)}
          className="p-2 -mr-1 rounded-full bg-blue-700/80 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors"
          title="Pengaturan Mode Tampilan"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Floating selection translate button */}
      {selectedTextPopup && (
        <div
          style={{
            position: 'fixed',
            top: `${selectedTextPopup.y}px`,
            left: `${selectedTextPopup.x}px`,
            zIndex: 60,
          }}
          className="animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleSentenceClick(selectedTextPopup.text);
              setSelectedTextPopup(null);
            }}
            className="bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-xl flex items-center gap-1.5 hover:bg-blue-600 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Terjemahkan Seleksi</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main ref={articleContainerRef} className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6">
        {/* Article Header Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-100 mb-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {article.title}
            </h1>
            <button
              onClick={() => speakEnglish(article.title)}
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 shrink-0 mt-0.5"
              title="Dengarkan judul artikel"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-3">
            {article.indonesianTitle}
          </p>

          {/* Automatic Identification Summary Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Identifikasi Otomatis Terdeteksi:</span>
              </span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {autoIdentifiedPhrases.length} frasa
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                {phraseStats.noun} Nomina
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-medium">
                {phraseStats.verb} Verba
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 font-medium">
                {phraseStats.preposition} Preposisi
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                {phraseStats.connector} Penghubung
              </span>
            </div>
          </div>

          {/* Mode Switcher: Mode Kata/Frasa vs Mode Kalimat */}
          <div className="flex items-center justify-between gap-2 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setReadingMode('phrase')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                readingMode === 'phrase' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Mode Kata & Frasa</span>
            </button>
            <button
              onClick={() => setReadingMode('sentence')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                readingMode === 'sentence' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mode Kalimat Lengkap</span>
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-gray-100">
          {article.content.split('\n\n').map((para, i) =>
            readingMode === 'phrase'
              ? renderParagraphInPhraseMode(para, i)
              : renderParagraphInSentenceMode(para, i)
          )}
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 z-30 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              {articleMarkedCount}
            </div>
            <span className="text-xs text-gray-600 font-medium hidden xs:inline">
              vocab ditandai
            </span>
          </div>

          <button
            onClick={() => {
              onUpdateProgress?.(article.id, 100);
              onStartQuiz(article.id);
            }}
            className="flex-1 sm:flex-none sm:min-w-[240px] py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <span>Lanjut ke Vocab Recall</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Translation Popup */}
      {selectedWord && (
        <TranslationPopup
          isOpen={!!selectedWord}
          onClose={() => setSelectedWord(null)}
          word={selectedWord.word}
          initialTranslation={selectedWord.translation}
          phraseType={selectedWord.phraseType}
          level={selectedWord.level}
          ipa={selectedWord.ipa}
          context={selectedWord.context}
          isMarked={isWordMarked(selectedWord.word)}
          onToggleMark={(finalTranslation) => {
            onToggleMarkVocab(
              selectedWord.word,
              finalTranslation,
              selectedWord.phraseType,
              selectedWord.level,
              selectedWord.context
            );
          }}
        />
      )}

      {/* Display Mode Modal */}
      <DisplayModeModal
        isOpen={isDisplayModalOpen}
        onClose={() => setIsDisplayModalOpen(false)}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};
