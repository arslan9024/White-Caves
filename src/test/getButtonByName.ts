import { isInaccessible } from '@testing-library/dom';
import { screen, within } from '@testing-library/react';

/** Resolve unique visible button text, then validate its accessible name in its local action group. */
export function getButtonByVisibleTextInActionGroup(name: string | RegExp): HTMLButtonElement {
  const text = screen.getByText(name, { selector: 'button, button span' });
  if (isInaccessible(text)) {
    throw new Error('Button text must be accessible in the rendered action group');
  }
  const button = text.closest('button');
  if (!button?.parentElement) {
    throw new Error('Named button must be attached to a parent element');
  }

  const accessibleButton = within(button.parentElement).getByRole('button', { name });
  if (accessibleButton !== button) {
    throw new Error('Visible button text does not match its action-group accessible name');
  }
  return button;
}
