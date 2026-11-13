// src/components/ZoeFeatures/WhiteCavesBook/BookContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { BOOK_CHAPTERS, TOPIC_GLOSSARY } from './bookKnowledgeRegistry';
import { ChapterDefinition, BookCategory, TopicGlossaryItem } from './types';

interface BookContextType {
  chapters: ChapterDefinition[];
  currentChapter: ChapterDefinition;
  currentSlug: string;
  selectChapterBySlug: (slug: string) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredChapters: ChapterDefinition[];
  glossary: Record<string, TopicGlossaryItem>;
  recordLearning: (learning: {
    chapterSlug: string;
    sectionTitle: string;
    content: string;
    keyTakeaway: string;
  }) => void;
}

const BookContext = createContext<BookContextType | null>(null);

export const BookProvider: React.FC<{ children: ReactNode; initialSlug?: string }> = ({
  children,
  initialSlug = 'chapter-01-architecture',
}) => {
  const [chapters, setChapters] = useState<ChapterDefinition[]>(BOOK_CHAPTERS);
  const [currentSlug, setCurrentSlug] = useState<string>(initialSlug);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const currentChapter = useMemo(() => {
    return chapters.find(c => c.slug === currentSlug) || chapters[0];
  }, [chapters, currentSlug]);

  const currentIndex = useMemo(() => {
    return chapters.findIndex(c => c.slug === currentChapter.slug);
  }, [chapters, currentChapter]);

  const nextChapter = () => {
    if (currentIndex < chapters.length - 1) {
      setCurrentSlug(chapters[currentIndex + 1].slug);
    }
  };

  const prevChapter = () => {
    if (currentIndex > 0) {
      setCurrentSlug(chapters[currentIndex - 1].slug);
    }
  };

  const selectChapterBySlug = (slug: string) => {
    const exists = chapters.find(c => c.slug === slug);
    if (exists) {
      setCurrentSlug(slug);
    }
  };

  const filteredChapters = useMemo(() => {
    return chapters.filter(c => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [chapters, selectedCategory, searchQuery]);

  // Programmatic Self-Learning function for AEGIS
  const recordLearning = ({
    chapterSlug,
    sectionTitle,
    content,
    keyTakeaway,
  }: {
    chapterSlug: string;
    sectionTitle: string;
    content: string;
    keyTakeaway: string;
  }) => {
    setChapters(prev =>
      prev.map(ch => {
        if (ch.slug === chapterSlug) {
          return {
            ...ch,
            sections: [
              ...ch.sections,
              {
                id: `learned-${Date.now()}`,
                title: sectionTitle,
                content,
                keyTakeaways: [keyTakeaway],
              },
            ],
          };
        }
        return ch;
      })
    );
  };

  return (
    <BookContext.Provider
      value={{
        chapters,
        currentChapter,
        currentSlug,
        selectChapterBySlug,
        nextChapter,
        prevChapter,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredChapters,
        glossary: TOPIC_GLOSSARY,
        recordLearning,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
};
