import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  COLUMN_MAPPING,
  STATUS_MAPPING,
  getAllSheetData,
  parseExcelFile,
} from './excelImportService.js';

const tempFiles = [];

afterEach(() => {
  for (const filePath of tempFiles.splice(0)) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

describe('excelImportService', () => {
  it('exports expected archived column and status mappings', () => {
    expect(COLUMN_MAPPING['P-NUMBER']).toBe('pNumber');
    expect(COLUMN_MAPPING['AREA']).toBe('area');
    expect(COLUMN_MAPPING['Building']).toBe('building');
    expect(COLUMN_MAPPING['Unit Number']).toBe('unitNumber');
    expect(COLUMN_MAPPING['Layout']).toBe('layout');
    expect(COLUMN_MAPPING['NAME']).toBe('ownerName');
    expect(COLUMN_MAPPING['PHONE']).toBe('phone');
    expect(COLUMN_MAPPING['EMAIL']).toBe('email');
    expect(COLUMN_MAPPING['MOBILE']).toBe('mobile');
    expect(COLUMN_MAPPING['Asking Price']).toBe('askingPrice');
    expect(COLUMN_MAPPING['Floor']).toBe('floor');
    expect(COLUMN_MAPPING['Rooms']).toBe('rooms');

    expect(STATUS_MAPPING.RENTED).toBe('rented');
    expect(STATUS_MAPPING.Rented).toBe('rented');
    expect(STATUS_MAPPING.AVAILABLE).toBe('available');
    expect(STATUS_MAPPING.Vacant).toBe('available');
    expect(STATUS_MAPPING.SOLD).toBe('sold');
    expect(STATUS_MAPPING.RESERVED).toBe('reserved');
    expect(STATUS_MAPPING.OCCUPIED).toBe('rented');
  });

  it('parses csv files into normalized preview/data payloads', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(
      csvPath,
      [
        'P-NUMBER,AREA,NAME,EMAIL,Asking Price,STATUS',
        'P-100,JVC,Alice,alice@example.com,2500000,AVAILABLE',
      ].join('\n'),
      'utf8'
    );

    const result = await parseExcelFile(csvPath, { previewLimit: 1 });

    expect(result.totalRows).toBe(1);
    expect(result.headers).toEqual(['P-NUMBER', 'AREA', 'NAME', 'EMAIL', 'Asking Price', 'STATUS']);
    expect(result.preview).toHaveLength(1);
    expect(result.data[0]).toEqual(
      expect.objectContaining({
        pNumber: 'P-100',
        area: 'JVC',
        ownerName: 'Alice',
        email: 'alice@example.com',
        askingPrice: '2500000',
        status: 'available',
      })
    );
    expect(result.columnMapping).toEqual(
      expect.objectContaining({
        pNumber: 'pNumber',
        area: 'area',
        ownerName: 'ownerName',
      })
    );
  });

  it('normalizes status values with mixed casing and extra spaces', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-status-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(
      csvPath,
      ['P-NUMBER,AREA,NAME,STATUS', 'P-200,Business Bay,Nora, occupied '].join('\n'),
      'utf8'
    );

    const result = await parseExcelFile(csvPath, { previewLimit: 5 });

    expect(result.data[0]).toEqual(
      expect.objectContaining({
        pNumber: 'P-200',
        area: 'Business Bay',
        ownerName: 'Nora',
        status: 'rented',
      })
    );
  });

  it('falls back to default previewLimit when invalid values are provided', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-preview-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(
      csvPath,
      ['P-NUMBER,AREA,NAME', 'P-1,JVC,Alice', 'P-2,JLT,Bob', 'P-3,DIFC,Carla'].join('\n'),
      'utf8'
    );

    const result = await parseExcelFile(csvPath, { previewLimit: 0 });

    expect(result.totalRows).toBe(3);
    expect(result.preview).toHaveLength(3);
  });

  it('builds columnMapping from headers even when file has no data rows', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-headers-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(csvPath, 'P-NUMBER,AREA,NAME,STATUS\n', 'utf8');

    const result = await parseExcelFile(csvPath, { previewLimit: 5 });

    expect(result.totalRows).toBe(0);
    expect(result.columnMapping).toEqual(
      expect.objectContaining({
        pNumber: 'pNumber',
        area: 'area',
        ownerName: 'ownerName',
        status: 'status',
      })
    );
  });

  it('throws explicit error when requested sheetName is not present', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-sheet-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(csvPath, 'P-NUMBER,AREA,NAME\nP-1,JVC,Alice\n', 'utf8');

    await expect(parseExcelFile(csvPath, { sheetName: 'MissingSheet' })).rejects.toThrow(
      'Worksheet not found: MissingSheet'
    );
  });

  it('rejects invalid non-string sheetName option', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-sheet-type-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(csvPath, 'P-NUMBER,AREA,NAME\nP-1,JVC,Alice\n', 'utf8');

    await expect(parseExcelFile(csvPath, { sheetName: 123 })).rejects.toThrow(
      'Invalid sheetName option: expected a string'
    );
  });

  it('getAllSheetData throws when import file does not exist', async () => {
    const missingPath = path.join(os.tmpdir(), `white-caves-missing-${Date.now()}.xlsx`);

    await expect(getAllSheetData(missingPath)).rejects.toThrow('Import file not found');
  });

  it('caps preview length at 1000 rows when previewLimit is too large', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-import-large-preview-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    const rows = ['P-NUMBER,AREA,NAME'];
    for (let i = 1; i <= 1105; i++) {
      rows.push(`P-${i},JVC,Owner-${i}`);
    }

    fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');

    const result = await parseExcelFile(csvPath, { previewLimit: 5000 });

    expect(result.totalRows).toBe(1105);
    expect(result.preview).toHaveLength(1000);
  });

  it('maps dashed and underscored headers through normalization rules', async () => {
    const csvPath = path.join(
      os.tmpdir(),
      `white-caves-import-normalized-headers-${Date.now()}.csv`
    );
    tempFiles.push(csvPath);

    fs.writeFileSync(
      csvPath,
      ['P_NUMBER,AREA,OWNER-NAME,STATUS', 'P-777,DIFC,Noura,Vacant'].join('\n'),
      'utf8'
    );

    const result = await parseExcelFile(csvPath, { previewLimit: 5 });

    expect(result.data[0]).toEqual(
      expect.objectContaining({
        pNumber: 'P-777',
        area: 'DIFC',
        ownerName: 'Noura',
        status: 'available',
      })
    );
  });

  it('getAllSheetData returns parsed rows for csv files', async () => {
    const csvPath = path.join(os.tmpdir(), `white-caves-all-sheets-${Date.now()}.csv`);
    tempFiles.push(csvPath);

    fs.writeFileSync(csvPath, ['P-NUMBER,AREA,NAME', 'P-1,JVC,Alice'].join('\n'), 'utf8');

    const sheets = await getAllSheetData(csvPath);

    expect(sheets).toHaveLength(1);
    expect(sheets[0].sheetName).toBeTruthy();
    expect(sheets[0].rows).toEqual([
      {
        'P-NUMBER': 'P-1',
        AREA: 'JVC',
        NAME: 'Alice',
      },
    ]);
  });
});
