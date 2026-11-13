// src/components/ZoeFeatures/WhiteCavesBook/MultiLevelBookContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { AEGIS_12_LEVEL_CORPUS } from './masterLibraryData';
import { TreeNavigationSnapshot, areSnapshotsEqual } from './navigationHistoryTypes';
import {
  MasterCorpusRoot,
  ProjectLibraryNode,
  BookNode,
  VolumeNode,
  CantoNode,
  ChapterNode,
  SubChapterNode,
  SectionNode,
  TopicNode,
  LeafArtifactNode,
  ParagraphNode,
  SentenceNode,
  LineNode,
  NavigationBreadcrumb,
} from './treeTypes';

interface MultiLevelBookContextType {
  corpus: MasterCorpusRoot;
  currentLibrary: ProjectLibraryNode;
  currentBook: BookNode;
  currentVolume: VolumeNode;
  currentCanto: CantoNode;
  currentChapter: ChapterNode;
  currentSubChapter: SubChapterNode | null;
  currentSection: SectionNode | null;
  currentTopic: TopicNode | null;
  currentArtifact: LeafArtifactNode | null;
  currentParagraph: ParagraphNode | null;
  currentSentence: SentenceNode | null;
  currentLine: LineNode | null;
  activeLevel: number;
  breadcrumbs: NavigationBreadcrumb[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // History stack controls
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  historyLength: number;

  // Level selector actions
  selectBook: (bookId: string) => void;
  selectVolume: (volId: string) => void;
  selectCanto: (cantoId: string) => void;
  selectChapter: (chapterId: string) => void;
  selectSubChapter: (subId: string) => void;
  selectSection: (secId: string) => void;
  selectTopic: (topId: string) => void;
  selectArtifact: (artId: string) => void;
  selectParagraph: (pId: string) => void;
  selectSentence: (sId: string) => void;
  selectLine: (lId: string) => void;
  navigateToNodeId: (nodeId: string) => boolean;
  returnUpOneLevel: () => void;
  resetToChapter: () => void;
}

const MultiLevelBookContext = createContext<MultiLevelBookContextType | null>(null);

export const MultiLevelBookProvider: React.FC<{ children: ReactNode; initialBookId?: string }> = ({
  children,
  initialBookId = 'book-01-white-caves',
}) => {
  const [corpus] = useState<MasterCorpusRoot>(AEGIS_12_LEVEL_CORPUS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected level keys
  const [bookId, setBookId] = useState<string>(initialBookId);

  // Sync initialBookId if parent changes
  React.useEffect(() => {
    if (initialBookId) {
      setBookId(initialBookId);
    }
  }, [initialBookId]);
  const [volId, setVolId] = useState<string>('VL03-001');
  const [cantoId, setCantoId] = useState<string>('CN04-001');
  const [chapterId, setChapterId] = useState<string>('CH05-001');
  const [subChapterId, setSubChapterId] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [artifactId, setArtifactId] = useState<string | null>(null);
  const [paragraphId, setParagraphId] = useState<string | null>(null);
  const [sentenceId, setSentenceId] = useState<string | null>(null);
  const [lineId, setLineId] = useState<string | null>(null);

  // Browser-style Navigation History Stack
  const initialSnapshot: TreeNavigationSnapshot = useMemo(
    () => ({
      bookId: initialBookId,
      volId: 'VL03-001',
      cantoId: 'CN04-001',
      chapterId: 'CH05-001',
      subChapterId: null,
      sectionId: null,
      topicId: null,
      artifactId: null,
      paragraphId: null,
      sentenceId: null,
      lineId: null,
    }),
    [initialBookId]
  );

  const [history, setHistory] = useState<TreeNavigationSnapshot[]>([initialSnapshot]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isNavigatingHistoryRef = useRef<boolean>(false);

  // Push snapshot to history when state changes (unless navigating through history)
  const currentSnapshot: TreeNavigationSnapshot = useMemo(
    () => ({
      bookId,
      volId,
      cantoId,
      chapterId,
      subChapterId,
      sectionId,
      topicId,
      artifactId,
      paragraphId,
      sentenceId,
      lineId,
    }),
    [
      bookId,
      volId,
      cantoId,
      chapterId,
      subChapterId,
      sectionId,
      topicId,
      artifactId,
      paragraphId,
      sentenceId,
      lineId,
    ]
  );

  React.useEffect(() => {
    if (isNavigatingHistoryRef.current) {
      isNavigatingHistoryRef.current = false;
      return;
    }

    setHistory(prev => {
      const active = prev[historyIndex];
      if (active && areSnapshotsEqual(active, currentSnapshot)) {
        return prev;
      }
      // Truncate any forward history and append the new snapshot
      const updated = [...prev.slice(0, historyIndex + 1), currentSnapshot];
      return updated;
    });
    setHistoryIndex(prev => prev + 1);
  }, [currentSnapshot]);

  const applySnapshot = useCallback((snap: TreeNavigationSnapshot) => {
    isNavigatingHistoryRef.current = true;
    setBookId(snap.bookId);
    setVolId(snap.volId);
    setCantoId(snap.cantoId);
    setChapterId(snap.chapterId);
    setSubChapterId(snap.subChapterId);
    setSectionId(snap.sectionId);
    setTopicId(snap.topicId);
    setArtifactId(snap.artifactId);
    setParagraphId(snap.paragraphId);
    setSentenceId(snap.sentenceId);
    setLineId(snap.lineId);
  }, []);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetSnap = history[targetIndex];
      if (targetSnap) {
        setHistoryIndex(targetIndex);
        applySnapshot(targetSnap);
      }
    }
  }, [historyIndex, history, applySnapshot]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetSnap = history[targetIndex];
      if (targetSnap) {
        setHistoryIndex(targetIndex);
        applySnapshot(targetSnap);
      }
    }
  }, [historyIndex, history, applySnapshot]);

  // Derivations
  const currentLibrary = corpus.libraries[0];
  const currentBook = useMemo(() => {
    return currentLibrary.books.find(b => b.bookId === bookId) || currentLibrary.books[0];
  }, [currentLibrary, bookId]);

  const currentVolume = useMemo(() => {
    return currentBook.volumes.find(v => v.nodeId === volId) || currentBook.volumes[0];
  }, [currentBook, volId]);

  const currentCanto = useMemo(() => {
    return currentVolume.cantos.find(c => c.nodeId === cantoId) || currentVolume.cantos[0];
  }, [currentVolume, cantoId]);

  const currentChapter = useMemo(() => {
    return currentCanto.chapters.find(ch => ch.nodeId === chapterId) || currentCanto.chapters[0];
  }, [currentCanto, chapterId]);

  const currentSubChapter = useMemo(() => {
    if (!subChapterId) return null;
    return currentChapter.subChapters.find(sc => sc.nodeId === subChapterId) || null;
  }, [currentChapter, subChapterId]);

  const currentSection = useMemo(() => {
    if (!currentSubChapter || !sectionId) return null;
    return currentSubChapter.sections.find(s => s.nodeId === sectionId) || null;
  }, [currentSubChapter, sectionId]);

  const currentTopic = useMemo(() => {
    if (!currentSection || !topicId) return null;
    return currentSection.topics.find(t => t.nodeId === topicId) || null;
  }, [currentSection, topicId]);

  const currentArtifact = useMemo(() => {
    if (!currentTopic || !artifactId) return null;
    return currentTopic.artifacts.find(a => a.nodeId === artifactId) || null;
  }, [currentTopic, artifactId]);

  const currentParagraph = useMemo(() => {
    if (!currentArtifact || !paragraphId) return null;
    return currentArtifact.paragraphs.find(p => p.nodeId === paragraphId) || null;
  }, [currentArtifact, paragraphId]);

  const currentSentence = useMemo(() => {
    if (!currentParagraph || !sentenceId) return null;
    return currentParagraph.sentences.find(s => s.nodeId === sentenceId) || null;
  }, [currentParagraph, sentenceId]);

  const currentLine = useMemo(() => {
    if (!currentSentence || !lineId) return null;
    return currentSentence.lines.find(l => l.nodeId === lineId) || null;
  }, [currentSentence, lineId]);

  // Determine active level (0 to 12)
  const activeLevel = useMemo(() => {
    if (currentLine) return 12;
    if (currentSentence) return 11;
    if (currentParagraph) return 10;
    if (currentArtifact) return 9;
    if (currentTopic) return 8;
    if (currentSection) return 7;
    if (currentSubChapter) return 6;
    return 5; // Chapter level baseline
  }, [
    currentLine,
    currentSentence,
    currentParagraph,
    currentArtifact,
    currentTopic,
    currentSection,
    currentSubChapter,
  ]);

  // Full 12-Level Dynamic Breadcrumb Lineage
  const breadcrumbs = useMemo(() => {
    const b: NavigationBreadcrumb[] = [
      { level: 0, levelName: 'L0: Corpus', label: corpus.corpusName, pathId: 'corpus' },
      {
        level: 1,
        levelName: 'L1: Library',
        label: currentLibrary.title,
        pathId: currentLibrary.libraryId,
      },
      { level: 2, levelName: 'L2: Book', label: currentBook.title, pathId: currentBook.bookId },
      {
        level: 3,
        levelName: 'L3: Volume',
        label: `Vol ${currentVolume.volumeNumber}`,
        pathId: currentVolume.nodeId,
      },
      {
        level: 4,
        levelName: 'L4: Canto',
        label: `Canto ${currentCanto.cantoNumber}`,
        pathId: currentCanto.nodeId,
      },
      {
        level: 5,
        levelName: 'L5: Chapter',
        label: currentChapter.chapterCode,
        pathId: currentChapter.nodeId,
      },
    ];
    if (currentSubChapter) {
      b.push({
        level: 6,
        levelName: 'L6: Sub-Ch',
        label: `SC-${currentSubChapter.subChapterNumber}`,
        pathId: currentSubChapter.nodeId,
      });
    }
    if (currentSection) {
      b.push({
        level: 7,
        levelName: 'L7: Section',
        label: `§ ${currentSection.sectionNumber}`,
        pathId: currentSection.nodeId,
      });
    }
    if (currentTopic) {
      b.push({
        level: 8,
        levelName: 'L8: Topic',
        label: `T-${currentTopic.topicNumber}`,
        pathId: currentTopic.nodeId,
      });
    }
    if (currentArtifact) {
      b.push({
        level: 9,
        levelName: 'L9: File',
        label: `Art #${currentArtifact.artifactNumber}`,
        pathId: currentArtifact.nodeId,
      });
    }
    if (currentParagraph) {
      b.push({
        level: 10,
        levelName: 'L10: Para',
        label: `¶ ${currentParagraph.paragraphNumber}`,
        pathId: currentParagraph.nodeId,
      });
    }
    if (currentSentence) {
      b.push({
        level: 11,
        levelName: 'L11: Sentence',
        label: `S.${currentSentence.sentenceNumber}`,
        pathId: currentSentence.nodeId,
      });
    }
    if (currentLine) {
      b.push({
        level: 12,
        levelName: 'L12: Line',
        label: `Line ${currentLine.lineNumber}`,
        pathId: currentLine.nodeId,
      });
    }
    return b;
  }, [
    corpus,
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
  ]);

  const selectBook = (id: string) => {
    setBookId(id);
    const targetBook = currentLibrary.books.find(b => b.bookId === id);
    if (targetBook && targetBook.volumes.length > 0) {
      const firstVol = targetBook.volumes[0];
      setVolId(firstVol.nodeId);
      if (firstVol.cantos.length > 0) {
        const firstCanto = firstVol.cantos[0];
        setCantoId(firstCanto.nodeId);
        if (firstCanto.chapters.length > 0) {
          setChapterId(firstCanto.chapters[0].nodeId);
        }
      }
    }
    resetToChapter();
  };

  const selectVolume = (id: string) => {
    setVolId(id);
    const target = currentBook.volumes.find(v => v.nodeId === id);
    if (target && target.cantos.length > 0) {
      setCantoId(target.cantos[0].nodeId);
      if (target.cantos[0].chapters.length > 0) {
        setChapterId(target.cantos[0].chapters[0].nodeId);
      }
    }
    resetToChapter();
  };

  const selectCanto = (id: string) => {
    setCantoId(id);
    const target = currentVolume.cantos.find(c => c.nodeId === id);
    if (target && target.chapters.length > 0) {
      setChapterId(target.chapters[0].nodeId);
    }
    resetToChapter();
  };

  const selectChapter = (id: string) => {
    setChapterId(id);
    resetToChapter();
  };

  const selectSubChapter = (id: string) => {
    setSubChapterId(id);
    setSectionId(null);
    setTopicId(null);
    setArtifactId(null);
    setParagraphId(null);
    setSentenceId(null);
    setLineId(null);
  };

  const selectSection = (id: string) => {
    setSectionId(id);
    setTopicId(null);
    setArtifactId(null);
    setParagraphId(null);
    setSentenceId(null);
    setLineId(null);
  };

  const selectTopic = (id: string) => {
    setTopicId(id);
    setArtifactId(null);
    setParagraphId(null);
    setSentenceId(null);
    setLineId(null);
  };

  const selectArtifact = (id: string) => {
    setArtifactId(id);
    setParagraphId(null);
    setSentenceId(null);
    setLineId(null);
  };

  const selectParagraph = (id: string) => {
    setParagraphId(id);
    setSentenceId(null);
    setLineId(null);
  };

  const selectSentence = (id: string) => {
    setSentenceId(id);
    setLineId(null);
  };

  const selectLine = (id: string) => {
    setLineId(id);
  };

  /**
   * Universal Hyperlink Navigator:
   * Jumps to ANY node across the entire 12-level hierarchy by its ID
   */
  const navigateToNodeId = (targetId: string): boolean => {
    if (!targetId) return false;
    const cleanId = targetId.trim().replace(/^#/, '');

    for (const lib of corpus.libraries) {
      for (const b of lib.books) {
        if (b.bookId === cleanId) {
          setBookId(b.bookId);
          resetToChapter();
          return true;
        }
        for (const v of b.volumes) {
          if (v.nodeId === cleanId) {
            setBookId(b.bookId);
            setVolId(v.nodeId);
            resetToChapter();
            return true;
          }
          for (const c of v.cantos) {
            if (c.nodeId === cleanId) {
              setBookId(b.bookId);
              setVolId(v.nodeId);
              setCantoId(c.nodeId);
              resetToChapter();
              return true;
            }
            for (const ch of c.chapters) {
              if (ch.nodeId === cleanId || ch.chapterCode === cleanId) {
                setBookId(b.bookId);
                setVolId(v.nodeId);
                setCantoId(c.nodeId);
                setChapterId(ch.nodeId);
                resetToChapter();
                return true;
              }
              for (const sc of ch.subChapters) {
                if (sc.nodeId === cleanId) {
                  setBookId(b.bookId);
                  setVolId(v.nodeId);
                  setCantoId(c.nodeId);
                  setChapterId(ch.nodeId);
                  setSubChapterId(sc.nodeId);
                  setSectionId(null);
                  return true;
                }
                for (const sec of sc.sections) {
                  if (sec.nodeId === cleanId) {
                    setBookId(b.bookId);
                    setVolId(v.nodeId);
                    setCantoId(c.nodeId);
                    setChapterId(ch.nodeId);
                    setSubChapterId(sc.nodeId);
                    setSectionId(sec.nodeId);
                    setTopicId(null);
                    return true;
                  }
                  for (const top of sec.topics) {
                    if (top.nodeId === cleanId) {
                      setBookId(b.bookId);
                      setVolId(v.nodeId);
                      setCantoId(c.nodeId);
                      setChapterId(ch.nodeId);
                      setSubChapterId(sc.nodeId);
                      setSectionId(sec.nodeId);
                      setTopicId(top.nodeId);
                      setArtifactId(null);
                      return true;
                    }
                    for (const art of top.artifacts) {
                      if (art.nodeId === cleanId) {
                        setBookId(b.bookId);
                        setVolId(v.nodeId);
                        setCantoId(c.nodeId);
                        setChapterId(ch.nodeId);
                        setSubChapterId(sc.nodeId);
                        setSectionId(sec.nodeId);
                        setTopicId(top.nodeId);
                        setArtifactId(art.nodeId);
                        setParagraphId(null);
                        return true;
                      }
                      for (const p of art.paragraphs) {
                        if (p.nodeId === cleanId) {
                          setBookId(b.bookId);
                          setVolId(v.nodeId);
                          setCantoId(c.nodeId);
                          setChapterId(ch.nodeId);
                          setSubChapterId(sc.nodeId);
                          setSectionId(sec.nodeId);
                          setTopicId(top.nodeId);
                          setArtifactId(art.nodeId);
                          setParagraphId(p.nodeId);
                          return true;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  };

  const resetToChapter = () => {
    setSubChapterId(null);
    setSectionId(null);
    setTopicId(null);
    setArtifactId(null);
    setParagraphId(null);
    setSentenceId(null);
    setLineId(null);
  };

  const returnUpOneLevel = () => {
    if (lineId) {
      setLineId(null);
    } else if (sentenceId) {
      setSentenceId(null);
    } else if (paragraphId) {
      setParagraphId(null);
    } else if (artifactId) {
      setArtifactId(null);
    } else if (topicId) {
      setTopicId(null);
    } else if (sectionId) {
      setSectionId(null);
    } else if (subChapterId) {
      setSubChapterId(null);
    }
  };

  return (
    <MultiLevelBookContext.Provider
      value={{
        corpus,
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
        canGoBack,
        canGoForward,
        goBack,
        goForward,
        historyLength: history.length,
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
        navigateToNodeId,
        returnUpOneLevel,
        resetToChapter,
      }}
    >
      {children}
    </MultiLevelBookContext.Provider>
  );
};

export const useMultiLevelBook = (): MultiLevelBookContextType => {
  const ctx = useContext(MultiLevelBookContext);
  if (!ctx) {
    throw new Error('useMultiLevelBook must be used within MultiLevelBookProvider');
  }
  return ctx;
};
