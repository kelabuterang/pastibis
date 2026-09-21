import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { ChevronLeft, ArrowLeft, ArrowRight, Volume2, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MarkedVocab, QuizQuestion } from '../types';
import { speakEnglish, sounds } from '../utils/audio';
import { BUILTIN_DICTIONARY, VOCAB_ROOT_DICT } from '../utils/textAnalyzer';

interface VocabRecallQuizProps {
  articleTitle?: string;
  vocabs: MarkedVocab[];
  onBack: () => void;
  onUpdateVocabSRS: (vocabId: string, wasCorrect: boolean) => void;
  onStartReviewPractice: () => void;
}

export const VocabRecallQuiz: React.FC<VocabRecallQuizProps> = ({
  articleTitle = 'Vocabulary Quiz',
  vocabs,
  onBack,
  onUpdateVocabSRS,
  onStartReviewPractice,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<{
    vocabId: string;
    word: string;
    translation: string;
    wasCorrect: boolean;
  }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Generate plausible distractor / wrong translations from dictionary
  const distractorPool = useMemo(() => {
    const list: string[] = [];
    Object.values(BUILTIN_DICTIONARY).forEach(v => list.push(v.translation));
    Object.values(VOCAB_ROOT_DICT).forEach(v => list.push(v.translation));
    return Array.from(new Set(list));
  }, []);

  // Prepare questions
  const questions: QuizQuestion[] = useMemo(() => {
    if (!vocabs || vocabs.length === 0) return [];

    return vocabs.map((v, i) => {
      // Find a wrong translation different from correct one
      const wrongCandidates = distractorPool.filter(d => d.toLowerCase() !== v.translation.toLowerCase());
      const randomWrong = wrongCandidates[Math.floor(Math.random() * wrongCandidates.length)] || 'arti lain';
      
      // Alternate or randomize side
      const correctSide = (i % 2 === 0) ? 'right' : 'left';

      return {
        vocabId: v.id,
        word: v.word,
        correctTranslation: v.translation,
        wrongTranslation: randomWrong,
        correctSide,
        articleTitle: v.articleTitle || articleTitle,
        phraseType: v.phraseType,
      };
    });
  }, [vocabs, distractorPool, articleTitle]);

  const currentQ = questions[currentIndex];
  const isFinished = questions.length > 0 && currentIndex >= questions.length;

  // Swipe motion values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const leftOpacity = useTransform(x, [-100, -20], [1, 0]);
  const rightOpacity = useTransform(x, [20, 100], [0, 1]);

  const handleAnswer = (chosenSide: 'left' | 'right') => {
    if (!currentQ || feedback !== null) return;

    const isCorrect = chosenSide === currentQ.correctSide;

    if (isCorrect) {
      sounds.playCorrect();
      setFeedback('correct');
    } else {
      sounds.playIncorrect();
      setFeedback('incorrect');
    }

    onUpdateVocabSRS(currentQ.vocabId, isCorrect);

    setSessionResults(prev => [
      ...prev,
      {
        vocabId: currentQ.vocabId,
        word: currentQ.word,
        translation: currentQ.correctTranslation,
        wasCorrect: isCorrect,
      },
    ]);

    setTimeout(() => {
      setFeedback(null);
      x.set(0);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx >= questions.length) {
        // Trigger confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }, 450);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSessionResults([]);
    setFeedback(null);
  };

  // If no vocabs marked yet
  if (vocabs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Vocab yang Ditandai</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Buka artikel bahasa Inggris, lalu ketuk kata atau frasa apa pun untuk menandainya ke quiz Vocab Recall.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700"
        >
          Kembali Membaca Artikel
        </button>
      </div>
    );
  }

  // Quiz Finished Results Screen
  if (isFinished) {
    const correctCount = sessionResults.filter(r => r.wasCorrect).length;
    const incorrectCount = sessionResults.length - correctCount;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Blue Header */}
        <div className="bg-blue-600 text-white pt-6 pb-12 px-6 rounded-b-[36px] shadow-md text-center">
          <button
            onClick={onBack}
            className="absolute top-6 left-4 p-2 rounded-full hover:bg-blue-700 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/50 text-xs font-bold uppercase tracking-wider mb-2">
            pastibisa
          </div>
          <h1 className="text-2xl font-black tracking-tight">Quiz Selesai!</h1>
          <p className="text-blue-100 text-xs mt-1">Latihan Vocab Recall Anda berhasil direkam</p>
        </div>

        {/* Results Card */}
        <div className="max-w-md w-full mx-auto px-4 -mt-8 flex-1 flex flex-col pb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="text-2xl font-black text-emerald-600 mb-0.5">{correctCount}</div>
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Dikuasai (Mastered)</div>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                <div className="text-2xl font-black text-rose-600 mb-0.5">{incorrectCount}</div>
                <div className="text-xs font-bold text-rose-800 uppercase tracking-wide">Perlu Review</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4 text-left font-medium">
              Kata yang keliru otomatis dijadwalkan masuk ke <strong>Review Practice</strong> dengan sistem <em>Spaced Repetition</em> agar tidak mudah lupa.
            </p>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-left">
              {sessionResults.map((r, i) => (
                <div
                  key={`res-${i}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm"
                >
                  <div>
                    <span className="font-bold text-gray-900">{r.word}</span>
                    <span className="text-gray-400 mx-1.5">•</span>
                    <span className="text-gray-600">{r.translation}</span>
                  </div>
                  {r.wasCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            {incorrectCount > 0 && (
              <button
                onClick={onStartReviewPractice}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut Latihan Spaced Repetition ({incorrectCount})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={restartQuiz}
              className="w-full py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Quiz Ini</span>
            </button>

            <button
              onClick={onBack}
              className="w-full py-3 text-gray-500 font-semibold text-xs hover:text-gray-800 transition-colors"
            >
              Kembali ke Halaman Sebelumnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Question Screen (Matching Screenshot 2)
  const leftText = currentQ.correctSide === 'left' ? currentQ.correctTranslation : currentQ.wrongTranslation;
  const rightText = currentQ.correctSide === 'right' ? currentQ.correctTranslation : currentQ.wrongTranslation;

  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col justify-between overflow-x-hidden">
      {/* Top Bar matching Screenshot 2 */}
      <div className="pt-4 px-4 pb-2 text-white">
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

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Vocab Recall
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium truncate mt-0.5">
            {currentQ.articleTitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-700/60 rounded-full h-2.5 overflow-hidden mb-2">
          <motion.div
            className="bg-white h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, progressPercent)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-blue-200 font-semibold px-1">
          <span>{currentIndex + 1} dari {questions.length}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
      </div>

      {/* Center Interactive Flashcard */}
      <div className="flex-1 flex items-center justify-center p-4 max-w-md w-full mx-auto relative min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${currentIndex}`}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80) {
                handleAnswer('right');
              } else if (info.offset.x < -80) {
                handleAnswer('left');
              }
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[360px] border-4 transition-colors cursor-grab active:cursor-grabbing select-none relative ${
              feedback === 'correct'
                ? 'border-emerald-500 bg-emerald-50/40'
                : feedback === 'incorrect'
                ? 'border-rose-500 bg-rose-50/40'
                : 'border-white'
            }`}
          >
            {/* Swipe Indicators */}
            <motion.div
              style={{ opacity: leftOpacity }}
              className="absolute top-4 left-4 bg-purple-600 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider pointer-events-none"
            >
              ← SWIPE LEFT
            </motion.div>
            <motion.div
              style={{ opacity: rightOpacity }}
              className="absolute top-4 right-4 bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider pointer-events-none"
            >
              SWIPE RIGHT →
            </motion.div>

            {/* Central Word/Phrase Display */}
            <div className="my-auto text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {currentQ.word}
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakEnglish(currentQ.word);
                  }}
                  className="p-1.5 rounded-full text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  title="Dengarkan pengucapan"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-3">
                <span>⇄</span>
                <span>Swipe the card left or right to answer</span>
              </div>
            </div>

            {/* Bottom Choice Buttons matching Screenshot 2 */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              {/* Left choice button */}
              <button
                onClick={() => handleAnswer('left')}
                className="bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all p-3.5 rounded-2xl flex flex-col items-center text-center border border-gray-100"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 uppercase mb-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                  <span>SWIPE LEFT</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2">
                  {leftText}
                </span>
              </button>

              {/* Right choice button */}
              <button
                onClick={() => handleAnswer('right')}
                className="bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all p-3.5 rounded-2xl flex flex-col items-center text-center border border-gray-100"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <span>SWIPE RIGHT</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2">
                  {rightText}
                </span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom helper text */}
      <div className="text-center pb-4 text-xs font-medium text-blue-200">
        Ketuk tombol pilihan atau geser kartu ke kiri/kanan
      </div>
    </div>
  );
};
