// src/components/ZoeFeatures/WhiteCavesBook/treeTypes.ts
/**
 * Strict Multi-Level Mathematical Tree Schema for AEGIS Living Library.
 * Hierarchy:
 * Level 0: Library (The Master Aegis Library)
 * Level 1: Book (e.g. "The Book of White Caves", future books)
 * Level 2: Volume / Part (e.g. Vol 1: Architecture, Vol 2: Sovereign Mesh)
 * Level 3: Chapter (e.g. Chapter 01, Chapter 02...)
 * Level 4: Section (e.g. 1.0, 1.1, 1.2...)
 * Level 5: Topic / Sub-Section (e.g. 1.1.1, 1.1.2...)
 * Level 6: Leaf Node (Single Purpose File, UI Component, or Atomic Law)
 */

export interface CodeBlock {
  language: string;
  filename?: string;
  code: string;
}

export interface MathFormula {
  title: string;
  latex: string;
  explanation: string;
}

export interface LeafArtifact {
  nodeId: string; // e.g. "1.1.1.01"
  indexNumber: number;
  title: string;
  type: 'COMPONENT' | 'LAW' | 'DATA_CONTRACT' | 'ALGORITHM' | 'ADR';
  filePath?: string;
  lineCount?: number;
  complexity?: string; // e.g. "O(1)", "O(n)"
  content: string;
  codeBlocks?: CodeBlock[];
  mathFormulas?: MathFormula[];
  keyRules: string[];
  crossLinks?: { label: string; targetPath: string }[];
}

export interface TopicNode {
  nodeId: string; // e.g. "1.1.1"
  indexNumber: number;
  title: string;
  summary: string;
  leaves: LeafArtifact[];
}

export interface SectionNode {
  nodeId: string; // e.g. "1.1"
  indexNumber: number;
  title: string;
  summary: string;
  topics: TopicNode[];
}

export interface ChapterNode {
  nodeId: string; // e.g. "ch-01"
  indexNumber: number; // 1, 2, 3...
  chapterCode: string; // e.g. "CH-01"
  slug: string;
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  sections: SectionNode[];
}

export interface VolumeNode {
  nodeId: string; // e.g. "vol-01"
  volumeNumber: number; // 1, 2...
  title: string;
  description: string;
  chapters: ChapterNode[];
}

export interface BookNode {
  bookId: string;
  bookNumber: number; // 1 (White Caves), 2 (Future project)...
  title: string;
  subtitle: string;
  description: string;
  author: string;
  volumes: VolumeNode[];
}

export interface LibraryRoot {
  libraryName: string;
  version: string;
  totalBooks: number;
  books: BookNode[];
}

export interface NavigationBreadcrumb {
  level: number;
  label: string;
  pathId: string;
}
