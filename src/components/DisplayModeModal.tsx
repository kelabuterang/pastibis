import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Crosshair, GitBranch, BarChart2 } from 'lucide-react';
import { DisplaySettings, DisplayModeType, PhraseType } from '../types';

interface DisplayModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DisplaySettings;
  onUpdateSettings: (newSettings: DisplaySettings) => void;
}

export const DisplayModeModal: React.FC<DisplayModeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const modes: { id: DisplayModeType; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'full_color',
      title: 'Full colour',
      desc: 'Every word category coloured at once',
      icon: <Palette className="w-6 h-6 text-blue-600" />,
    },
    {
      id: 'focus',
      title: 'Focus',
      desc: 'Highlight one category, dim the rest',
      icon: <Crosshair className="w-6 h-6 text-blue-600" />,
    },
    {
      id: 'sentence_pattern',
      title: 'Sentence pattern',
      desc: 'Colour subject, verb, and extra info',
      icon: <GitBranch className="w-6 h-6 text-blue-600" />,
    },
    {
      id: 'word_level',
      title: 'Word level',
      desc: 'Colour words by their difficulty level',
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
    },
  ];

  const categories: { id: PhraseType | 'all'; label: string; icon: string }[] = [
    { id: 'noun_phrase', label: 'Noun phrase', icon: '🧊' },
    { id: 'verb_phrase', label: 'Verb phrase', icon: '⚡' },
    { id: 'adj_phrase', label: 'Adjective phrase', icon: '✨' },
    { id: 'adv_phrase', label: 'Adverbial phrase', icon: '➡️' },
    { id: 'connector', label: 'Connector phrase', icon: '🪢' },
    { id: 'preposition', label: 'Prepositional phrase', icon: '📍' },
    { id: 'fixed_expression', label: 'Fixed expression', icon: '🔲' },
  ];

  const textSizes: { id: 'sm' | 'base' | 'lg' | 'xl'; label: string; scale: string }[] = [
    { id: 'sm', label: 'A', scale: 'text-sm' },
    { id: 'base', label: 'A', scale: 'text-base font-medium' },
    { id: 'lg', label: 'A', scale: 'text-lg font-bold' },
    { id: 'xl', label: 'A', scale: 'text-xl font-extrabold' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Grab handle for mobile */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Display mode</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {modes.map((m) => {
              const isSelected = settings.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onUpdateSettings({ ...settings, mode: m.id })}
                  className={`p-4 rounded-2xl text-left transition-all border-2 flex flex-col justify-between min-h-[120px] ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-white shadow-xs'
                  }`}>
                    {React.cloneElement(m.icon as React.ReactElement<{ className?: string }>, {
                      className: `w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-600'}`,
                    })}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{m.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{m.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Category to Focus on */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              CATEGORY TO FOCUS ON
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, focusCategory: 'all' })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  settings.focusCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌐 Semua Kategori
              </button>
              {categories.map((c) => {
                const isSelected = settings.focusCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onUpdateSettings({ ...settings, focusCategory: c.id })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Size */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              TEXT SIZE
            </h4>
            <div className="grid grid-cols-4 gap-2 bg-gray-100 p-1.5 rounded-2xl">
              {textSizes.map((t) => {
                const isSelected = settings.textSize === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onUpdateSettings({ ...settings, textSize: t.id })}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className={t.scale}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
