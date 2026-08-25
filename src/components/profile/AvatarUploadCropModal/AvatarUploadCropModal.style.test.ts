import { describe, it, expect } from 'vitest';
import * as styles from './AvatarUploadCropModal.style';

describe('AvatarUploadCropModal.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.ModalOverlay).toBeDefined();
    expect(styles.ModalCard).toBeDefined();
    expect(styles.CropPreviewArea).toBeDefined();
  });
});
