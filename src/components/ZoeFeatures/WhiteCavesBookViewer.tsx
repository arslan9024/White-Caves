import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Home, RefreshCw } from 'lucide-react';

interface WhiteCavesBookViewerProps {
  initialChapter?: string;
}

export const WhiteCavesBookViewer: React.FC<WhiteCavesBookViewerProps> = ({
  initialChapter = 'index.html',
}) => {
  const [currentChapter, setCurrentChapter] = useState<string>(initialChapter);
  const [key, setKey] = useState<number>(0);

  const chapters = [
    { id: 'index.html', title: 'Table of Contents' },
    { id: 'chapter-01-architecture.html', title: 'Ch 1: The Grand Architecture' },
    { id: 'chapter-02-mesh.html', title: 'Ch 2: AEGIS Sovereign Mesh' },
    { id: 'chapter-03-ouroboros.html', title: 'Ch 3: Protocol Perpetual Ouroboros' },
    { id: 'progress-intelligence.html', title: '⚡ Progress & Target Intelligence' },
  ];

  const currentIndex = chapters.findIndex((c) => c.id === currentChapter);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentChapter(chapters[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      setCurrentChapter(chapters[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#030712] text-slate-100 rounded-xl border border-sky-500/20 overflow-hidden shadow-2xl">
      {/* Book Control Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-sky-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-sky-400" />
          <span className="font-bold text-sm tracking-wide text-white">
            The Book of White Caves
          </span>
          <span className="text-xs bg-red-500/20 text-red-400 font-semibold px-2 py-0.5 rounded-full border border-red-500/30">
            Living Architecture
          </span>
        </div>

        {/* Dual-way navigation controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentChapter('index.html')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Table of Contents"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-xs text-slate-400 font-mono px-1">
            {currentIndex + 1} / {chapters.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= chapters.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition ml-2"
            title="Refresh Book View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Viewer */}
      <div className="flex-1 w-full bg-[#030712] relative">
        <iframe
          key={key}
          src={`/.agents/book-white-caves/${currentChapter}`}
          title="The Book of White Caves Viewer"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

export default WhiteCavesBookViewer;

