// src/components/ZoeFeatures/WhiteCavesBook/MultiLevelBookContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { AEGIS_MASTER_LIBRARY } from './masterLibraryData';
import {
  LibraryRoot,
  BookNode,
  VolumeNode,
  ChapterNode,
  SectionNode,
  TopicNode,
  LeafArtifact,
  NavigationBreadcrumb,
} from './treeTypes';

interface MultiLevelBookContextType {
  library: LibraryRoot;
  currentBook: BookNode;
  currentVolume: VolumeNode;
  currentChapter: ChapterNode;
  currentSection: SectionNode | null;
  currentTopic: TopicNode | null;
  currentLeaf: LeafArtifact | null;
  breadcrumbs: NavigationBreadcrumb[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Navigation actions
  selectVolume: (volumeId: string) => void;
  selectChapter: (chapterId: string) => void;
  selectSection: (sectionId: string) => void;
  selectTopic: (topicId: string) => void;
  selectLeaf: (leafId: string) => void;
  resetToChapter: () => void;
  resetToVolume: () => void;
  nextChapter: () => void;
  prevChapter: () => void;
  // Dynamic leaf register for AEGIS self-learning
  appendLeafArtifact: (
    chapterId: string,
    sectionId: string,
    topicId: string,
    artifact: LeafArtifact
  ) => void;
}

const MultiLevelBookContext = createContext<MultiLevelBookContextType | null>(null);

export const MultiLevelBookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<LibraryRoot>(AEGIS_MASTER_LIBRARY);
  const [currentBookId, setCurrentBookId] = useState<string>('book-01-white-caves');
  const [currentVolumeId, setCurrentVolumeId] = useState<string>('vol-01');
  const [currentChapterId, setCurrentChapterId] = useState<string>('ch-01');
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null);
  const [currentLeafId, setCurrentLeafId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentBook = useMemo(() => {
    return library.books.find(b => b.bookId === currentBookId) || library.books[0];
  }, [library, currentBookId]);

  const currentVolume = useMemo(() => {
    return currentBook.volumes.find(v => v.nodeId === currentVolumeId) || currentBook.volumes[0];
  }, [currentBook, currentVolumeId]);

  const currentChapter = useMemo(() => {
    return (
      currentVolume.chapters.find(c => c.nodeId === currentChapterId) || currentVolume.chapters[0]
    );
  }, [currentVolume, currentChapterId]);

  const currentSection = useMemo(() => {
    if (!currentSectionId) return null;
    return currentChapter.sections.find(s => s.nodeId === currentSectionId) || null;
  }, [currentChapter, currentSectionId]);

  const currentTopic = useMemo(() => {
    if (!currentSection || !currentTopicId) return null;
    return currentSection.topics.find(t => t.nodeId === currentTopicId) || null;
  }, [currentSection, currentTopicId]);

  const currentLeaf = useMemo(() => {
    if (!currentTopic || !currentLeafId) return null;
    return currentTopic.leaves.find(l => l.nodeId === currentLeafId) || null;
  }, [currentTopic, currentLeafId]);

  // Build root-to-leaf breadcrumb lineage
  const breadcrumbs = useMemo(() => {
    const list: NavigationBreadcrumb[] = [
      { level: 0, label: 'AEGIS Library', pathId: 'root' },
      { level: 1, label: currentBook.title, pathId: currentBook.bookId },
      { level: 2, label: `Vol ${currentVolume.volumeNumber}`, pathId: currentVolume.nodeId },
      { level: 3, label: currentChapter.chapterCode, pathId: currentChapter.nodeId },
    ];
    if (currentSection) {
      list.push({ level: 4, label: `Sec ${currentSection.nodeId}`, pathId: currentSection.nodeId });
    }
    if (currentTopic) {
      list.push({ level: 5, label: `Topic ${currentTopic.nodeId}`, pathId: currentTopic.nodeId });
    }
    if (currentLeaf) {
      list.push({ level: 6, label: `Leaf: ${currentLeaf.title}`, pathId: currentLeaf.nodeId });
    }
    return list;
  }, [currentBook, currentVolume, currentChapter, currentSection, currentTopic, currentLeaf]);

  const selectVolume = (volId: string) => {
    setCurrentVolumeId(volId);
    const targetVol = currentBook.volumes.find(v => v.nodeId === volId);
    if (targetVol && targetVol.chapters.length > 0) {
      setCurrentChapterId(targetVol.chapters[0].nodeId);
      setCurrentSectionId(null);
      setCurrentTopicId(null);
      setCurrentLeafId(null);
    }
  };

  const selectChapter = (chId: string) => {
    setCurrentChapterId(chId);
    setCurrentSectionId(null);
    setCurrentTopicId(null);
    setCurrentLeafId(null);
  };

  const selectSection = (secId: string) => {
    setCurrentSectionId(secId);
    setCurrentTopicId(null);
    setCurrentLeafId(null);
  };

  const selectTopic = (topId: string) => {
    setCurrentTopicId(topId);
    setCurrentLeafId(null);
  };

  const selectLeaf = (leafId: string) => {
    setCurrentLeafId(leafId);
  };

  const resetToChapter = () => {
    setCurrentSectionId(null);
    setCurrentTopicId(null);
    setCurrentLeafId(null);
  };

  const resetToVolume = () => {
    resetToChapter();
  };

  const chapterList = currentVolume.chapters;
  const currentChapterIdx = chapterList.findIndex(c => c.nodeId === currentChapter.nodeId);

  const nextChapter = () => {
    if (currentChapterIdx < chapterList.length - 1) {
      selectChapter(chapterList[currentChapterIdx + 1].nodeId);
    }
  };

  const prevChapter = () => {
    if (currentChapterIdx > 0) {
      selectChapter(chapterList[currentChapterIdx - 1].nodeId);
    }
  };

  const appendLeafArtifact = (
    chapterId: string,
    sectionId: string,
    topicId: string,
    artifact: LeafArtifact
  ) => {
    setLibrary(prev => {
      const cloned = JSON.parse(JSON.stringify(prev)) as LibraryRoot;
      for (const b of cloned.books) {
        for (const v of b.volumes) {
          for (const c of v.chapters) {
            if (c.nodeId === chapterId) {
              for (const s of c.sections) {
                if (s.nodeId === sectionId) {
                  for (const t of s.topics) {
                    if (t.nodeId === topicId) {
                      t.leaves.push(artifact);
                      return cloned;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return cloned;
    });
  };

  return (
    <MultiLevelBookContext.Provider
      value={{
        library,
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
        resetToVolume,
        nextChapter,
        prevChapter,
        appendLeafArtifact,
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
