import { Article, Folder, MarkedVocab, DisplaySettings } from '../types';

const STORAGE_KEYS = {
  ARTICLES: 'pastibisa_articles_v2',
  FOLDERS: 'pastibisa_folders_v2',
  VOCAB: 'pastibisa_vocab_v2',
  SETTINGS: 'pastibisa_settings_v2',
  ACTIVE_ARTICLE_ID: 'pastibisa_active_article_id_v2',
};

// Clear legacy bisadanedu or v1 mock keys
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const legacyKeys = [
      'bisadanedu_vocab_v1',
      'bisadanedu_articles_v1',
      'bisadanedu_active_article_id_v1',
      'bisadanedu_articles_v2',
      'bisadanedu_folders_v2',
      'bisadanedu_vocab_v2',
      'bisadanedu_settings_v2',
      'bisadanedu_active_article_id_v2',
      'bisadanedu_translation_cache_v1',
    ];
    legacyKeys.forEach(k => {
      if (localStorage.getItem(k)) {
        localStorage.removeItem(k);
      }
    });
  }
} catch {
  // Ignore localStorage access errors
}

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder-school',
    name: 'School & Education',
    color: '#2563eb',
    iconName: 'GraduationCap',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'folder-stories',
    name: 'Short Stories',
    color: '#059669',
    iconName: 'BookOpen',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'folder-science',
    name: 'Science & Health',
    color: '#7c3aed',
    iconName: 'Sparkles',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-garden',
    title: 'The Garden Above the Library',
    indonesianTitle: 'Taman di Atas Perpustakaan',
    folderId: 'folder-school',
    level: 'A2',
    genre: 'Descriptive',
    wordCount: 233,
    readingProgress: 0,
    createdAt: new Date().toISOString(),
    content: `My school has a small rooftop garden. The garden sits above the library, beside the science room. A narrow stairway leads to the wooden door from the third floor. The door is usually locked. However, during afternoon recess, two student teams check the plants and fill the watering cans. The garden has six wooden boxes for herbs and flowers. Each box holds different green plants with simple labels.

One box grows fresh mint for the cooking club. The walls are painted white and yellow. Small pots hang along the rail near the stairs. Near the wall, a blue bench gives students a quiet place to read or talk. The bench faces the busy sports field and the tall trees.

During lunch, many friends often sit there with their sandwiches. These students enjoy the cool air and soft shade. On rainy mornings, students look through the glass door at the wet garden. A science teacher uses this space for short lessons about soil and insects. Student volunteers clean the boxes every Friday afternoon.

The volunteers carry dry leaves to the compost bag behind the tool shelf. Because of this care, the garden stays fresh throughout the school year. On warm days, the rooftop feels like a secret room above the noisy school. I like this garden because it is small, bright, and useful. This special place gives our school a peaceful green corner.`,
  },
  {
    id: 'art-cleanup',
    title: 'Every Class Should Have a Clean-Up Team',
    indonesianTitle: 'Setiap Kelas Seharusnya Memiliki Tim Kebersihan',
    folderId: 'folder-school',
    level: 'A2',
    genre: 'Analytical Exposition',
    wordCount: 228,
    readingProgress: 0,
    createdAt: new Date().toISOString(),
    content: `Every school day, students spend many hours in their classrooms. They read books, write notes, eat snacks, and work on creative group projects. By the end of the day, small pieces of paper, pencil shavings, and plastic bottles often cover the floor. This is why every class should have a dedicated clean-up team.

First, a clean classroom helps students focus much better on their lessons. A tidy desk and an organized bookshelf create a calm atmosphere for study. Second, working in a clean-up team teaches students responsibility and team cooperation. When classmates sweep the floor and wipe the whiteboard together, they learn to respect their shared environment.

In conclusion, having a daily clean-up routine only takes ten minutes, but it makes a huge difference. Many schools have already started this habit with great success. When everyone participates, keeping the school clean becomes an enjoyable group effort rather than a boring chore.`,
  },
  {
    id: 'art-sleep',
    title: 'The Wonders of Deep Sleep',
    indonesianTitle: 'Keajaiban Tidur Nyenyak',
    folderId: 'folder-science',
    level: 'B1',
    genre: 'Informational',
    wordCount: 195,
    readingProgress: 0,
    createdAt: new Date().toISOString(),
    content: `Sleep is not simply a time when the brain shuts off. During deep sleep, the brain actively organizes memories and clears away waste chemicals that build up during waking hours. Scientists have discovered that students who get eight hours of good sleep can remember new vocabulary much more effectively than those who stay awake late.

When you sleep, your mind replays the concepts learned during the day and permanently stores them. Therefore, studying English right before going to bed is one of the best habits for long-term memory. A quiet room, dim lights, and putting away digital screens thirty minutes before bedtime can help you achieve peaceful and restorative rest.`,
  },
];

export const INITIAL_VOCAB: MarkedVocab[] = [];

export const DEFAULT_SETTINGS: DisplaySettings = {
  mode: 'full_color',
  focusCategory: 'all',
  textSize: 'base',
};

// Storage helper functions
export function getSavedArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading articles from localStorage', e);
    return INITIAL_ARTICLES;
  }
}

export function saveArticles(articles: Article[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  } catch (e) {
    console.error('Error saving articles', e);
  }
}

export function getSavedFolders(): Folder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(INITIAL_FOLDERS));
      return INITIAL_FOLDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading folders', e);
    return INITIAL_FOLDERS;
  }
}

export function saveFolders(folders: Folder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  } catch (e) {
    console.error('Error saving folders', e);
  }
}

export function getSavedVocab(): MarkedVocab[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOCAB);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(INITIAL_VOCAB));
      return INITIAL_VOCAB;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading vocab', e);
    return INITIAL_VOCAB;
  }
}

export function saveVocab(vocab: MarkedVocab[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VOCAB, JSON.stringify(vocab));
  } catch (e) {
    console.error('Error saving vocab', e);
  }
}

export function getSavedSettings(): DisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: DisplaySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function getActiveArticleId(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ARTICLE_ID) || 'art-garden';
  } catch {
    return 'art-garden';
  }
}

export function saveActiveArticleId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ARTICLE_ID, id);
  } catch (e) {
    console.error('Error saving active article ID', e);
  }
}

// Spaced Repetition update logic
export function updateVocabSRS(vocab: MarkedVocab, wasCorrect: boolean): MarkedVocab {
  const now = new Date();
  
  if (wasCorrect) {
    const newLevel = vocab.srs.repetitionLevel + 1;
    // Spaced repetition interval schedule in days: 1, 3, 7, 14, 30 days
    const intervalDays = newLevel === 1 ? 1 : newLevel === 2 ? 3 : newLevel === 3 ? 7 : 14;
    const nextDate = new Date(now.getTime() + intervalDays * 86400000);

    return {
      ...vocab,
      srs: {
        ...vocab.srs,
        status: newLevel >= 2 ? 'mastered' : 'needs_review',
        repetitionLevel: newLevel,
        lastReviewed: now.toISOString(),
        nextReviewDate: nextDate.toISOString(),
        correctAttempts: vocab.srs.correctAttempts + 1,
      },
    };
  } else {
    // Answered incorrectly: reset level to 0, mark as "needs_review" immediately
    return {
      ...vocab,
      srs: {
        ...vocab.srs,
        status: 'needs_review',
        repetitionLevel: 0,
        lastReviewed: now.toISOString(),
        nextReviewDate: now.toISOString(),
        incorrectAttempts: vocab.srs.incorrectAttempts + 1,
      },
    };
  }
}

// Full reset helper for user or development
export function resetAllProgressData(): { articles: Article[]; vocab: MarkedVocab[] } {
  try {
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.VOCAB);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ARTICLE_ID);
  } catch (e) {
    console.error('Error resetting progress data', e);
  }
  const cleanArticles = INITIAL_ARTICLES.map(a => ({
    ...a,
    readingProgress: 0,
    lastReadAt: undefined,
  }));
  saveArticles(cleanArticles);
  saveVocab([]);
  saveActiveArticleId(cleanArticles[0].id);
  return { articles: cleanArticles, vocab: [] };
}

