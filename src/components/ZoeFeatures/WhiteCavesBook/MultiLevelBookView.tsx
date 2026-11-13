// src/components/ZoeFeatures/WhiteCavesBook/MultiLevelBookView.tsx
import React, { useMemo } from 'react';
import { useMultiLevelBook } from './MultiLevelBookContext';
import { AEGIS_12_LEVEL_CORPUS } from './masterLibraryData';
import { search12LevelTree, SearchMatch } from './treeQueryEngine';
import {
  BookOpen,
  ChevronRight,
  Search,
  Layers,
  FolderTree,
  FileCode2,
  Sigma,
  CornerDownRight,
  ArrowUpLeft,
  AlignLeft,
  X,
} from 'lucide-react';

export const MultiLevelBookView: React.FC = () => {
  const {
    currentLibrary,
    currentBook,
    currentVolume,
    currentCanto,
    currentChapter,
    currentSubChapter,
    currentSection,
    currentTopic,
    currentArtifact,
    currentParagraph,
    currentSentence,
    currentLine,
    activeLevel,
    breadcrumbs,
    searchQuery,
    setSearchQuery,
    selectBook,
    selectVolume,
    selectCanto,
    selectChapter,
    selectSubChapter,
    selectSection,
    selectTopic,
    selectArtifact,
    selectParagraph,
    selectSentence,
    selectLine,
    returnUpOneLevel,
    resetToChapter,
  } = useMultiLevelBook();

  // Search results computed via 12-Level Omni-Search Engine
  const searchResults = useMemo(() => {
    return search12LevelTree(AEGIS_12_LEVEL_CORPUS, searchQuery, 15);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full w-full bg-[#030712] text-slate-100 rounded-xl border border-sky-500/20 overflow-hidden shadow-2xl">
      {/* ── Level 0 & 1: Master Header Strip ── */}
      <div className="px-5 py-3 bg-slate-900/90 border-b border-sky-500/20 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">
                Level {activeLevel} / 12
              </span>
              <span className="text-slate-600">|</span>
              <h1 className="font-bold text-sm tracking-wide text-white">{currentBook.title}</h1>
            </div>
            <p className="text-[11px] text-slate-400">{currentBook.subtitle}</p>
          </div>

          {/* Book Switcher Tabs: 1. White Caves (Project & Brokerage) | 2. AEGIS (Autonomous Multi-Agent AI Engine) */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 ml-4">
            {currentLibrary.books.map(b => {
              const isSelected = b.bookId === currentBook.bookId;
              return (
                <button
                  key={b.bookId}
                  onClick={() => selectBook(b.bookId)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-slate-600'}`}
                  ></span>
                  <span>
                    {b.bookNumber === 1
                      ? 'Book 1: White Caves Real Estate'
                      : 'Book 2: AEGIS Autonomous Engine'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global 12-Level Omni-Search */}
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search lines, sentences, artifacts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1 text-xs bg-slate-950/80 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Omni-Search Live Dropdown */}
          {searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-9 bg-slate-900 border border-sky-500/30 rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-800">
              <div className="px-3 py-1.5 bg-slate-950 text-[10px] text-slate-400 font-mono uppercase flex justify-between">
                <span>{searchResults.length} Matches Found</span>
                <span>Sub-60-Token Coordinates</span>
              </div>
              {searchResults.length === 0 ? (
                <div className="p-3 text-xs text-slate-500 text-center">
                  No nodes matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map(match => (
                  <button
                    key={match.nodeId}
                    onClick={() => {
                      selectBook(match.bookId);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-slate-800/80 transition flex flex-col gap-1 group"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-sky-400 font-semibold uppercase bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.5 rounded">
                        L{match.level}: {match.levelName}
                      </span>
                      <span className="text-slate-500 text-[10px]">{match.bookTitle}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {match.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 italic">
                      "{match.snippet}"
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Level 3 & 4: Volume & Canto Horizontal Selection Strip ── */}
      <div className="px-5 py-2 bg-slate-950/95 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center gap-1 mr-2">
          <Layers className="w-3.5 h-3.5 text-sky-400" /> Volumes:
        </span>
        {currentBook.volumes.map(vol => (
          <button
            key={vol.nodeId}
            onClick={() => selectVolume(vol.nodeId)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
              vol.nodeId === currentVolume.nodeId
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="font-mono text-[10px] text-slate-500">L3: Vol {vol.volumeNumber}</span>
          </button>
        ))}

        <div className="h-4 w-[1px] bg-slate-800 mx-2" />

        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
          Cantos:
        </span>
        {currentVolume.cantos.map(canto => (
          <button
            key={canto.nodeId}
            onClick={() => selectCanto(canto.nodeId)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition whitespace-nowrap ${
              canto.nodeId === currentCanto.nodeId
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            L4: Canto {canto.cantoNumber}
          </button>
        ))}
      </div>

      {/* ── Main Viewport Split: 12-Level Vertical Navigator vs Deep Content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Structure Accordion (Level 5 to Level 12) */}
        <div className="w-80 border-r border-sky-500/20 bg-slate-900/40 flex flex-col overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-sky-400" /> Structure Mesh (L5-L12)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {currentCanto.chapters.length} Ch
            </span>
          </div>

          {currentCanto.chapters.map(ch => {
            const isChapterActive = ch.nodeId === currentChapter.nodeId;
            return (
              <div
                key={ch.nodeId}
                className={`rounded-lg border transition ${
                  isChapterActive
                    ? 'border-sky-500/30 bg-sky-950/20'
                    : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                {/* Level 5: Chapter */}
                <button
                  onClick={() => selectChapter(ch.nodeId)}
                  className="w-full text-left p-2.5 flex items-start justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-sky-500/20 text-sky-300 font-bold">
                        {ch.chapterCode}
                      </span>
                      <span className="text-[10px] text-slate-500">{ch.readTimeMinutes}m read</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300 transition leading-snug">
                      {ch.title.split(': ')[1] || ch.title}
                    </div>
                  </div>
                </button>

                {/* Sub-Tree for Active Chapter */}
                {isChapterActive && (
                  <div className="px-2 pb-2 pt-1 border-t border-slate-800/60 space-y-2">
                    {ch.subChapters.map(subCh => {
                      const isSubActive = currentSubChapter?.nodeId === subCh.nodeId;
                      return (
                        <div
                          key={subCh.nodeId}
                          className="space-y-1 pl-2 border-l border-slate-800"
                        >
                          {/* Level 6: Sub-Chapter */}
                          <button
                            onClick={() => selectSubChapter(subCh.nodeId)}
                            className={`w-full text-left text-[11px] font-semibold py-0.5 transition flex items-center justify-between ${
                              isSubActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>L6: Sub-Ch {subCh.subChapterNumber}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {subCh.sections.length} sec
                            </span>
                          </button>

                          {/* Level 7: Sections */}
                          {isSubActive && (
                            <div className="space-y-1 pl-2">
                              {subCh.sections.map(sec => {
                                const isSecActive = currentSection?.nodeId === sec.nodeId;
                                return (
                                  <div key={sec.nodeId}>
                                    <button
                                      onClick={() => selectSection(sec.nodeId)}
                                      className={`w-full text-left text-[11px] py-0.5 transition truncate flex items-center gap-1 ${
                                        isSecActive
                                          ? 'text-emerald-400 font-bold'
                                          : 'text-slate-400 hover:text-slate-300'
                                      }`}
                                    >
                                      <CornerDownRight className="w-2.5 h-2.5 opacity-60" />
                                      L7: § {sec.sectionNumber}
                                    </button>

                                    {/* Level 8: Topics */}
                                    {isSecActive && (
                                      <div className="pl-3 pt-1 space-y-1">
                                        {sec.topics.map(top => {
                                          const isTopActive = currentTopic?.nodeId === top.nodeId;
                                          return (
                                            <div key={top.nodeId}>
                                              <button
                                                onClick={() => selectTopic(top.nodeId)}
                                                className={`w-full text-left text-[10px] py-0.5 transition truncate flex items-center gap-1 ${
                                                  isTopActive
                                                    ? 'text-amber-400 font-bold'
                                                    : 'text-slate-500 hover:text-slate-400'
                                                }`}
                                              >
                                                <span>L8: T-{top.topicNumber}</span>
                                              </button>

                                              {/* Level 9: Artifacts / Files */}
                                              {isTopActive && (
                                                <div className="pl-3 pt-1 space-y-0.5">
                                                  {top.artifacts.map(art => {
                                                    const isArtActive =
                                                      currentArtifact?.nodeId === art.nodeId;
                                                    return (
                                                      <button
                                                        key={art.nodeId}
                                                        onClick={() => selectArtifact(art.nodeId)}
                                                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-mono transition flex items-center justify-between ${
                                                          isArtActive
                                                            ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                                                            : 'bg-slate-900/40 text-slate-400 hover:text-slate-200'
                                                        }`}
                                                      >
                                                        <span className="truncate">
                                                          L9: Art #{art.artifactNumber}
                                                        </span>
                                                        <span className="text-[8px] uppercase px-1 rounded bg-black/40">
                                                          {art.type}
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
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Viewport: Complete 12-Level Drilldown Display */}
        <div className="flex-1 flex flex-col bg-[#050B17] overflow-hidden">
          {/* Breadcrumb Strip */}
          <div className="px-6 py-2.5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-slate-400">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.pathId + idx}>
                  <span className="hover:text-slate-200 font-mono text-[11px] whitespace-nowrap cursor-pointer">
                    <span className="text-sky-500 font-semibold">
                      {bc.levelName.split(':')[0]}:
                    </span>{' '}
                    {bc.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Level Return Controls */}
            <div className="flex items-center gap-2">
              {activeLevel > 5 && (
                <button
                  onClick={returnUpOneLevel}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-400 transition"
                  title="Return up one level in hierarchy"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5" /> Up to L{activeLevel - 1}
                </button>
              )}
              {activeLevel > 5 && (
                <button
                  onClick={resetToChapter}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition"
                >
                  Back to Chapter (L5)
                </button>
              )}
            </div>
          </div>

          {/* Deep Level Presentation Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-4xl">
            {/* If at Level 9 - 12 (Artifact, Paragraph, Sentence, Line) */}
            {currentArtifact ? (
              <div className="space-y-6">
                {/* Level 9: Artifact Header */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 font-bold uppercase tracking-wider">
                      Level 9 Artifact #{currentArtifact.artifactNumber} [{currentArtifact.type}]
                    </span>
                    {currentArtifact.complexity && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        Complexity: {currentArtifact.complexity}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{currentArtifact.title}</h2>
                  {currentArtifact.filePath && (
                    <div className="text-xs font-mono text-sky-400 flex items-center gap-1.5 mt-2">
                      <FileCode2 className="w-4 h-4" /> {currentArtifact.filePath}
                      {currentArtifact.totalLines && (
                        <span className="text-slate-500">({currentArtifact.totalLines} lines)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Level 10: Paragraphs */}
                <div className="space-y-4">
                  {currentArtifact.paragraphs.map(p => {
                    const isPActive = currentParagraph?.nodeId === p.nodeId;
                    return (
                      <div
                        key={p.nodeId}
                        onClick={() => selectParagraph(p.nodeId)}
                        className={`p-4 rounded-xl border transition cursor-pointer ${
                          isPActive
                            ? 'bg-slate-900/90 border-sky-500/50 shadow-md'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-sky-400 mb-2">
                          <span className="flex items-center gap-1.5 font-bold">
                            <AlignLeft className="w-3.5 h-3.5" /> Level 10 Paragraph ¶{' '}
                            {p.paragraphNumber}
                          </span>
                          <span className="text-slate-500">{p.sentences.length} sentences</span>
                        </div>
                        {p.header && (
                          <h4 className="text-sm font-bold text-white mb-2">{p.header}</h4>
                        )}
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">{p.narrative}</p>

                        {/* Level 10 Math */}
                        {p.mathFormulas && p.mathFormulas.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {p.mathFormulas.map((math, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-emerald-300 space-y-1"
                              >
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                  <Sigma className="w-4 h-4" /> {math.title}
                                </div>
                                <div className="font-mono text-sm bg-black/60 px-3 py-2 rounded text-center text-emerald-200 overflow-x-auto">
                                  {math.latex}
                                </div>
                                <p className="text-[11px] text-slate-400 italic">
                                  {math.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Level 11: Sentences inside Paragraph */}
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            Level 11 Sentences (Atomic Propositions):
                          </div>
                          {p.sentences.map(sent => {
                            const isSActive = currentSentence?.nodeId === sent.nodeId;
                            return (
                              <div
                                key={sent.nodeId}
                                onClick={e => {
                                  e.stopPropagation();
                                  selectParagraph(p.nodeId);
                                  selectSentence(sent.nodeId);
                                }}
                                className={`p-2.5 rounded-lg border text-xs transition ${
                                  isSActive
                                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono text-[10px] text-emerald-400">
                                    Sentence S.{sent.sentenceNumber}
                                  </span>
                                  {sent.statutoryInvariant && (
                                    <span className="text-[9px] uppercase px-1 rounded bg-red-500/20 text-red-400 font-bold">
                                      Statutory Invariant
                                    </span>
                                  )}
                                </div>
                                <div className="italic font-serif leading-relaxed mb-2">
                                  "{sent.statement}"
                                </div>

                                {/* Level 12: Code Lines inside Sentence */}
                                <div className="space-y-1 pt-1.5 border-t border-slate-800/60 font-mono text-[11px]">
                                  <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                                    Level 12 Code Lines & Token Coordinates:
                                  </div>
                                  {sent.lines.map(line => {
                                    const isLActive = currentLine?.nodeId === line.nodeId;
                                    return (
                                      <div
                                        key={line.nodeId}
                                        onClick={ev => {
                                          ev.stopPropagation();
                                          selectParagraph(p.nodeId);
                                          selectSentence(sent.nodeId);
                                          selectLine(line.nodeId);
                                        }}
                                        className={`px-2 py-1 rounded flex items-center gap-3 transition ${
                                          isLActive
                                            ? 'bg-sky-500/20 text-sky-200 border border-sky-500/40'
                                            : 'hover:bg-slate-800/60 text-slate-300'
                                        }`}
                                      >
                                        <span className="text-slate-600 select-none w-6 text-right font-mono text-[10px]">
                                          {line.lineNumber}
                                        </span>
                                        <code className="flex-1">{line.text}</code>
                                        {line.tokenType && (
                                          <span className="text-[9px] px-1 rounded bg-black/40 text-slate-400">
                                            {line.tokenType}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Level 5 Chapter Viewport Baseline */
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded font-mono text-xs bg-sky-500/20 text-sky-300 font-bold">
                      Level 5: {currentChapter.chapterCode}
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

                <div className="space-y-4">
                  {currentChapter.subChapters.map(subCh => (
                    <div
                      key={subCh.nodeId}
                      className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-sky-400" />
                          Level 6 Sub-Chapter {subCh.subChapterNumber}: {subCh.title}
                        </h3>
                        <span className="text-xs font-mono text-slate-500">
                          {subCh.sections.length} Sections
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{subCh.summary}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                        {subCh.sections.map(sec => (
                          <div
                            key={sec.nodeId}
                            onClick={() => {
                              selectSubChapter(subCh.nodeId);
                              selectSection(sec.nodeId);
                            }}
                            className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition"
                          >
                            <div className="text-[10px] font-mono text-sky-400 font-bold mb-1">
                              Level 7: § {sec.sectionNumber}
                            </div>
                            <div className="text-xs font-semibold text-slate-200">{sec.title}</div>
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
