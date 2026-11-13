// src/components/ZoeFeatures/WhiteCavesBook/treeTypes.ts
/**
 * Strict 12-Level Mathematical Tree Schema for AEGIS Living Knowledge Mesh.
 * Modeled after Bhakti 1-12-108 & Turing Invariants:
 *
 * Level 0:  Master Sovereign Corpus (The Global AEGIS Universe)
 * Level 1:  Project Library (Multi-Project Collection: White Caves, Future Projects...)
 * Level 2:  Tome / Book (e.g. "The Book of White Caves")
 * Level 3:  Volume / Part (e.g. Vol 1: Architecture, Vol 2: Sovereign Mesh)
 * Level 4:  Canto / Division (e.g. Engineering Track 1, Business Track 2)
 * Level 5:  Chapter (e.g. CH-01, CH-02...)
 * Level 6:  Sub-Chapter / Sub-Module (e.g. 1.0, 1.1...)
 * Level 7:  Section (e.g. 1.1.1, 1.1.2...)
 * Level 8:  Subsection / Topic (e.g. 1.1.1.1, 1.1.1.2...)
 * Level 9:  Leaf Artifact / File (e.g. turingOrchestrator.ts, Single Purpose Component)
 * Level 10: Paragraph / Rule Block (Structured paragraph & math proposition)
 * Level 11: Sentence / Proposition (Atomic truth, statutory statement)
 * Level 12: Line Item / Token Coordinate (Exact numbered code or rule line coordinate)
 */

export interface MathFormula {
  title: string;
  latex: string;
  explanation: string;
}

export interface CodeBlock {
  language: string;
  filename?: string;
  code: string;
}

/** Level 12: Atomic Line Item / Code Line Coordinate */
export interface LineNode {
  level: 12;
  nodeId: string; // e.g. "L12-001"
  lineNumber: number;
  text: string;
  tokenType?: 'KEYWORD' | 'IDENTIFIER' | 'OPERATOR' | 'LITERAL' | 'COMMENT';
}

/** Level 11: Sentence / Proposition */
export interface SentenceNode {
  level: 11;
  nodeId: string; // e.g. "S11-001"
  sentenceNumber: number;
  statement: string;
  statutoryInvariant: boolean;
  lines: LineNode[];
}

/** Level 10: Paragraph / Rule Block */
export interface ParagraphNode {
  level: 10;
  nodeId: string; // e.g. "P10-001"
  paragraphNumber: number;
  header?: string;
  narrative: string;
  markdownContent?: string;
  mathFormulas?: MathFormula[];
  codeBlocks?: CodeBlock[];
  sentences: SentenceNode[];
}

/** Level 9: Leaf Artifact / Single-Purpose File */
export interface LeafArtifactNode {
  level: 9;
  nodeId: string; // e.g. "A09-001"
  artifactNumber: number;
  title: string;
  type: 'COMPONENT' | 'LAW' | 'DATA_CONTRACT' | 'ALGORITHM' | 'ADR';
  filePath?: string;
  totalLines?: number;
  complexity?: string; // "O(1)", "O(n)"
  paragraphs: ParagraphNode[];
}

/** Level 8: Subsection / Topic */
export interface TopicNode {
  level: 8;
  nodeId: string; // e.g. "T08-001"
  topicNumber: number;
  title: string;
  summary: string;
  artifacts: LeafArtifactNode[];
}

/** Level 7: Section */
export interface SectionNode {
  level: 7;
  nodeId: string; // e.g. "S07-001"
  sectionNumber: number;
  title: string;
  summary: string;
  topics: TopicNode[];
}

/** Level 6: Sub-Chapter / Sub-Module */
export interface SubChapterNode {
  level: 6;
  nodeId: string; // e.g. "SC06-001"
  subChapterNumber: number;
  title: string;
  summary: string;
  sections: SectionNode[];
}

/** Level 5: Chapter */
export interface ChapterNode {
  level: 5;
  nodeId: string; // e.g. "CH05-001"
  chapterNumber: number;
  chapterCode: string; // "CH-01"
  title: string;
  subtitle: string;
  readTimeMinutes: number;
  overviewMarkdown?: string;
  subChapters: SubChapterNode[];
}

/** Level 4: Canto / Division */
export interface CantoNode {
  level: 4;
  nodeId: string; // e.g. "CN04-001"
  cantoNumber: number;
  title: string;
  description: string;
  chapters: ChapterNode[];
}

/** Level 3: Volume / Part */
export interface VolumeNode {
  level: 3;
  nodeId: string; // e.g. "VL03-001"
  volumeNumber: number;
  title: string;
  description: string;
  cantos: CantoNode[];
}

/** Level 2: Tome / Book */
export interface BookNode {
  level: 2;
  bookId: string;
  bookNumber: number; // Book #1, #2...
  title: string;
  subtitle: string;
  description: string;
  author: string;
  volumes: VolumeNode[];
}

/** Level 1: Project Library */
export interface ProjectLibraryNode {
  level: 1;
  libraryId: string;
  libraryNumber: number;
  title: string;
  description: string;
  books: BookNode[];
}

/** Level 0: Master Sovereign Corpus (Universe Root) */
export interface MasterCorpusRoot {
  level: 0;
  corpusName: string;
  version: string;
  totalProjects: number;
  libraries: ProjectLibraryNode[];
}

export interface NavigationBreadcrumb {
  level: number;
  levelName: string;
  label: string;
  pathId: string;
}
