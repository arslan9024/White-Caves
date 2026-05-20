import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';

import { COLUMN_MAPPING, STATUS_MAPPING, parseExcelFile } from './excelImportService.js';

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
});
