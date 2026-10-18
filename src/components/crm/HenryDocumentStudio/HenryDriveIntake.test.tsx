import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import HenryDriveIntake from './HenryDriveIntake';
import { genericDocumentTypes } from '../../../../server/shared/henryDocumentRegistry';
import type { DriveImport } from '../../../services/henryDrive';
const called = vi.hoisted(() => vi.fn());
vi.mock('./HenryPassportScannerView', () => ({ default: (props: object) => { called('passport', props); return <p>Passport original review</p>; } }));
vi.mock('./HenryTitleDeedScannerView', () => ({ default: (props: object) => { called('title_deed', props); return <p>Title deed original review</p>; } }));
vi.mock('./HenryEmiratesIdScannerView', () => ({ default: (props: object) => { called('emirates_id', props); return <p>ID original review</p>; } }));
vi.mock('./HenryTenancyContractScannerView', () => ({ default: (props: object) => { called('tenancy_contract', props); return <p>Contract original review</p>; } }));
vi.mock('./HenryGenericDocumentPanel', () => ({ default: (props: object) => { called('generic', props); return <p>Generic original review</p>; } }));
const source: DriveImport = { file: new File(['%PDF-synthetic'], 'source.pdf', { type: 'application/pdf' }),
  sourceId: 'a'.repeat(24), driveOrigin: { proof: 'synthetic-encrypted-proof' } };
beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);
describe('Henry explicit Drive intake destinations', () => {
  it('does not invoke OCR or infer a category before the user chooses', () => {
    render(<HenryDriveIntake source={source} />);
    expect(screen.getByLabelText('Drive original category')).toHaveValue('');
    expect(called).not.toHaveBeenCalled();
    expect(screen.getAllByRole('option')).toHaveLength(14);
  });
  it.each(['passport', 'title_deed', 'emirates_id', 'tenancy_contract', ...genericDocumentTypes])('routes explicitly selected %s to an existing review panel with the exact original/proof', type => {
    render(<HenryDriveIntake source={source} />);
    fireEvent.change(screen.getByLabelText('Drive original category'), { target: { value: type } });
    expect(called).toHaveBeenLastCalledWith(genericDocumentTypes.includes(type) ? 'generic' : type, { importedSource: source });
  });
  it('unmounts the current review when the category is cleared', () => {
    render(<HenryDriveIntake source={source} />);
    fireEvent.change(screen.getByLabelText('Drive original category'), { target: { value: 'passport' } });
    expect(screen.getByText('Passport original review')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Drive original category'), { target: { value: '' } });
    expect(screen.queryByText('Passport original review')).not.toBeInTheDocument();
  });
});
