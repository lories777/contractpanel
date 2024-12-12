import { NextRequest, NextResponse } from 'next/server';
import prisma from "../../../../../lib/prisma";
import { jsPDF } from 'jspdf';
import { Contract, ContractorData } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface ContractWithRelations extends Contract {
  contractorData: ContractorData | null;
  workScope: string;
}

interface TextOptions {
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  wordWrap?: boolean;
  maxWidth?: number;
}

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string | string[]> }
) {
  try {
    const id = context.params.id as string;
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: { contractorData: true },
    }) as ContractWithRelations | null;

    if (!contract || !contract.contractorData) {
      return NextResponse.json({ error: 'Contract or contractor data not found' }, { status: 404 });
    }

    // Create PDF document
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 6;
    
    // Get logo data
    const logoPath = path.join(process.cwd(), 'unnamed.png');
    const logoData = fs.readFileSync(logoPath);
    const logoBase64 = Buffer.from(logoData).toString('base64');
    
    // Get image dimensions
    const metadata = await sharp(logoData).metadata();
    const aspectRatio = metadata.width! / metadata.height!;
    
    // Set logo dimensions maintaining aspect ratio
    const logoHeight = 15;
    const logoWidth = logoHeight * aspectRatio;

    // Function to add logo to current page
    const addLogoToPage = () => {
      doc.addImage(logoBase64, 'PNG', margin, margin, logoWidth, logoHeight);
    };

    // Add logo to first page
    addLogoToPage();

    // Start content below logo
    let y = margin + logoHeight + 5;
    let currentPage = 1;

    // Helper to handle page overflow and add bold text
    const addTextWithOverflow = (text: string, y: number, options: TextOptions = {}) => {
      const maxY = pageHeight - 35;
      const maxWidth = options.maxWidth || pageWidth - margin * 2;
      const x = options.align === 'center' ? pageWidth / 2 : margin;

      if (options.bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      if (options.wordWrap) {
        const splitText = doc.splitTextToSize(text, maxWidth);
        for (let i = 0; i < splitText.length; i++) {
          if (y >= maxY) {
            doc.addPage();
            currentPage++;
            if (currentPage <= 2) {
              addLogoToPage();
            }
            y = currentPage <= 2 ? margin + logoHeight + 5 : margin;
          }
          doc.text(splitText[i], x, y, { align: options.align || 'left' });
          y += lineHeight;
        }
      } else {
        if (y >= maxY) {
          doc.addPage();
          currentPage++;
          if (currentPage <= 2) {
            addLogoToPage();
          }
          y = currentPage <= 2 ? margin + logoHeight + 5 : margin;
        }
        doc.text(text, x, y, { align: options.align || 'left' });
        y += lineHeight;
      }
      return y;
    };

    // Title
    doc.setFontSize(14);
    y = addTextWithOverflow('Contract', y, { align: 'center', bold: true });
    y += lineHeight;

    // Contract details
    doc.setFontSize(10);
    y = addTextWithOverflow(`Concluded on ${contract.contractDate} in ${contract.companyType === 'PC_Beskidy' ? 'Bukowno' : 'Paris'} between:`, y);
    y += lineHeight;

    // Company details
    const companyName = contract.companyType === 'PC_Beskidy' ? 'PC Beskidy' : 'Paris Cosmetics';
    y = addTextWithOverflow(companyName, y, { bold: true });
    y = addTextWithOverflow(`${contract.companyAddress}`, y);
    y = addTextWithOverflow(`NIP: ${contract.companyNIP}`, y);
    y = addTextWithOverflow('hereinafter referred to as the "Supplier",', y);
    y += lineHeight;

    // Contractor details
    y = addTextWithOverflow('and', y, { align: 'center', bold: true });
    y += lineHeight;

    const { fullName, address, birthPlace, birthDate, idNumber, bankAccount } = contract.contractorData;
    y = addTextWithOverflow(fullName, y, { bold: true });
    y = addTextWithOverflow(address, y);
    if (birthPlace && birthDate) y = addTextWithOverflow(`${birthPlace}, ${birthDate}`, y);
    if (idNumber) y = addTextWithOverflow(`ID: ${idNumber}`, y);
    y = addTextWithOverflow(`Bank Account: ${bankAccount}`, y);
    y += lineHeight;
    y = addTextWithOverflow('hereinafter referred to as the "Contractor".', y);
    y += lineHeight;

    // Section 1: Work description
    y = addTextWithOverflow('§ 1', y, {align: 'center', bold: true });
    y = addTextWithOverflow('1.  The Contractor accepts the execution of the Ordering Party\'s order consisting of creation of advertising material promoting Paris Perfume products:', y);

    const workScopeLines = contract.workScope.split('\n');
    workScopeLines.forEach(line => {
      if (line.trim()) {
        y = addTextWithOverflow(`- ${line.trim()}`, y);
      }
    });
    y = addTextWithOverflow('hereinafter referred to as the Work.', y);
    y += lineHeight;

    // Authorization text
    y = addTextWithOverflow('2.  The Contractor shall use his own materials and tools to complete the work.', y);
    y = addTextWithOverflow('3.  The Contractor, in exchange for the remuneration specified in § 4, shall authorize the use of the aforementioned materials for the promotion of the Ordering Party in the Ordering Party\'s social channels and promotional materials.', y, { wordWrap: true });
    y += lineHeight;

    // Section 2: Work timeline
    y = addTextWithOverflow('§ 2', y, {align: 'center', bold: true });
    y = addTextWithOverflow(`1.  The Contractor shall commence the work on ${contract.startDate}.`, y);
    y = addTextWithOverflow(`2.  The work shall be completed by ${contract.endDate}.`, y);
    y += lineHeight;

    // Section 3: Delegation clause
    y = addTextWithOverflow('§ 3', y, {align: 'center', bold: true });
    y = addTextWithOverflow('The Contractor may entrust the execution of the work to third parties only with the consent of the Principal expressed in writing.', y, { wordWrap: true });
    y += lineHeight;

    // Section 4: Remuneration
    y = addTextWithOverflow('§ 4', y, {align: 'center', bold: true });
    y = addTextWithOverflow('1.  For the performance of the work, the Contractor shall receive a lump sum remuneration in the amount of 450 euros net, in words: four hundred and fifty euros net, payable within 14 days from the date of completion of the work and its acceptance by the Contracting Authority.', y, { wordWrap: true });
    y += lineHeight;

    y = addTextWithOverflow('2.  The Contractor may not demand an increase in remuneration if he has performed additional work without the consent of the Contracting Authority.', y, { wordWrap: true });
    y = addTextWithOverflow('3.  If the parties have agreed on a lump sum remuneration, the Contractor may not demand an increase in remuneration, even if the size or cost of the entrusted work could not be foreseen at the time of the conclusion of the contract.', y, { wordWrap: true });
    y += lineHeight;

    // Section 5: Confidentiality
    y = addTextWithOverflow('§ 5', y, {align: 'center', bold: true });
    y = addTextWithOverflow('1.  The provisions of the Civil Code shall apply to matters not covered by this Agreement.', y);
    y = addTextWithOverflow('2.  The Parties agree that both the Ordering Party and the Executor are obliged to maintain the secrecy of all information relating to this Agreement.', y, { wordWrap: true });
    y += lineHeight;

    // Section 6: Final clause
    y = addTextWithOverflow('§ 6', y, {align: 'center', bold: true });
    y = addTextWithOverflow('The Agreement has been drawn up in two counterparts, one for each party.', y);
    y += lineHeight * 3;

    // Signatures
    const signatureY = pageHeight - 25;
    const dotsY = signatureY - 8;
    const textY = signatureY + 5;

    // Add dots for signatures
    doc.text('. . . . . . . . . . . . . . . . . . . . . . . .', margin, dotsY);
    doc.text('. . . . . . . . . . . . . . . . . . . . . . . .', pageWidth - margin * 4, dotsY);

    // Add signature labels
    doc.text('(Orderer)', margin, textY);
    doc.text('(Contractor)', pageWidth - margin * 4, textY);

    // Output PDF
    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
