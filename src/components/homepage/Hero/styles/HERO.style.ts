import type { CSSProperties } from 'react';
import { Z_INDEX } from '../../../../styles/zIndexTokens';

import '../LuxuryHeroSection.css';
import '../theme-light.append.css';

type HeroLayerStyle = CSSProperties & {
  '--hero-layer-background': number;
  '--hero-layer-content': number;
};

export const heroLayerStyle: HeroLayerStyle = {
  '--hero-layer-background': Z_INDEX.CANVAS,
  '--hero-layer-content': Z_INDEX.CONTENT,
};
