import React, { useState } from 'react';
import { ChevronLeft, FolderPlus, Folder as FolderIcon, BookOpen, Trash2, MoveRight, Plus, FileText } from 'lucide-react';
import { Article, Folder } from '../types';

interface CollectionsViewProps {
  articles: Article[];
  folders: Folder[];
  onBack: () => void;
  onSelectArticle: (articleId: string) => void;
  onCreateFolder: (name: string, color: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveArticle: (articleId: string, newFolderId: string) => void;
  onDeleteArticle: (articleId: string) => void;
  onOpenPdfImport: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  articles,
  folders,
  onBack,
  onSelectArticle,
  onCreateFolder,
  onDeleteFolder,
  onMoveArticle,
  onDeleteArticle,
  onOpenPdfImport,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#2563eb');
  const [movingArticleId, setMovingArticleId] = useState<string | null>(null);

  const folderColors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0891b2'];

  const filteredArticles = selectedFolderId === 'all'
    ? articles
    : articles.filter(a => a.folderId === selectedFolderId);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), newFolderColor);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      {/* Top Header */}
      <header className="bg-blue-600 text-white pt-4 pb-6 px-4 sm:px-6 shadow-md">
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

          <button
            onClick={onOpenPdfImport}
            className="p-2 -mr-1 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-colors"
            title="Import PDF Baru"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Koleksi & Folder Artikel
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium mt-0.5">
            Kelola artikel tersimpan berdasarkan kategori dan topik
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto px-4 py-5 flex-1 flex flex-col">
        {/* Folders horizontal chips bar */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            DAFTAR FOLDER ({folders.length})
          </h2>
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Tambah Folder</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedFolderId === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Semua ({articles.length})</span>
          </button>

          {folders.map((folder) => {
            const count = articles.filter(a => a.folderId === folder.id).length;
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: folder.color }}
                />
                <span>{folder.name}</span>
                <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Folder Management Details if not 'all' */}
        {selectedFolderId !== 'all' && (
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <FolderIcon className="w-4 h-4 text-blue-600" />
              <span>Folder terpilih: <strong>{folders.find(f => f.id === selectedFolderId)?.name}</strong></span>
            </div>
            {folders.length > 1 && (
              <button
                onClick={() => {
                  if (confirm('Hapus folder ini? Artikel di dalamnya akan dipindahkan ke folder pertama.')) {
                    onDeleteFolder(selectedFolderId);
                    setSelectedFolderId('all');
                  }
                }}
                className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 p-1"
                title="Hapus folder"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Folder</span>
              </button>
            )}
          </div>
        )}

        {/* Article Cards List */}
        <div className="space-y-3 flex-1">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center my-6">
              <FileText className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm font-bold text-gray-700 mb-1">
                Belum ada artikel dalam kategori ini
              </p>
              <p className="text-xs text-gray-400 mb-4 max-w-xs">
                Import file PDF atau pilih artikel dari folder lain.
              </p>
              <button
                onClick={onOpenPdfImport}
                className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700"
              >
                Import PDF Sekarang
              </button>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const currentFolder = folders.find(f => f.id === art.folderId);
              return (
                <div
                  key={art.id}
                  className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group relative"
                  onClick={() => onSelectArticle(art.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {art.genre} · {art.level}
                        </span>
                        {currentFolder && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: currentFolder.color }}
                          >
                            {currentFolder.name}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {art.indonesianTitle}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-gray-400">
                        {art.wordCount} kata
                      </span>
                    </div>
                  </div>

                  {/* Reading progress bar */}
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 max-w-[160px]">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${art.readingProgress || 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">
                        {art.readingProgress || 0}%
                      </span>
                    </div>

                    {/* Actions: Move to folder or delete */}
                    <div className="flex items-center gap-1 text-gray-400" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setMovingArticleId(art.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Pindahkan ke folder lain"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus artikel "${art.title}"?`)) {
                            onDeleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Hapus artikel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-black text-gray-900 mb-1">Tambah Folder Baru</h3>
            <p className="text-xs text-gray-500 mb-4">
              Kategorikan artikel bahasa Inggris agar lebih rapi.
            </p>

            <form onSubmit={handleCreateFolder}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Nama Folder
                </label>
                <input
                  type="text"
                  placeholder="Misal: Travel Stories, Business..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Warna Label
                </label>
                <div className="flex items-center gap-2">
                  {folderColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newFolderColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-900' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-gray-600 font-bold text-xs hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs"
                >
                  Simpan Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Article Modal */}
      {movingArticleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-black text-gray-900 mb-1">Pindahkan Artikel</h3>
            <p className="text-xs text-gray-500 mb-4">
              Pilih folder tujuan untuk artikel ini:
            </p>

            <div className="space-y-2 mb-6 max-h-56 overflow-y-auto">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => {
                    onMoveArticle(movingArticleId, folder.id);
                    setMovingArticleId(null);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-left"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="font-bold text-sm text-gray-800">{folder.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setMovingArticleId(null)}
              className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
