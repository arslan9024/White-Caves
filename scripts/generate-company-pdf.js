import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateCompanyProfilePDF() {
  const pdfDoc = await PDFDocument.create();
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const primaryColor = rgb(196/255, 30/255, 58/255);
  const textColor = rgb(26/255, 26/255, 46/255);
  const grayColor = rgb(107/255, 114/255, 128/255);
  
  const page1 = pdfDoc.addPage([595, 842]);
  const { width, height } = page1.getSize();
  
  page1.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: primaryColor,
  });
  
  page1.drawText('WHITE CAVES', {
    x: 50,
    y: height - 60,
    size: 36,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  page1.drawText('REAL ESTATE LLC', {
    x: 50,
    y: height - 90,
    size: 18,
    font: helvetica,
    color: rgb(1, 1, 1),
  });
  
  page1.drawText("Dubai's Premier Luxury Property Partner", {
    x: 50,
    y: height - 110,
    size: 12,
    font: helvetica,
    color: rgb(1, 1, 1, 0.9),
  });
  
  let yPos = height - 170;
  
  page1.drawText('COMPANY PROFILE', {
    x: 50,
    y: yPos,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  
  yPos -= 40;
  
  page1.drawText('WHO WE ARE', {
    x: 50,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });
  
  yPos -= 20;
  
  const aboutText = [
    'White Caves Real Estate is a leading Dubai-based real estate agency',
    'specializing in luxury residential and commercial properties across the',
    'UAE. With over 15 years of experience, we have built a reputation for',
    'excellence, integrity, and exceptional client service.',
  ];
  
  for (const line of aboutText) {
    page1.drawText(line, {
      x: 50,
      y: yPos,
      size: 11,
      font: helvetica,
      color: grayColor,
    });
    yPos -= 16;
  }
  
  yPos -= 20;
  
  page1.drawText('OUR MISSION', {
    x: 50,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });
  
  yPos -= 20;
  
  const missionText = [
    'To provide unparalleled real estate services that exceed expectations,',
    'connecting discerning clients with their dream properties while ensuring',
    'transparent, efficient, and personalized transactions.',
  ];
  
  for (const line of missionText) {
    page1.drawText(line, {
      x: 50,
      y: yPos,
      size: 11,
      font: helvetica,
      color: grayColor,
    });
    yPos -= 16;
  }
  
  yPos -= 20;
  
  page1.drawText('OUR VISION', {
    x: 50,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });
  
  yPos -= 20;
  
  const visionText = [
    'To be the most trusted and innovative real estate company in the UAE,',
    'setting industry standards for customer satisfaction, technological',
    'advancement, and sustainable business practices.',
  ];
  
  for (const line of visionText) {
    page1.drawText(line, {
      x: 50,
      y: yPos,
      size: 11,
      font: helvetica,
      color: grayColor,
    });
    yPos -= 16;
  }
  
  yPos -= 30;
  
  page1.drawText('OUR SERVICES', {
    x: 50,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });
  
  yPos -= 25;
  
  const services = [
    ['Property Sales & Purchases', 'Residential Rentals'],
    ['Off-Plan Investments', 'Commercial Properties'],
    ['Property Management', 'Investment Advisory'],
    ['Holiday Homes', 'Market Analysis'],
  ];
  
  for (const row of services) {
    page1.drawText(`• ${row[0]}`, {
      x: 60,
      y: yPos,
      size: 11,
      font: helvetica,
      color: grayColor,
    });
    page1.drawText(`• ${row[1]}`, {
      x: 310,
      y: yPos,
      size: 11,
      font: helvetica,
      color: grayColor,
    });
    yPos -= 18;
  }
  
  yPos -= 30;
  
  page1.drawRectangle({
    x: 40,
    y: yPos - 60,
    width: width - 80,
    height: 70,
    color: rgb(248/255, 249/255, 250/255),
    borderColor: primaryColor,
    borderWidth: 1,
  });
  
  const stats = [
    { value: '500+', label: 'Properties' },
    { value: '1000+', label: 'Clients' },
    { value: '15+', label: 'Years' },
    { value: '50+', label: 'Agents' },
  ];
  
  const statWidth = (width - 80) / 4;
  stats.forEach((stat, i) => {
    const x = 40 + statWidth * i + statWidth / 2;
    page1.drawText(stat.value, {
      x: x - 25,
      y: yPos - 25,
      size: 20,
      font: helveticaBold,
      color: primaryColor,
    });
    page1.drawText(stat.label, {
      x: x - 25,
      y: yPos - 45,
      size: 10,
      font: helvetica,
      color: grayColor,
    });
  });
  
  yPos -= 100;
  
  page1.drawText('CONTACT INFORMATION', {
    x: 50,
    y: yPos,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });
  
  yPos -= 25;
  
  const contactInfo = [
    'Head Office: Office D-72, El-Shaye-4, Port Saeed, Deira, Dubai, UAE',
    'Phone: +971-56-361-6136',
    'WhatsApp: +971-56-361-6136',
    'Email: admin@whitecaves.com',
    'Website: www.whitecaves.com',
  ];
  
  for (const line of contactInfo) {
    page1.drawText(line, {
      x: 50,
      y: yPos,
      size: 11,
      font: helvetica,
      color: grayColor,
    });
    yPos -= 18;
  }
  
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 40,
    color: primaryColor,
  });
  
  page1.drawText('RERA Licensed | Dubai Land Department Registered', {
    x: width / 2 - 140,
    y: 15,
    size: 10,
    font: helvetica,
    color: rgb(1, 1, 1),
  });
  
  const pdfBytes = await pdfDoc.save();
  
  const outputPath = path.join(process.cwd(), 'public', 'White-Caves-Company-Profile.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  
  console.log('Company Profile PDF generated successfully at:', outputPath);
}

generateCompanyProfilePDF().catch(console.error);
