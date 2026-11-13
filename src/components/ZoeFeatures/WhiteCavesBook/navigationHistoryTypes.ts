// src/components/ZoeFeatures/WhiteCavesBook/navigationHistoryTypes.ts
/**
 * Browser-style navigation history coordinates for 12-Level Knowledge Tree
 */

export interface TreeNavigationSnapshot {
  bookId: string;
  volId: string;
  cantoId: string;
  chapterId: string;
  subChapterId: string | null;
  sectionId: string | null;
  topicId: string | null;
  artifactId: string | null;
  paragraphId: string | null;
  sentenceId: string | null;
  lineId: string | null;
}

export function areSnapshotsEqual(a: TreeNavigationSnapshot, b: TreeNavigationSnapshot): boolean {
  return (
    a.bookId === b.bookId &&
    a.volId === b.volId &&
    a.cantoId === b.cantoId &&
    a.chapterId === b.chapterId &&
    a.subChapterId === b.subChapterId &&
    a.sectionId === b.sectionId &&
    a.topicId === b.topicId &&
    a.artifactId === b.artifactId &&
    a.paragraphId === b.paragraphId &&
    a.sentenceId === b.sentenceId &&
    a.lineId === b.lineId
  );
}
