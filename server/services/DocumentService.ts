import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

export interface GeneratedFile {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

const PDF_MIME = 'application/pdf';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const CSV_MIME = 'text/csv; charset=utf-8';

function safeDate(value: Date | null | undefined): string {
  if (!value) return '—';
  return value.toISOString().slice(0, 10);
}

function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function buildCsvBuffer(headers: string[], rows: Array<Array<unknown>>): Buffer {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(','));
  }
  return Buffer.from(`\ufeff${lines.join('\r\n')}`, 'utf8');
}

export class DocumentService {
  async generateContractPdf(contractId: string): Promise<GeneratedFile> {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        contractNumber: true,
        title: true,
        type: true,
        status: true,
        value: true,
        currency: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    const lines = [
      `Contract Number: ${contract.contractNumber}`,
      `Title: ${contract.title}`,
      `Type: ${contract.type}`,
      `Status: ${contract.status}`,
      `Value: ${(contract.currency || 'AED')} ${contract.value ?? 0}`,
      `Start Date: ${safeDate(contract.startDate)}`,
      `End Date: ${safeDate(contract.endDate)}`,
      `Created At: ${safeDate(contract.createdAt)}`,
    ];

    const buffer = await this.renderSimplePdf('Contract Summary', lines);
    return {
      buffer,
      mimeType: PDF_MIME,
      filename: `contract-${contract.contractNumber || contract.id}.pdf`,
    };
  }

  async generateCommissionPdf(agentId: string): Promise<GeneratedFile> {
    const [agent, commissions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: agentId },
        select: { id: true, name: true, email: true },
      }),
      prisma.commission.findMany({
        where: { agentId },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          type: true,
          createdAt: true,
        },
      }),
    ]);

    if (!agent) {
      throw new Error('Agent not found');
    }

    const totalAmount = commissions.reduce((acc, item) => acc + (item.amount || 0), 0);
    const lines = [
      `Agent: ${agent.name || '—'} (${agent.email || '—'})`,
      `Records: ${commissions.length}`,
      `Total: AED ${totalAmount.toFixed(2)}`,
      '',
      ...commissions.map(
        c =>
          `${safeDate(c.createdAt)} | ${(c.type || '').toUpperCase()} | ${(c.status || '').toUpperCase()} | AED ${(c.amount || 0).toFixed(2)}`
      ),
    ];

    const buffer = await this.renderSimplePdf('Commission Summary', lines);
    return {
      buffer,
      mimeType: PDF_MIME,
      filename: `commission-${agent.id}.pdf`,
    };
  }

  async generateLeadsExcel(): Promise<GeneratedFile> {
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        source: true,
        budget: true,
        score: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    const exceljsModule = await import('exceljs').catch(() => null);
    if (!exceljsModule) {
      const rows = leads.map(lead => [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.status,
        lead.source,
        lead.budget,
        lead.score,
        safeDate(lead.createdAt),
      ]);

      return {
        buffer: buildCsvBuffer(
          ['ID', 'Name', 'Email', 'Phone', 'Status', 'Source', 'Budget', 'Score', 'Created At'],
          rows
        ),
        mimeType: CSV_MIME,
        filename: `leads-report-${new Date().toISOString().slice(0, 10)}.csv`,
      };
    }

    const ExcelJS = exceljsModule.default;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Leads');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 26 },
      { header: 'Name', key: 'name', width: 24 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Source', key: 'source', width: 14 },
      { header: 'Budget', key: 'budget', width: 14 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 16 },
    ];

    leads.forEach(lead =>
      sheet.addRow({
        ...lead,
        createdAt: safeDate(lead.createdAt),
      })
    );

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType: XLSX_MIME,
      filename: `leads-report-${new Date().toISOString().slice(0, 10)}.xlsx`,
    };
  }

  async generatePropertiesExcel(): Promise<GeneratedFile> {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        price: true,
        location: true,
        bedrooms: true,
        bathrooms: true,
        sqft: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    const exceljsModule = await import('exceljs').catch(() => null);
    if (!exceljsModule) {
      const rows = properties.map(property => [
        property.id,
        property.title,
        property.type,
        property.status,
        property.price,
        property.location,
        property.bedrooms,
        property.bathrooms,
        property.sqft,
        safeDate(property.createdAt),
      ]);

      return {
        buffer: buildCsvBuffer(
          ['ID', 'Title', 'Type', 'Status', 'Price', 'Location', 'Bedrooms', 'Bathrooms', 'Sqft', 'Created At'],
          rows
        ),
        mimeType: CSV_MIME,
        filename: `properties-report-${new Date().toISOString().slice(0, 10)}.csv`,
      };
    }

    const ExcelJS = exceljsModule.default;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Properties');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 26 },
      { header: 'Title', key: 'title', width: 28 },
      { header: 'Type', key: 'type', width: 14 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Price', key: 'price', width: 14 },
      { header: 'Location', key: 'location', width: 26 },
      { header: 'Bedrooms', key: 'bedrooms', width: 10 },
      { header: 'Bathrooms', key: 'bathrooms', width: 10 },
      { header: 'Sqft', key: 'sqft', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 16 },
    ];

    properties.forEach(property =>
      sheet.addRow({
        ...property,
        createdAt: safeDate(property.createdAt),
      })
    );

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType: XLSX_MIME,
      filename: `properties-report-${new Date().toISOString().slice(0, 10)}.xlsx`,
    };
  }

  async generateMonthlyPLReport(): Promise<GeneratedFile> {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;

    // Current month bounds
    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const [rentIncome, commissionIncome, transactions] = await Promise.all([
      prisma.invoice.aggregate({
        where: {
          status: { in: ['paid', 'settled'] },
          notes: { contains: 'TYPE:rent' },
          dueDate: { gte: monthStart, lte: monthEnd },
        },
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      prisma.commission.aggregate({
        where: {
          status: 'paid',
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.transaction.findMany({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
        select: {
          id: true,
          type: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
        take: 2000,
      }),
    ]);

    const rentTotal = Number(rentIncome._sum.totalAmount ?? 0);
    const commissionTotal = Number(commissionIncome._sum.amount ?? 0);
    const grossIncome = rentTotal + commissionTotal;

    const exceljsModule = await import('exceljs').catch(() => null);
    if (!exceljsModule) {
      const rows = [
        ['Rent Income', rentTotal, rentIncome._count._all],
        ['Commission Income', commissionTotal, commissionIncome._count._all],
        ['Total Gross Income', grossIncome, ''],
      ];

      return {
        buffer: buildCsvBuffer(['Category', 'Amount (AED)', 'Count'], rows),
        mimeType: CSV_MIME,
        filename: `pl-report-${year}-${String(month).padStart(2, '0')}.csv`,
      };
    }

    const ExcelJS = exceljsModule.default;
    const workbook = new ExcelJS.Workbook();

    // ─── Summary sheet ───
    const summarySheet = workbook.addWorksheet('P&L Summary');
    summarySheet.columns = [
      { header: 'Category', key: 'category', width: 30 },
      { header: 'Amount (AED)', key: 'amount', width: 18 },
      { header: 'Count', key: 'count', width: 12 },
    ];

    summarySheet.addRow({ category: 'Rent Income', amount: rentTotal, count: rentIncome._count._all });
    summarySheet.addRow({ category: 'Commission Income', amount: commissionTotal, count: commissionIncome._count._all });
    summarySheet.addRow({ category: 'Total Gross Income', amount: grossIncome, count: '' });

    // Style the header row
    const headerRow = summarySheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC9A84C' } };

    // ─── Transactions sheet ───
    const txSheet = workbook.addWorksheet('Transactions');
    txSheet.columns = [
      { header: 'ID', key: 'id', width: 26 },
      { header: 'Type', key: 'type', width: 16 },
      { header: 'Amount', key: 'amount', width: 14 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Date', key: 'createdAt', width: 16 },
    ];

    transactions.forEach(tx =>
      txSheet.addRow({
        ...tx,
        createdAt: safeDate(tx.createdAt),
      })
    );

    const txHeader = txSheet.getRow(1);
    txHeader.font = { bold: true };
    txHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC9A84C' } };

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const periodLabel = `${year}-${String(month).padStart(2, '0')}`;
    logger.info('[DocumentService] generated monthly P&L report', { period: periodLabel, grossIncome });
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType: XLSX_MIME,
      filename: `pl-report-${periodLabel}.xlsx`,
    };
  }

  private async renderSimplePdf(title: string, lines: string[]): Promise<Buffer> {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    page.drawText(title, {
      x: 50,
      y: 800,
      size: 20,
      font: titleFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    let y = 770;
    for (const line of lines) {
      if (y < 60) break;
      page.drawText(line, {
        x: 50,
        y,
        size: 11,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= 18;
    }

    const bytes = await pdf.save();
    logger.info('[DocumentService] generated PDF', { title, lines: lines.length });
    return Buffer.from(bytes);
  }
}

export const documentService = new DocumentService();

