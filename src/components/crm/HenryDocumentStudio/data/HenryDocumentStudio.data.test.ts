import { describe, it, expect } from 'vitest';
import { DOCUMENT_TEMPLATES } from './HenryDocumentStudio.data';

describe('HenryDocumentStudio.data', () => {
  it('exports valid document templates with icons and categories', () => {
    expect(DOCUMENT_TEMPLATES.length).toBeGreaterThan(0);
    DOCUMENT_TEMPLATES.forEach(template => {
      expect(template.id).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.badge).toBeTruthy();
    });
  });
});
