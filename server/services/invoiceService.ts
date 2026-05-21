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

export const generateInvoice = async (propertyId: string, userId?: string) => {
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
};
