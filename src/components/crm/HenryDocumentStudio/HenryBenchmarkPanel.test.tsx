import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HenryBenchmarkPanel } from './HenryBenchmarkPanel';
import { snapshotBenchmarkValues } from '../../../services/henryBenchmark';
import idScanner from '../../../services/HenryEmiratesIdScannerService';
import deedScanner from '../../../services/HenryTitleDeedScannerService';

it('requires consent, compares local labels without exposing values in aggregates, and clears them', () => {
  render(<HenryBenchmarkPanel scannerValues={Object.freeze({ idNumber: 'SYNTHETIC ID' })} diagnostics={{ fields: { idNumber: { source: 'text', state: 'extracted', values: ['SYNTHETIC ID'] } }, coverage: 1, warnings: [] }} />);
  expect(screen.getByRole('button', { name: 'Compare locally' })).toBeDisabled();
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label idNumber'));
  fireEvent.change(screen.getByLabelText('idNumber ground truth'), { target: { value: 'SYNTHETIC ID' } });
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  const report = screen.getByLabelText('Aggregate benchmark report');
  expect(report.textContent).toContain('"truePositive": 1');
  expect(report.textContent).not.toContain('SYNTHETIC ID');
  expect(report.textContent).toContain('uncalibrated');
  fireEvent.click(screen.getByRole('button', { name: 'Clear local labels' }));
  expect(screen.queryByLabelText('idNumber ground truth')).toBeNull();
  expect(screen.queryByLabelText('Aggregate benchmark report')).toBeNull();
});

it('clears ground truth when a new scan arrives and refuses corrected scanner evidence', () => {
  const diagnostics = { fields: { idNumber: { source: 'text' as const, state: 'extracted' as const, values: ['SYNTHETIC'] } }, coverage: 1, warnings: [] };
  const scannerValues = Object.freeze({ idNumber: 'SYNTHETIC' });
  const { rerender } = render(<HenryBenchmarkPanel diagnostics={diagnostics} scannerValues={scannerValues} />);
  fireEvent.click(screen.getByLabelText('Label idNumber'));
  fireEvent.change(screen.getByLabelText('idNumber ground truth'), { target: { value: 'SYNTHETIC' } });
  rerender(<HenryBenchmarkPanel diagnostics={{ ...diagnostics }} scannerValues={scannerValues} />);
  expect(screen.queryByLabelText('idNumber ground truth')).toBeNull();
  rerender(<HenryBenchmarkPanel scannerValues={scannerValues} diagnostics={{ ...diagnostics, fields: { idNumber: { ...diagnostics.fields.idNumber, source: 'review' } } }} />);
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label idNumber'));
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  expect(screen.getByRole('alert').textContent).toContain('Rescan');
  expect(screen.queryByLabelText('Aggregate benchmark report')).toBeNull();
});

it('compares actual ISO-normalized ID dates rather than raw text and snapshots before edits', () => {
  const data = idScanner.parseOcrText('Expiry Date: 2030-01-20\nFull Name: SYNTHETIC OWNER', '');
  const scannerValues = snapshotBenchmarkValues(data);
  expect(scannerValues.expiryDate).toBe('20/01/2030');
  expect(scannerValues.fullName).toBe(data.fullNameEn);
  data.expiryDate = '21/01/2030';
  expect(scannerValues.expiryDate).toBe('20/01/2030');
  expect(Object.isFrozen(scannerValues)).toBe(true);
  render(<HenryBenchmarkPanel diagnostics={data.diagnostics!} scannerValues={scannerValues} />);
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label expiryDate'));
  fireEvent.change(screen.getByLabelText('expiryDate ground truth'), { target: { value: '20/01/2030' } });
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  const report = JSON.parse(screen.getByLabelText('Aggregate benchmark report').textContent!);
  expect(report.fields.expiryDate.truePositive).toBe(1);
  expect(report.calibration).toBe('uncalibrated');
});

it('compares parser-derived sqm outputs, not conversion expressions', () => {
  const data = deedScanner.parseDocumentText('Certificate Number: 123/2026\nOwner Name: SYNTHETIC OWNER\nTotal Area SqFt: 1076.39104167');
  expect(data.diagnostics!.fields.totalAreaSqM!.state).toBe('derived');
  expect(data.totalAreaSqM).toBe(100);
  render(<HenryBenchmarkPanel diagnostics={data.diagnostics!} scannerValues={snapshotBenchmarkValues(data)} />);
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label totalAreaSqM'));
  fireEvent.change(screen.getByLabelText('totalAreaSqM ground truth'), { target: { value: '100' } });
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  const report = JSON.parse(screen.getByLabelText('Aggregate benchmark report').textContent!);
  expect(report.fields.totalAreaSqM.truePositive).toBe(1);
});

it('compares normalized source-native sqm values instead of formatted evidence', () => {
  const data = deedScanner.parseDocumentText('Certificate Number: 123/2026\nTotal Area: 1,200.50 sqm');
  expect(data.totalAreaSqM).toBe(1200.5);
  render(<HenryBenchmarkPanel diagnostics={data.diagnostics!} scannerValues={snapshotBenchmarkValues(data)} />);
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label totalAreaSqM'));
  fireEvent.change(screen.getByLabelText('totalAreaSqM ground truth'), { target: { value: '1200.5' } });
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  const report = JSON.parse(screen.getByLabelText('Aggregate benchmark report').textContent!);
  expect(report.fields.totalAreaSqM.truePositive).toBe(1);
});

it('does not score conflicting candidates as matches or claim calibration', () => {
  const data = deedScanner.parseDocumentText('Certificate Number: 123/2026\nCertificate Number: 456/2026');
  expect(data.diagnostics!.fields.certificateNumber!.state).toBe('conflict');
  render(<HenryBenchmarkPanel diagnostics={data.diagnostics!} scannerValues={snapshotBenchmarkValues(data)} />);
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label certificateNumber'));
  fireEvent.change(screen.getByLabelText('certificateNumber ground truth'), { target: { value: data.certificateNumber } });
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  const report = JSON.parse(screen.getByLabelText('Aggregate benchmark report').textContent!);
  expect(report.fields.certificateNumber.truePositive).toBe(0);
  expect(report.fields.certificateNumber.falseNegative).toBe(1);
  expect(report.calibration).toBe('uncalibrated');
});

it('fails closed when no pre-review snapshot is available', () => {
  render(<HenryBenchmarkPanel diagnostics={{ fields: { idNumber: { source: 'text', state: 'extracted', values: ['SYNTHETIC'] } }, coverage: 1, warnings: [] }} />);
  fireEvent.click(screen.getByLabelText(/I have permission/));
  fireEvent.click(screen.getByLabelText('Label idNumber'));
  fireEvent.click(screen.getByRole('button', { name: 'Compare locally' }));
  expect(screen.getByRole('alert').textContent).toContain('snapshot');
  expect(screen.queryByLabelText('Aggregate benchmark report')).toBeNull();
});
