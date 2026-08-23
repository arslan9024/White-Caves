import { describe, it, expect } from 'vitest';
import { PROPERTY_CARD_TEXT } from './PropertyCard.data';

describe('PropertyCard.data', () => {
  it('exports property card UI text constants', () => {
    expect(PROPERTY_CARD_TEXT.bedsLabel).toBe('Beds');
    expect(PROPERTY_CARD_TEXT.bathsLabel).toBe('Baths');
    expect(PROPERTY_CARD_TEXT.sqftLabel).toBe('Sq.Ft');
    expect(PROPERTY_CARD_TEXT.dldVerified).toBe('DLD Verified');
    expect(PROPERTY_CARD_TEXT.favoriteAriaAdd).toBeTruthy();
    expect(PROPERTY_CARD_TEXT.favoriteAriaRemove).toBeTruthy();
  });
});
