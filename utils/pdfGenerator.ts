// @ts-nocheck
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { EbookData } from '@/lib/ebookContent';

export async function generateEbookPdfBlob(ebook: EbookData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const sanitize = (str: string) => {
    return str
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\u2026]/g, '...')
      .replace(/[\u2022]/g, '-')
      .replace(/[^\x20-\x7E\r\n]/g, ' ');
  };

  const addHeaderFooter = (page: any, pageNum: number, total: number, title: string) => {
    const { width, height } = page.getSize();
    page.drawLine({
      start: { x: 50, y: height - 40 },
      end: { x: width - 50, y: height - 40 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    page.drawText(sanitize(title), {
      x: 50,
      y: height - 32,
      size: 8.5,
      font: fontHelvetica,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawLine({
      start: { x: 50, y: 40 },
      end: { x: width - 50, y: 40 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
    page.drawText(`JaysMoneyGuides · ${sanitize(ebook.title)} — Page ${pageNum} of ${total}`, {
      x: 50,
      y: 28,
      size: 8,
      font: fontHelvetica,
      color: rgb(0.5, 0.5, 0.5),
    });
  };

  const drawWrappedText = (
    page: any,
    rawText: string,
    x: number,
    startY: number,
    maxWidth: number,
    fontSize: number,
    font: any,
    color = rgb(0.1, 0.1, 0.1),
    lineHeight = fontSize * 1.4
  ): number => {
    const clean = sanitize(rawText);
    const lines = clean.split('\n');
    let currentY = startY;

    for (const rawLine of lines) {
      const words = rawLine.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width < maxWidth) {
          currentLine = testLine;
        } else {
          page.drawText(currentLine, { x, y: currentY, size: fontSize, font, color });
          currentY -= lineHeight;
          currentLine = word;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, { x, y: currentY, size: fontSize, font, color });
        currentY -= lineHeight;
      }
    }
    return currentY;
  };

  // Build each page from ebook structured pages
  const totalPages = ebook.pages.length;

  for (const p of ebook.pages) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    if (p.type === 'cover') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.04, 0.12, 0.16),
      });

      page.drawRectangle({
        x: 35,
        y: 35,
        width: width - 70,
        height: height - 70,
        borderColor: rgb(0.2, 0.7, 0.5),
        borderWidth: 1.5,
      });

      page.drawText('JAYSMONEYGUIDES PRESENTS', {
        x: 60,
        y: height - 90,
        size: 11,
        font: fontHelveticaBold,
        color: rgb(0.2, 0.8, 0.6),
      });

      page.drawText(sanitize(ebook.title), {
        x: 60,
        y: height - 145,
        size: 26,
        font: fontHelveticaBold,
        color: rgb(1, 1, 1),
      });

      page.drawText(sanitize(ebook.subtitle), {
        x: 60,
        y: height - 185,
        size: 12,
        font: fontHelvetica,
        color: rgb(0.85, 0.9, 0.95),
      });

      let yPos = height - 240;
      yPos = drawWrappedText(
        page,
        'A practical, battle-tested handbook for starting and scaling an affiliate business without hype, spam, or expensive courses.',
        60,
        yPos,
        475,
        12,
        fontHelveticaOblique,
        rgb(0.75, 0.85, 0.9),
        18
      );

      page.drawText(sanitize(`Written & Verified by ${ebook.author}`), {
        x: 60,
        y: 95,
        size: 12,
        font: fontHelveticaBold,
        color: rgb(1, 1, 1),
      });

      page.drawText(`JaysMoneyGuides · Published ${ebook.date}`, {
        x: 60,
        y: 75,
        size: 9.5,
        font: fontHelvetica,
        color: rgb(0.65, 0.75, 0.8),
      });
    } else if (p.type === 'backCover') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.04, 0.12, 0.16),
      });

      page.drawText('THANK YOU FOR READING', {
        x: 50,
        y: height - 200,
        size: 22,
        font: fontHelveticaBold,
        color: rgb(1, 1, 1),
      });

      page.drawText('JaysMoneyGuides · Real Playbooks, No Hype', {
        x: 50,
        y: height - 235,
        size: 13,
        font: fontHelveticaBold,
        color: rgb(0.2, 0.8, 0.55),
      });

      drawWrappedText(
        page,
        "Got questions or want to share your progress? Send an email to jay@jaysmoneyguides.com.\n\nKeep building, stay consistent, and remember: content compounds.",
        50,
        height - 280,
        495,
        11,
        fontHelvetica,
        rgb(0.85, 0.85, 0.85),
        17
      );
    } else {
      addHeaderFooter(page, p.pageNumber, totalPages, p.chapterTitle || ebook.title);
      let yPos = height - 80;

      if (p.sectionTitle) {
        page.drawText(sanitize(p.sectionTitle), {
          x: 50,
          y: yPos,
          size: 15,
          font: fontHelveticaBold,
          color: rgb(0.05, 0.4, 0.25),
        });
        yPos -= 26;
      }

      if (p.paragraphs) {
        for (const para of p.paragraphs) {
          yPos = drawWrappedText(page, para, 50, yPos, 495, 9.5, fontHelvetica, rgb(0.18, 0.18, 0.18), 14);
          yPos -= 8;
        }
      }

      if (p.bulletPoints) {
        if (p.bulletPoints.title) {
          page.drawText(sanitize(p.bulletPoints.title), {
            x: 50,
            y: yPos,
            size: 10.5,
            font: fontHelveticaBold,
            color: rgb(0.1, 0.1, 0.1),
          });
          yPos -= 15;
        }
        for (const item of p.bulletPoints.items) {
          yPos = drawWrappedText(page, `• ${item}`, 50, yPos, 495, 9, fontHelvetica, rgb(0.2, 0.2, 0.2), 13);
          yPos -= 3;
        }
        yPos -= 6;
      }

      if (p.table) {
        yPos -= 6;
        const col1Width = p.table.headers.length > 2 ? 140 : 160;
        
        // Header
        page.drawRectangle({
          x: 50,
          y: yPos - 12,
          width: 495,
          height: 22,
          color: rgb(0.08, 0.35, 0.22),
        });
        page.drawText(sanitize(p.table.headers[0]), {
          x: 58,
          y: yPos - 3,
          size: 8.5,
          font: fontHelveticaBold,
          color: rgb(1, 1, 1),
        });
        page.drawText(sanitize(p.table.headers[1]), {
          x: 50 + col1Width + 10,
          y: yPos - 3,
          size: 8.5,
          font: fontHelveticaBold,
          color: rgb(1, 1, 1),
        });
        if (p.table.headers[2]) {
          page.drawText(sanitize(p.table.headers[2]), {
            x: 50 + col1Width + 160,
            y: yPos - 3,
            size: 8.5,
            font: fontHelveticaBold,
            color: rgb(1, 1, 1),
          });
        }
        yPos -= 26;

        for (let r = 0; r < p.table.rows.length; r++) {
          const row = p.table.rows[r];
          page.drawRectangle({
            x: 50,
            y: yPos - 10,
            width: 495,
            height: 22,
            color: r % 2 === 0 ? rgb(0.96, 0.97, 0.98) : rgb(1, 1, 1),
            borderColor: rgb(0.85, 0.88, 0.9),
            borderWidth: 0.5,
          });
          page.drawText(sanitize(row[0] || ''), {
            x: 58,
            y: yPos - 2,
            size: 8,
            font: fontHelveticaBold,
            color: rgb(0.05, 0.4, 0.25),
          });
          page.drawText(sanitize(row[1] || ''), {
            x: 50 + col1Width + 10,
            y: yPos - 2,
            size: 7.8,
            font: fontHelvetica,
            color: rgb(0.2, 0.2, 0.2),
          });
          if (row[2]) {
            page.drawText(sanitize(row[2] || ''), {
              x: 50 + col1Width + 160,
              y: yPos - 2,
              size: 7.8,
              font: fontHelvetica,
              color: rgb(0.25, 0.25, 0.25),
            });
          }
          yPos -= 24;
        }
        yPos -= 8;
      }

      if (p.callout) {
        yPos -= 8;
        page.drawRectangle({
          x: 50,
          y: yPos - 50,
          width: 495,
          height: 60,
          color: rgb(0.98, 0.95, 0.9),
          borderColor: rgb(0.9, 0.7, 0.3),
          borderWidth: 1,
        });
        page.drawText(sanitize(p.callout.title), {
          x: 65,
          y: yPos - 8,
          size: 10.5,
          font: fontHelveticaBold,
          color: rgb(0.6, 0.35, 0.05),
        });
        drawWrappedText(
          page,
          p.callout.text,
          65,
          yPos - 22,
          465,
          8.5,
          fontHelveticaOblique,
          rgb(0.25, 0.15, 0.05),
          12
        );
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
