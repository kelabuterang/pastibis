import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Bookmark, Check, X, Loader2, Edit3 } from 'lucide-react';
import { PhraseType, CEFRLevel } from '../types';
import { PHRASE_TYPE_COLORS } from '../utils/textAnalyzer';
import { speakEnglish } from '../utils/audio';
import { translateEnglishToIndonesian } from '../utils/translator';

interface TranslationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  initialTranslation: string;
  phraseType: PhraseType;
  level: CEFRLevel;
  ipa?: string;
  context?: string;
  isMarked: boolean;
  onToggleMark: (finalTranslation: string) => void;
}

export const TranslationPopup: React.FC<TranslationPopupProps> = ({
  isOpen,
  onClose,
  word,
  initialTranslation,
  phraseType,
  level,
  ipa,
  context,
  isMarked,
  onToggleMark,
}) => {
  const [currentTranslation, setCurrentTranslation] = useState(initialTranslation);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(initialTranslation);

  // Automatically fetch live translation when popup opens for any word or sentence
  useEffect(() => {
    if (!isOpen || !word) return;

    // If initialTranslation is already a solid Indonesian translation (not raw english echo)
    const isPlaceholder = !initialTranslation || initialTranslation.startsWith('Terjemahan:') || initialTranslation.toLowerCase() === word.toLowerCase();

    if (isPlaceholder) {
      setIsLoading(true);
      setCurrentTranslation('Menerjemahkan...');
      translateEnglishToIndonesian(word, initialTranslation)
        .then((res) => {
          const finalVal = res.translatedText || initialTranslation || word;
          setCurrentTranslation(finalVal);
          setCustomText(finalVal);
        })
        .catch(() => {
          setCurrentTranslation(initialTranslation || word);
          setCustomText(initialTranslation || word);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCurrentTranslation(initialTranslation);
      setCustomText(initialTranslation);
      setIsLoading(false);
    }
  }, [isOpen, word, initialTranslation]);

  if (!isOpen) return null;

  const phraseConfig = PHRASE_TYPE_COLORS[phraseType] || PHRASE_TYPE_COLORS.noun_phrase;
  const isSentence = word.includes(' ') && word.length > 25;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
        {/* Backdrop for outside click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
        />

        {/* Floating Card / Bottom Sheet */}
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="pointer-events-auto relative w-full sm:max-w-md bg-gray-900 text-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-gray-800 mb-0 sm:mb-8 max-h-[85vh] overflow-y-auto"
        >
          {/* Top Grab bar for mobile */}
          <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-3 sm:hidden" />

          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight break-words">
                  {word}
                </span>
                {ipa && <span className="text-xs text-gray-400 font-mono">{ipa}</span>}
                <button
                  onClick={() => speakEnglish(word)}
                  className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-blue-400 transition-colors shrink-0"
                  title="Dengarkan pengucapan (Audio)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grammar & CEFR Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {isSentence ? 'Kalimat Lengkap' : phraseConfig.label}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
              Level {level}
            </span>
            {isLoading && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Menerjemahkan...</span>
              </span>
            )}
          </div>

          {/* Indonesian translation card */}
          <div className="bg-gray-800/90 rounded-2xl p-4 mb-3 border border-gray-700/70">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                Terjemahan Bahasa Indonesia
              </p>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2 mt-1">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-700 text-sm font-semibold text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setCustomText(currentTranslation);
                      setIsEditing(false);
                    }}
                    className="text-xs text-gray-400 px-2 py-1 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTranslation(customText);
                      setIsEditing(false);
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base sm:text-lg font-bold text-emerald-400 leading-snug">
                {isLoading ? (
                  <span className="text-gray-400 text-sm font-normal italic flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Sedang menerjemahkan...
                  </span>
                ) : (
                  currentTranslation
                )}
              </p>
            )}
          </div>

          {/* Context sentence preview if available */}
          {context && (
            <div className="bg-gray-800/40 rounded-xl p-2.5 mb-4 border border-gray-800 text-xs text-gray-400">
              <span className="text-gray-500 font-semibold block mb-0.5">Konteks dalam artikel:</span>
              <p className="italic line-clamp-2 text-gray-300">"{context}"</p>
            </div>
          )}

          {/* Action button: Tandai untuk Vocab Recall */}
          <button
            onClick={() => onToggleMark(currentTranslation)}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              isMarked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isMarked ? (
              <>
                <Check className="w-4 h-4" />
                <span>Ditandai untuk Quiz Vocab Recall</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Tandai untuk Quiz Vocab Recall</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
