export type PhraseType =
  | 'noun_phrase'
  | 'verb_phrase'
  | 'adj_phrase'
  | 'adv_phrase'
  | 'connector'
  | 'preposition'
  | 'fixed_expression';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface IdentifiedPhrase {
  id: string;
  text: string;
  translation: string;
  phraseType: PhraseType;
  level: CEFRLevel;
  ipa?: string;
  explanation?: string;
}

export interface MarkedVocab {
  id: string;
  articleId: string;
  articleTitle: string;
  word: string;
  translation: string;
  phraseType: PhraseType;
  level: CEFRLevel;
  ipa?: string;
  contextSentence?: string;
  dateAdded: string; // ISO string
  // Spaced Repetition (SRS) data:
  srs: {
    status: 'needs_review' | 'mastered';
    repetitionLevel: number; // 0, 1, 2, 3+
    lastReviewed?: string;
    nextReviewDate: string;
    incorrectAttempts: number;
    correctAttempts: number;
  };
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  iconName?: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  indonesianTitle: string;
  fileName?: string;
  folderId: string;
  content: string; // Full text
  wordCount: number;
  level: CEFRLevel;
  genre: string;
  readingProgress: number; // 0 - 100
  createdAt: string;
  lastReadAt?: string;
  isCustomUploaded?: boolean;
}

export type DisplayModeType = 'full_color' | 'focus' | 'sentence_pattern' | 'word_level';

export interface DisplaySettings {
  mode: DisplayModeType;
  focusCategory: PhraseType | 'all';
  textSize: 'sm' | 'base' | 'lg' | 'xl';
}

export interface QuizQuestion {
  vocabId: string;
  word: string;
  correctTranslation: string;
  wrongTranslation: string;
  correctSide: 'left' | 'right';
  articleTitle: string;
  phraseType: PhraseType;
}
