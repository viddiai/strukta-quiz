import jsPDF from 'jspdf';
import type { SectionScore } from '@/core/types';
import type { AnalysisResult } from '@/core/ai';

interface PDFData {
  totalScore: number;
  sectionScores: SectionScore[];
  analysis: AnalysisResult;
}

export function generatePDF(data: PDFData) {
  const { totalScore, sectionScores, analysis } = data;
  const doc = new jsPDF();

  // Set up fonts and colors
  const primaryColor: [number, number, number] = [37, 99, 235]; // Blue-600
  const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
  const lightGray: [number, number, number] = [229, 231, 235]; // Gray-200

  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add new page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > 280) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight = 7) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  };

  // Header - Logo placeholder
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPosition, 60, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EXIT-DIAGNOS', margin + 5, yPosition + 10);

  yPosition += 25;

  // Title
  doc.setTextColor(...textColor);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Din Exit-Beredskapsrapport', margin, yPosition);
  yPosition += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(new Date().toLocaleDateString('sv-SE'), margin, yPosition);
  yPosition += 15;

  // Total Score Box
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Totalt resultat', margin + 5, yPosition + 10);

  doc.setFontSize(32);
  doc.setTextColor(...primaryColor);
  doc.text(`${totalScore}/100`, margin + 5, yPosition + 25);

  // Score label
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');
  const scoreLabel =
    totalScore < 40
      ? 'Tidig fas - Mycket att förbereda'
      : totalScore < 60
      ? 'Grundläggande ordning - Tydliga gap'
      : totalScore < 80
      ? 'God beredskap - Några förbättringsområden'
      : 'Utmärkt beredskap - Exit-klar';
  doc.text(scoreLabel, margin + 60, yPosition + 20);

  yPosition += 40;

  // Section Scores
  checkPageBreak(20);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Områdesöversikt', margin, yPosition);
  yPosition += 10;

  // Sort sections by score
  const sortedSections = [...sectionScores].sort((a, b) => a.score - b.score);

  // Table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPosition, contentWidth, 8, 'F');
  doc.text('Område', margin + 2, yPosition + 6);
  doc.text('Poäng', pageWidth - margin - 20, yPosition + 6);
  yPosition += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  sortedSections.forEach((section) => {
    checkPageBreak(8);

    // Alternate row background
    if (sortedSections.indexOf(section) % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, yPosition - 2, contentWidth, 8, 'F');
    }

    doc.setTextColor(...textColor);
    doc.text(section.label, margin + 2, yPosition + 4);

    // Score with color
    const score = Math.round(section.score);
    if (score < 40) {
      doc.setTextColor(220, 38, 38); // Red
    } else if (score < 70) {
      doc.setTextColor(217, 119, 6); // Yellow
    } else {
      doc.setTextColor(22, 163, 74); // Green
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${score}`, pageWidth - margin - 20, yPosition + 4);
    doc.setFont('helvetica', 'normal');

    yPosition += 8;
  });

  yPosition += 10;

  // AI Analysis
  checkPageBreak(30);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Personlig analys', margin, yPosition);
  yPosition += 10;

  // Overall assessment
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  yPosition = addWrappedText(analysis.overall, margin, yPosition, contentWidth);
  yPosition += 10;

  // Priorities
  checkPageBreak(20);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Prioriterade åtgärder', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  analysis.priorities.forEach((priority, index) => {
    checkPageBreak(15);
    const priorityText = `${index + 1}. ${priority}`;
    yPosition = addWrappedText(priorityText, margin, yPosition, contentWidth);
    yPosition += 3;
  });

  yPosition += 10;

  // Section recommendations
  const sectionsNeedingWork = sortedSections.filter((s) => s.score < 70);
  if (sectionsNeedingWork.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Områden att förbättra', margin, yPosition);
    yPosition += 10;

    sectionsNeedingWork.forEach((section) => {
      const sectionAnalysis = analysis.sections.find((s) => s.code === section.code);
      if (!sectionAnalysis) return;

      checkPageBreak(30);

      // Section name with score
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text(`${section.label} (${Math.round(section.score)}/100)`, margin, yPosition);
      yPosition += 7;

      // Summary
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPosition = addWrappedText(sectionAnalysis.summary, margin, yPosition, contentWidth, 6);
      yPosition += 5;

      // Recommendations
      doc.setFont('helvetica', 'bold');
      doc.text('Rekommendationer:', margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      sectionAnalysis.recommendations.forEach((rec) => {
        checkPageBreak(15);
        const recText = `• ${rec}`;
        yPosition = addWrappedText(recText, margin + 3, yPosition, contentWidth - 3, 6);
        yPosition += 2;
      });

      yPosition += 8;
    });
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Exit-Diagnos © ${new Date().getFullYear()} | Sida ${i} av ${pageCount}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  // Generate filename with date
  const fileName = `exit-diagnos-${new Date().toISOString().split('T')[0]}.pdf`;

  // Save the PDF
  doc.save(fileName);
}
