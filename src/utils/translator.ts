// Fast, reliable translation engine for words, phrases, and full sentences
// Uses local caching, rich dictionary, and real translation API (MyMemory + Server)

const TRANSLATION_CACHE_KEY = 'pastibisa_translation_cache_v1';

function getTranslationCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(TRANSLATION_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTranslationCache(key: string, value: string): void {
  try {
    const cache = getTranslationCache();
    cache[key.toLowerCase().trim()] = value;
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

export interface TranslationResult {
  translatedText: string;
  source: 'cache' | 'dictionary' | 'api' | 'fallback';
}

/**
 * Translates English text to Indonesian.
 * 1. Checks memory/localStorage cache
 * 2. Tries server /api/translate endpoint if available
 * 3. Tries MyMemory free translation API with timeout
 * 4. Falls back to dictionary or cleaned text
 */
export async function translateEnglishToIndonesian(
  englishText: string,
  fallbackTranslation?: string
): Promise<TranslationResult> {
  const trimmed = englishText.trim();
  if (!trimmed) {
    return { translatedText: '', source: 'fallback' };
  }

  const cleanKey = trimmed.toLowerCase();

  // 1. Check persistent cache
  const cache = getTranslationCache();
  if (cache[cleanKey]) {
    return { translatedText: cache[cleanKey], source: 'cache' };
  }

  // 2. Try Server API first
  try {
    const serverController = new AbortController();
    const serverTimeout = setTimeout(() => serverController.abort(), 2500);

    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
      signal: serverController.signal,
    });
    clearTimeout(serverTimeout);

    if (res.ok) {
      const data = await res.json();
      if (data.translation && data.translation !== trimmed) {
        saveTranslationCache(cleanKey, data.translation);
        return { translatedText: data.translation, source: 'api' };
      }
    }
  } catch {
    // Server not running or timed out; fall through to public API
  }

  // 3. Try MyMemory free translation API (Reliable English -> Indonesian)
  try {
    const apiController = new AbortController();
    const apiTimeout = setTimeout(() => apiController.abort(), 3500);

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|id`;
    const res = await fetch(url, { signal: apiController.signal });
    clearTimeout(apiTimeout);

    if (res.ok) {
      const json = await res.json();
      const rawTranslation = json?.responseData?.translatedText;
      if (rawTranslation && typeof rawTranslation === 'string') {
        const cleaned = cleanTranslationOutput(rawTranslation, trimmed);
        if (cleaned) {
          saveTranslationCache(cleanKey, cleaned);
          return { translatedText: cleaned, source: 'api' };
        }
      }
    }
  } catch {
    // API failed or offline
  }

  // 4. Return fallback from dictionary if available
  if (fallbackTranslation && !fallbackTranslation.startsWith('Terjemahan:')) {
    saveTranslationCache(cleanKey, fallbackTranslation);
    return { translatedText: fallbackTranslation, source: 'dictionary' };
  }

  return {
    translatedText: fallbackTranslation || trimmed,
    source: 'fallback',
  };
}

function cleanTranslationOutput(output: string, original: string): string {
  // MyMemory sometimes includes error messages or identical text
  if (!output || output.toLowerCase() === original.toLowerCase()) {
    return '';
  }
  if (output.includes('MYMEMORY WARNING') || output.includes('QUERY LENGTH LIMIT')) {
    return '';
  }
  // Decode HTML entities if any
  const decoded = output
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return decoded.trim();
}
