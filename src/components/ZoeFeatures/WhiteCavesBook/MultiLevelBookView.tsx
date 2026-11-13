// src/components/ZoeFeatures/WhiteCavesBook/MultiLevelBookView.tsx
import React from 'react';
import { useMultiLevelBook } from './MultiLevelBookContext';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Search,
  Layers,
  FolderTree,
  FileCode2,
  Sigma,
  FileText,
  CornerDownRight,
  Lightbulb,
  ExternalLink,
  Sparkles,
  ArrowUpLeft,
} from 'lucide-react';

export const MultiLevelBookView: React.FC = () => {
  const {
    currentBook,
    currentVolume,
    currentChapter,
    currentSection,
    currentTopic,
    currentLeaf,
    breadcrumbs,
    searchQuery,
    setSearchQuery,
    selectVolume,
    selectChapter,
    selectSection,
    selectTopic,
    selectLeaf,
    resetToChapter,
    nextChapter,
    prevChapter,
  } = useMultiLevelBook();

  return (
    <div className="flex flex-col h-full w-full bg-[#030712] text-slate-100 rounded-xl border border-sky-500/20 overflow-hidden shadow-2xl">
      {/* ── Level 0 & 1: Master Header Strip ── */}
      <div className="px-5 py-3 bg-slate-900/90 border-b border-sky-500/20 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">
                Book #{currentBook.bookNumber}
              </span>
              <h1 className="font-bold text-sm tracking-wide text-white">{currentBook.title}</h1>
            </div>
            <p className="text-[11px] text-slate-400">{currentBook.subtitle}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search all levels, leaves, laws..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-950/80 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
          />
        </div>
      </div>

      {/* ── Level 2: Horizontal Volume Strip ── */}
      <div className="px-5 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center gap-1 mr-2">
          <Layers className="w-3.5 h-3.5 text-sky-400" /> Volumes:
        </span>
        {currentBook.volumes.map(vol => {
          const isActive = vol.nodeId === currentVolume.nodeId;
          return (
            <button
              key={vol.nodeId}
              onClick={() => selectVolume(vol.nodeId)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400">Vol {vol.volumeNumber}:</span>
              {vol.title.split(': ')[1] || vol.title}
            </button>
          );
        })}
      </div>

      {/* ── Main Viewport Split: Vertical Tree vs Content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Accordion Tree (Chapters -> Sections -> Topics -> Leaves) ── */}
        <div className="w-80 border-r border-sky-500/20 bg-slate-900/40 flex flex-col overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-sky-400" /> Structure Navigator
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {currentVolume.chapters.length} Chapters
            </span>
          </div>

          {currentVolume.chapters.map(chapter => {
            const isChapterActive = chapter.nodeId === currentChapter.nodeId;
            return (
              <div
                key={chapter.nodeId}
                className={`rounded-lg border transition ${
                  isChapterActive
                    ? 'border-sky-500/30 bg-sky-950/20'
                    : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                {/* Chapter Title Bar */}
                <button
                  onClick={() => selectChapter(chapter.nodeId)}
                  className="w-full text-left p-2.5 flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-sky-500/20 text-sky-300 font-bold">
                        {chapter.chapterCode}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {chapter.readTimeMinutes}m read
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition leading-snug">
                      {chapter.title.split(': ')[1] || chapter.title}
                    </div>
                  </div>
                </button>

                {/* Sub-Tree when Chapter is Active */}
                {isChapterActive && (
                  <div className="px-2 pb-2 pt-1 border-t border-slate-800/60 space-y-2">
                    {chapter.sections.map(section => {
                      const isSecActive = currentSection?.nodeId === section.nodeId;
                      return (
                        <div
                          key={section.nodeId}
                          className="space-y-1 pl-2 border-l border-slate-800"
                        >
                          {/* Section Header */}
                          <button
                            onClick={() => selectSection(section.nodeId)}
                            className={`w-full text-left text-[11px] font-semibold py-0.5 transition flex items-center justify-between ${
                              isSecActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>§ {section.title.split(': ')[0] || section.nodeId}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {section.topics.length} topics
                            </span>
                          </button>

                          {/* Topics List */}
                          <div className="space-y-1 pl-2">
                            {section.topics.map(topic => {
                              const isTopicActive = currentTopic?.nodeId === topic.nodeId;
                              return (
                                <div key={topic.nodeId}>
                                  <button
                                    onClick={() => {
                                      selectSection(section.nodeId);
                                      selectTopic(topic.nodeId);
                                    }}
                                    className={`w-full text-left text-[11px] py-0.5 transition truncate flex items-center gap-1 ${
                                      isTopicActive
                                        ? 'text-emerald-400 font-bold'
                                        : 'text-slate-400 hover:text-slate-300'
                                    }`}
                                  >
                                    <CornerDownRight className="w-2.5 h-2.5 opacity-60" />
                                    {topic.title}
                                  </button>

                                  {/* Leaves (Single Purpose Files / Components / Laws) */}
                                  {isTopicActive && (
                                    <div className="pl-4 pt-1 space-y-1">
                                      {topic.leaves.map(leaf => {
                                        const isLeafActive = currentLeaf?.nodeId === leaf.nodeId;
                                        return (
                                          <button
                                            key={leaf.nodeId}
                                            onClick={() => selectLeaf(leaf.nodeId)}
                                            className={`w-full text-left px-2 py-1 rounded text-[10px] font-mono transition flex items-center justify-between ${
                                              isLeafActive
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                            }`}
                                          >
                                            <span className="truncate">
                                              {leaf.title.split(': ')[1] || leaf.title}
                                            </span>
                                            <span className="text-[9px] uppercase px-1 rounded bg-black/40 text-slate-400">
                                              {leaf.type}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right Content Area: Root-to-Leaf Presentation ── */}
        <div className="flex-1 flex flex-col bg-[#050B17] overflow-hidden">
          {/* Breadcrumb Navigation Lineage */}
          <div className="px-6 py-2.5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-slate-400">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.pathId + idx}>
                  <span className="hover:text-slate-200 font-medium whitespace-nowrap cursor-pointer">
                    {bc.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Deduplicated Step Navigation */}
            <div className="flex items-center gap-2">
              {currentLeaf && (
                <button
                  onClick={resetToChapter}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-400 transition"
                  title="Return to Chapter Overview"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5" /> Back to Chapter
                </button>
              )}
              <button
                onClick={prevChapter}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev Chapter
              </button>
              <button
                onClick={nextChapter}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                Next Chapter <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Deep Content Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl">
            {/* If Leaf Node is Selected, Display Single Purpose Focused View */}
            {currentLeaf ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 font-bold uppercase tracking-wider">
                      {currentLeaf.type} NODE #{currentLeaf.nodeId}
                    </span>
                    {currentLeaf.complexity && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        Complexity: {currentLeaf.complexity}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{currentLeaf.title}</h2>
                  {currentLeaf.filePath && (
                    <div className="text-xs font-mono text-sky-400 flex items-center gap-1.5 mt-2">
                      <FileCode2 className="w-4 h-4" /> {currentLeaf.filePath}
                      {currentLeaf.lineCount && (
                        <span className="text-slate-500">({currentLeaf.lineCount} lines)</span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {currentLeaf.content}
                  </p>
                </div>

                {/* Math Formulas */}
                {currentLeaf.mathFormulas && currentLeaf.mathFormulas.length > 0 && (
                  <div className="space-y-3">
                    {currentLeaf.mathFormulas.map((math, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <Sigma className="w-4 h-4" /> {math.title}
                        </div>
                        <div className="font-mono text-sm bg-black/60 px-4 py-3 rounded-lg border border-emerald-500/20 text-center text-emerald-200 overflow-x-auto">
                          {math.latex}
                        </div>
                        <p className="text-[11px] text-slate-400 italic">{math.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Blocks */}
                {currentLeaf.codeBlocks && currentLeaf.codeBlocks.length > 0 && (
                  <div className="space-y-3">
                    {currentLeaf.codeBlocks.map((cb, cIdx) => (
                      <div
                        key={cIdx}
                        className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden"
                      >
                        {cb.filename && (
                          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                            <FileCode2 className="w-3.5 h-3.5 text-sky-400" /> {cb.filename}
                          </div>
                        )}
                        <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                          <code>{cb.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Statutory Key Rules */}
                {currentLeaf.keyRules.length > 0 && (
                  <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-500/20 space-y-2">
                    <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" /> Statutory Rules & Invariants:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                      {currentLeaf.keyRules.map((rule, rIdx) => (
                        <li key={rIdx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              /* Chapter Overview Level */
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-sky-500/20 text-sky-300 font-bold">
                      {currentChapter.chapterCode}
                    </span>
                    <span className="text-xs text-slate-400">
                      {currentChapter.readTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{currentChapter.title}</h2>
                  <p className="text-sm text-sky-400/90 font-medium mt-1 mb-4">
                    {currentChapter.subtitle}
                  </p>
                </div>

                {/* Render Sections Grid */}
                <div className="space-y-4">
                  {currentChapter.sections.map(sec => (
                    <div
                      key={sec.nodeId}
                      className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-sky-400" />
                          {sec.title}
                        </h3>
                        <span className="text-xs font-mono text-slate-500">
                          {sec.topics.length} topics
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{sec.summary}</p>

                      {/* Topic cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                        {sec.topics.map(top => (
                          <div
                            key={top.nodeId}
                            onClick={() => {
                              selectSection(sec.nodeId);
                              selectTopic(top.nodeId);
                              if (top.leaves.length > 0) {
                                selectLeaf(top.leaves[0].nodeId);
                              }
                            }}
                            className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/40 cursor-pointer transition group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-sky-400 font-bold">
                                {top.nodeId}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {top.leaves.length} leaves
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition">
                              {top.title.split(': ')[1] || top.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
