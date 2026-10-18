import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getButtonByVisibleTextInActionGroup } from './getButtonByName';

describe('getButtonByName', () => {
  it('finds visible buttons with text beside decorative content', () => {
    render(<div><button type="button"><svg aria-hidden="true" />Reset scan</button></div>);
    expect(getButtonByVisibleTextInActionGroup('Reset scan')).toBeVisible();
  });

  it('supports nested text, regular expressions and disabled controls', () => {
    render(<div><button type="button" disabled><span>Save reviewed source</span></button></div>);
    expect(getButtonByVisibleTextInActionGroup(/Save reviewed/)).toBeDisabled();
  });

  it('does not return controls hidden by an ancestor', () => {
    render(<div hidden><button type="button">Reset scan</button></div>);
    expect(() => getButtonByVisibleTextInActionGroup('Reset scan')).toThrow();
  });

  it('rejects hidden matching text even when the containing button has an accessible label', () => {
    render(<div><button type="button" aria-label="Reset scan"><span hidden>Reset scan</span></button></div>);
    expect(() => getButtonByVisibleTextInActionGroup('Reset scan')).toThrow('Button text must be accessible');
  });

  it('does not bypass a conflicting accessible name', () => {
    render(<div><button type="button" aria-label="Different action">Reset scan</button></div>);
    expect(() => getButtonByVisibleTextInActionGroup('Reset scan')).toThrow();
  });

  it('rejects ambiguous visible text', () => {
    render(<div><button type="button">Reset scan</button><button type="button">Reset scan</button></div>);
    expect(() => getButtonByVisibleTextInActionGroup('Reset scan')).toThrow();
  });

  it('rejects a non-button with the requested text', () => {
    render(<div>Reset scan</div>);
    expect(() => getButtonByVisibleTextInActionGroup('Reset scan')).toThrow();
  });

  it('documents local action-group scope when another group repeats the accessible name', () => {
    render(<>
      <div><button type="button">Reset scan</button></div>
      <div><button type="button" aria-label="Reset scan">Different visible action</button></div>
    </>);
    expect(getButtonByVisibleTextInActionGroup('Reset scan')).toBeVisible();
  });
});
