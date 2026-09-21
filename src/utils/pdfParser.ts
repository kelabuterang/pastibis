import * as pdfjsLib from 'pdfjs-dist';

// Set up worker source for pdfjs
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ExtractedPdfResult {
  title: string;
  content: string;
  wordCount: number;
  pageCount: number;
}

export async function parsePdfFile(file: File): Promise<ExtractedPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const textPieces: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          // Check for line break based on vertical position
          if (lastY !== null && 'transform' in item && Math.abs(item.transform[5] - lastY) > 8) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          if ('transform' in item) {
            lastY = item.transform[5];
          }
        }
      }

      textPieces.push(pageText.trim());
    }

    const rawText = textPieces.join('\n\n');
    const cleanedText = cleanExtractedText(rawText);
    
    // Derive title from filename or first line
    const fallbackTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const firstLine = cleanedText.split('\n')[0]?.trim();
    const title = (firstLine && firstLine.length < 80 && !firstLine.includes('.')) 
      ? firstLine 
      : fallbackTitle;

    const words = cleanedText.split(/\s+/).filter(w => w.length > 0);

    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      content: cleanedText,
      wordCount: words.length,
      pageCount,
    };
  } catch (error) {
    console.error('Failed to parse PDF via pdfjs-dist, attempting fallback text decoding:', error);
    // Fallback: simple text decoding if plain text file was renamed or simple stream
    const decoder = new TextDecoder('utf-8');
    const fallbackText = decoder.decode(arrayBuffer);
    const cleanedFallback = cleanExtractedText(fallbackText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' '));
    const words = cleanedFallback.split(/\s+/).filter(w => w.length > 0);

    return {
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      content: cleanedFallback.length > 50 ? cleanedFallback : 'PDF content could not be converted directly. You can paste or type text directly.',
      wordCount: words.length,
      pageCount: 1,
    };
  }
}

function cleanExtractedText(text: string): string {
  return text
    // Replace broken hyphenations at line ends (e.g. "com-\npost" -> "compost")
    .replace(/(\w+)-\n(\w+)/g, '$1$2')
    // Normalize excessive spaces
    .replace(/[ \t]+/g, ' ')
    // Normalize multiple line breaks to paragraph breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
