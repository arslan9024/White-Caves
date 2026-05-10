import { prisma } from '../database.js';
import logger from '../utils/logger.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../public/uploads');

export const generateDraftContract = async (propertyId: string, userId?: string) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      throw new Error('Property not found for contract generation');
    }

    logger.info(`Generating PDF Tenancy Contract for property ${property.unitNumber || property.title}`);

    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `contract_${property.id}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // PDF Content (Simulated by @Victoria)
      doc.fontSize(20).font('Helvetica-Bold').text('White Caves Real Estate', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('TENANCY CONTRACT DRAFT', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).font('Helvetica');
      doc.text(`Property Name: ${property.title}`);
      doc.text(`Unit Number: ${property.unitNumber || 'TBD'}`);
      doc.text(`Location: ${property.location}`);
      doc.text(`Rental Price: AED ${property.rentalPrice?.toLocaleString() || 'TBD'} / year`);
      doc.moveDown();
      
      doc.text('This document represents a formal agreement between the Landlord and Tenant, mediated by White Caves Real Estate.');
      doc.moveDown(4);

      doc.text('_____________________________', { align: 'left' });
      doc.text('Tenant Signature', { align: 'left' });

      doc.end();

      stream.on('finish', async () => {
        // Record the contract in DB (using Activity for now, but usually a Contract model)
        await prisma.activity.create({
          data: {
            type: 'system',
            action: 'created',
            description: `Draft Tenancy Contract PDF generated for ${property.unitNumber || property.title}`,
            userId: userId || null,
            metadata: { fileUrl: `/uploads/${fileName}` }
          }
        });
        
        // Also update the property to store the contract URL
        await prisma.property.update({
          where: { id: property.id },
          data: {
            documents: {
              push: `/uploads/${fileName}`
            }
          }
        });

        resolve(true);
      });

      stream.on('error', (err) => {
        logger.error('Error writing PDF', err);
        reject(err);
      });
    });
  } catch (error) {
    logger.error('Failed to generate draft contract', error);
    return false;
  }
};
