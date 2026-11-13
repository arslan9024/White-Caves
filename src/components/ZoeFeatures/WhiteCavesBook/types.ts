// src/components/ZoeFeatures/WhiteCavesBook/types.ts

export type BookCategory =
  | 'Core Architecture'
  | 'Autonomous Mesh'
  | 'Domain & Actors'
  | 'Multi-Repo Decoupling'
  | 'Living Chronicler';

export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface MathFormula {
  title: string;
  latex: string;
  explanation: string;
}

export interface ChapterSection {
  id: string;
  title: string;
  content: string;
  codeSnippets?: CodeSnippet[];
  mathFormulas?: MathFormula[];
  keyTakeaways?: string[];
}

export interface ChapterDefinition {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: BookCategory;
  readTime: string;
  summary: string;
  topics: string[];
  sections: ChapterSection[];
}

export interface TopicGlossaryItem {
  targetSlug: string;
  definition: string;
  category: BookCategory;
}
