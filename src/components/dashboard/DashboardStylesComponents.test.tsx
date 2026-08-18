import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import * as S from './DashboardStylesComponents';

describe('DashboardStylesComponents Component', () => {
  it('renders or exports component cleanly', () => {
    expect(S.PageContainer).toBeDefined();
    expect(S.SideRailBrand).toBeDefined();
  });
});
