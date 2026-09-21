import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { parsePdfFile } from '../utils/pdfParser';
import { Article, Folder, CEFRLevel } from '../types';

interface PdfImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onArticleImported: (article: Article) => void;
}

export const PdfImportModal: React.FC<PdfImportModalProps> = ({
  isOpen,
  onClose,
  folders,
  onArticleImported,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [indonesianTitle, setIndonesianTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || 'folder-school');
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [genre, setGenre] = useState('Informational');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const result = await parsePdfFile(file);
        setTitle(result.title);
        setContent(result.content);
        setIndonesianTitle(`Terjemahan: ${result.title}`);
      } else {
        // Plain text file
        const text = await file.text();
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
        setContent(text);
        setIndonesianTitle(`Terjemahan: ${baseName}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal memproses file PDF. Pastikan file tidak terkunci kata sandi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMessage('Judul dan isi artikel tidak boleh kosong.');
      return;
    }

    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    const newArticle: Article = {
      id: `art-custom-${Date.now()}`,
      title: title.trim(),
      indonesianTitle: indonesianTitle.trim() || title.trim(),
      folderId: selectedFolderId,
      level,
      genre,
      wordCount: words.length,
      readingProgress: 0,
      createdAt: new Date().toISOString(),
      content: content.trim(),
      isCustomUploaded: true,
    };

    onArticleImported(newArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Import Artikel Bahasa Inggris</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload file PDF atau tempel teks artikel untuk diidentifikasi kosakatanya
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'upload' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            Upload File PDF
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'paste' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            Tempel Teks Langsung
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto pr-1">
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-3xl p-6 text-center cursor-pointer transition-colors mb-4 flex flex-col items-center justify-center min-h-[160px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {isProcessing ? (
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold">Mengekstrak teks dari PDF...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    Pilih atau Drag & Drop file PDF di sini
                  </p>
                  <p className="text-xs text-gray-400">
                    Format didukung: .pdf, .txt
                  </p>
                </>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3 rounded-xl mb-4 border border-rose-100">
              {errorMessage}
            </div>
          )}

          {/* Title and Indonesian Title */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Judul Artikel (Bahasa Inggris)
              </label>
              <input
                type="text"
                placeholder="Contoh: The Secrets of the Coral Reef"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Judul Bahasa Indonesia (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Rahasia Terumbu Karang"
                value={indonesianTitle}
                onChange={(e) => setIndonesianTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Folder & CEFR Level selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Kategori Folder
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Level Kesulitan (CEFR)
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="A1">A1 (Beginner)</option>
                  <option value="A2">A2 (Elementary)</option>
                  <option value="B1">B1 (Intermediate)</option>
                  <option value="B2">B2 (Upper Intermediate)</option>
                  <option value="C1">C1 (Advanced)</option>
                </select>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Isi Artikel (Bahasa Inggris)
              </label>
              <textarea
                rows={5}
                placeholder="Tempel atau ketik teks artikel berbahasa Inggris di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-normal text-gray-800 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
              />
              <span className="text-[11px] text-gray-400">
                {content.split(/\s+/).filter(w => w.length > 0).length} kata terhitung
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isProcessing || !content.trim() || !title.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan & Mulai Baca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
