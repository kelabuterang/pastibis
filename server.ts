import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;

// Lazy initialize Gemini client if API key is present
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Translation endpoint with multi-model fallback and graceful error handling
  app.post('/api/translate', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const trimmed = text.trim();

    // 1. If Gemini API key is available, attempt translation with model fallbacks
    const gemini = getGeminiClient();
    if (gemini) {
      // Models in priority order: gemini-3.8-flash, gemini-flash-latest, gemini-3.1-flash-lite
      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

      for (const model of candidateModels) {
        try {
          const response = await gemini.models.generateContent({
            model,
            contents: `Translate the following English word or text into natural, accurate Indonesian. Output ONLY the Indonesian translation without explanations, quotes, or markdown.\n\nEnglish: ${trimmed}`,
          });

          const translated = response?.text?.trim();
          if (translated) {
            return res.json({ translation: translated, source: `gemini (${model})` });
          }
        } catch (err: any) {
          // If model is experiencing temporary high demand (503) or rate limit (429), try next model
          const status = err?.status || err?.code || err?.error?.code;
          if (status === 503 || status === 'UNAVAILABLE' || status === 429) {
            console.warn(`[Gemini] Model ${model} is temporarily unavailable (${status}), trying next candidate...`);
            continue;
          }
          console.warn(`[Gemini] Model ${model} returned non-fatal error: ${err?.message || err}`);
          break;
        }
      }
    }

    // 2. Fallback to MyMemory translation API
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|id`
      );
      if (response.ok) {
        const data = await response.json();
        const translatedText = data?.responseData?.translatedText;
        if (translatedText && !translatedText.includes('MYMEMORY WARNING')) {
          return res.json({ translation: translatedText.trim(), source: 'mymemory' });
        }
      }
    } catch {
      // Silently fall through
    }

    return res.json({ translation: trimmed, source: 'fallback' });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pastibisa server running on http://localhost:${PORT}`);
  });
}

startServer();
