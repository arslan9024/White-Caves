/* eslint-disable @typescript-eslint/no-explicit-any, security/detect-non-literal-fs-filename */
import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../public/uploads');

export const generateTaxInvoice = async (
  clientId: string,
  dealId: string | undefined,
  propertyTitle: string | undefined,
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; transactionType?: string }>,
  userId?: string
) => {
  try {
    const { VATService } = await import('./vatService.js');
    
    let baseAmount = 0;
    let vatAmount = 0;
    
    lineItems.forEach(item => {
      const itemBase = item.quantity * item.unitPrice;
      baseAmount += itemBase;
      const type = item.transactionType ? VATService.getTransactionType(item.transactionType) : VATService.getTransactionType('sale');
      const vatResult = VATService.calculateVAT(type, itemBase);
      vatAmount += vatResult.vatAmount;
    });

    const totalAmount = baseAmount + vatAmount;
    const vatRate = baseAmount > 0 ? (vatAmount / baseAmount) * 100 : 0;
    
    const dateObj = new Date();
    const invoiceNumber = `INV-${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}${dateObj.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`;
    
    // Create DB record
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        type: 'tax_invoice',
        client: clientId, // store ID in client field for legacy support
        clientId,
        dealId,
        property: propertyTitle,
        amount: baseAmount,
        vatRate,
        vatAmount,
        totalAmount,
        status: 'draft',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdById: userId,
        invoiceLineItems: {
          create: lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice
          }))
        }
      }
    });

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const fileName = `invoice_${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // PDF Content
      doc.fontSize(22).font('Helvetica-Bold').text('White Caves Real Estate', { align: 'right' });
      doc.fontSize(10).font('Helvetica').text('Dubai, UAE', { align: 'right' });
      doc.text('TRN: 100012345678903', { align: 'right' });
      doc.moveDown(2);

      doc.fontSize(20).text('TAX INVOICE', { align: 'left' });
      doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Date: ${dateObj.toLocaleDateString()}`);
      if (propertyTitle) doc.text(`Property: ${propertyTitle}`);
      doc.moveDown(2);

      // Line Items Header
      doc.font('Helvetica-Bold');
      doc.text('Description', 50, doc.y, { continued: true, width: 250 });
      doc.text('Qty', 300, doc.y, { continued: true, width: 50 });
      doc.text('Unit Price', 350, doc.y, { continued: true, width: 100 });
      doc.text('Total (AED)', 450, doc.y);
      doc.moveDown(0.5);
      doc.font('Helvetica');

      lineItems.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        doc.text(item.description, 50, doc.y, { continued: true, width: 250 });
        doc.text(item.quantity.toString(), 300, doc.y, { continued: true, width: 50 });
        doc.text(item.unitPrice.toLocaleString(), 350, doc.y, { continued: true, width: 100 });
        doc.text(itemTotal.toLocaleString(), 450, doc.y);
        doc.moveDown(0.5);
      });

      doc.moveDown(2);
      doc.text(`Net Amount: AED ${baseAmount.toLocaleString()}`, { align: 'right' });
      doc.text(`VAT Amount: AED ${vatAmount.toLocaleString()}`, { align: 'right' });
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(14).text(`TOTAL DUE: AED ${totalAmount.toLocaleString()}`, { align: 'right' });

      doc.end();

      stream.on('finish', async () => {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { pdfUrl: `/uploads/${fileName}` }
        });
        
        await prisma.activity.create({
          data: {
            type: 'system',
            action: 'created',
            description: `Tax Invoice ${invoice.invoiceNumber} generated`,
            userId: userId || null,
            metadata: { fileUrl: `/uploads/${fileName}`, invoiceId: invoice.id },
          },
        });

        resolve({ ...invoice, pdfUrl: `/uploads/${fileName}` });
      });

      stream.on('error', reject);
    });
  } catch (error) {
    logger.error('Failed to generate tax invoice', error);
    throw error;
  }
};
/* eslint-disable no-redeclare */
export function generateInvoice(
  propertyId: string,
  userId?: string
): Promise<any>;
export function generateInvoice(
  clientId: string,
  dealId: string | undefined,
  propertyTitle: string | undefined,
  lineItems: Array<{ description: string; quantity: number; unitPrice: number; transactionType?: string }>,
  userId?: string
): Promise<any>;
export async function generateInvoice(
  first: string,
  second?: unknown,
  third?: string,
  fourth?: Array<{ description: string; quantity: number; unitPrice: number; transactionType?: string }>,
  fifth?: string
): Promise<unknown> {
  // If fourth is not provided, this is the legacy call (propertyId, userId)
  if (fourth === undefined) {
    const propertyId = first;
    const userId = second;
    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
      });

      if (!property) throw new Error('Property not found');

      logger.info(`Generating Invoice for property ${property.unitNumber || property.title}`);

      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const fileName = `invoice_${invoiceNumber}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // PDF Content
        doc.fontSize(22).font('Helvetica-Bold').text('White Caves Real Estate', { align: 'right' });
        doc.fontSize(10).font('Helvetica').text('Dubai, UAE', { align: 'right' });
        doc.moveDown(2);

        doc.fontSize(20).text('TAX INVOICE', { align: 'left' });
        doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown(2);

        doc.text(`Property: ${property.title} (${property.unitNumber || 'TBD'})`);
        doc.text(`Location: ${property.location}`);
        doc.moveDown();

        const rent = property.rentalPrice || 0;
        const commissionRate = property.commissionPercent || 5;
        const commission = rent * (commissionRate / 100);
        const vat = commission * 0.05; // 5% VAT in UAE
        const total = commission + vat;

        doc.text(`Annual Rent: AED ${rent.toLocaleString()}`);
        doc.text(`Agency Commission (${commissionRate}%): AED ${commission.toLocaleString()}`);
        doc.text(`VAT (5%): AED ${vat.toLocaleString()}`);
        doc.moveDown();
        doc.font('Helvetica-Bold').text(`TOTAL DUE: AED ${total.toLocaleString()}`);

        doc.end();

        stream.on('finish', async () => {
          // Record Activity
          await prisma.activity.create({
            data: {
              type: 'system',
              action: 'created',
              description: `Tax Invoice ${invoiceNumber} generated for commission on ${property.unitNumber || property.title}`,
              userId: userId || null,
              metadata: { fileUrl: `/uploads/${fileName}` },
            },
          });

          // Save to property documents
          await prisma.property.update({
            where: { id: property.id },
            data: { documents: { push: `/uploads/${fileName}` } },
          } as any);

          resolve(true);
        });

        stream.on('error', reject);
      });
    } catch (error) {
      logger.error('Failed to generate invoice', error);
      return false;
    }
  }

  // Otherwise, it is the new call (clientId, dealId, propertyTitle, lineItems, userId)
  return generateTaxInvoice(first, second, third, fourth, fifth);
}

