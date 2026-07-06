import ExcelJS from 'exceljs';

export async function findDataFromSheet(ClusterName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(`./data/${ClusterName}.xlsx`);
  const sheet = workbook.getWorksheet('Sheet1') || workbook.worksheets[0];
  if (!sheet) return [];

  const headers = [];
  sheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value ?? '').trim();
  });

  const rows = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const item = {};
    let hasValue = false;
    headers.forEach((header, index) => {
      if (!header) return;
      const value = row.getCell(index + 1).value;
      const normalized = value === null || value === undefined ? '' : String(value);
      item[header] = normalized;
      if (normalized !== '') hasValue = true;
    });
    if (hasValue) rows.push(item);
  }

  return rows;
}