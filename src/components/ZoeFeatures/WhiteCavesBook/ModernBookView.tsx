// src/components/ZoeFeatures/WhiteCavesBook/ModernBookView.tsx
import React from 'react';
import { useBook } from './BookContext';
import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Hash,
  Lightbulb,
  Code2,
  Sigma,
  ExternalLink,
} from 'lucide-react';

export const ModernBookView: React.FC = () => {
  const {
    currentChapter,
    nextChapter,
    prevChapter,
    selectChapterBySlug,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredChapters,
    glossary,
  } = useBook();

  const categories = [
    'All',
    'Core Architecture',
    'Autonomous Mesh',
    'Domain & Actors',
    'Multi-Repo Decoupling',
    'Living Chronicler',
  ];

  return (
    <div className="flex h-full w-full bg-[#030712] text-slate-100 rounded-xl border border-sky-500/20 overflow-hidden shadow-2xl">
      {/* ── Left Sidebar: Interactive Chapter Index & Search ── */}
      <div className="w-80 border-r border-sky-500/20 bg-slate-900/60 flex flex-col backdrop-blur-md">
        {/* Header */}
        <div className="p-4 border-b border-sky-500/20">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-sm tracking-wide text-white">The Book of White Caves</h2>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Living React Knowledge Base & Self-Learning Engine
          </p>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search concepts, laws, code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 p-2 overflow-x-auto border-b border-slate-800/80 scrollbar-none text-[10px]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded whitespace-nowrap transition font-medium ${
                selectedCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredChapters.map(ch => {
            const isActive = ch.slug === currentChapter.slug;
            return (
              <button
                key={ch.id}
                onClick={() => selectChapterBySlug(ch.slug)}
                className={`w-full text-left p-2.5 rounded-lg transition group ${
                  isActive
                    ? 'bg-sky-500/15 border border-sky-500/30 text-white'
                    : 'hover:bg-slate-800/40 text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
                    {ch.id}
                  </span>
                  <span className="text-[10px] text-slate-500">{ch.readTime}</span>
                </div>
                <div className="font-semibold text-xs leading-snug group-hover:text-sky-300 transition">
                  {ch.title.split(': ')[1] || ch.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ch.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Viewport: Reactive Chapter Presentation ── */}
      <div className="flex-1 flex flex-col bg-[#050B17] overflow-hidden">
        {/* Navigation Bar */}
        <div className="px-6 py-3 border-b border-sky-500/20 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-semibold text-[10px]">
              {currentChapter.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-300 font-medium">{currentChapter.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevChapter}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={nextChapter}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Chapter Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl">
          {/* Chapter Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              {currentChapter.title}
            </h1>
            <p className="text-sm text-sky-400/90 font-medium mb-3">{currentChapter.subtitle}</p>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-sky-500/20 text-slate-300 text-xs leading-relaxed">
              {currentChapter.summary}
            </div>
          </div>

          {/* Interactive Topic Cloud with Deep-Linking */}
          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Hash className="w-3 h-3 text-sky-400" /> Hyperlinked Topics:
            </span>
            {currentChapter.topics.map(topic => {
              const item = glossary[topic];
              return (
                <button
                  key={topic}
                  onClick={() => item && selectChapterBySlug(item.targetSlug)}
                  title={item ? item.definition : topic}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-700/40 hover:border-sky-400 transition flex items-center gap-1"
                >
                  {topic}
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Structured Sections */}
          <div className="space-y-6 pt-2">
            {currentChapter.sections.map(section => (
              <div
                key={section.id}
                className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4"
              >
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-sky-400 rounded-full" />
                  {section.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{section.content}</p>

                {/* Math Formulas (Native Render with LaTeX notation) */}
                {section.mathFormulas && section.mathFormulas.length > 0 && (
                  <div className="space-y-2">
                    {section.mathFormulas.map((math, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-slate-950/90 border border-emerald-500/30 text-emerald-300 space-y-1.5"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                          <Sigma className="w-4 h-4" /> {math.title}
                        </div>
                        <div className="font-mono text-sm bg-black/40 px-3 py-2 rounded border border-emerald-500/20 text-center tracking-wide overflow-x-auto text-emerald-200">
                          {math.latex}
                        </div>
                        <p className="text-[11px] text-slate-400 italic">{math.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Snippets */}
                {section.codeSnippets && section.codeSnippets.length > 0 && (
                  <div className="space-y-2">
                    {section.codeSnippets.map((code, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-slate-950 border border-slate-800 overflow-hidden"
                      >
                        {code.filename && (
                          <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-sky-400" />
                            {code.filename}
                          </div>
                        )}
                        <pre className="p-3.5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                          <code>{code.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Takeaways */}
                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                  <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Key Architectural Takeaways:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-300">
                      {section.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
