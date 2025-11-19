import jsPDF from 'jspdf';
import type { SectionScore } from '@/core/types';
import type { AnalysisResult } from '@/core/ai';

interface SectionWithContent extends SectionScore {
  title?: string;
  content?: {
    text: string;
    nextSteps: string[];
    range: string;
  } | null;
}

interface PDFData {
  totalScore: number;
  sectionScores: SectionWithContent[];
  analysis: AnalysisResult;
}

// Exit Coach tips for each section
const getExitCoachTip = (sectionCode: string): string => {
  const tips: Record<string, string> = {
    ST: 'Tajming och motiv avgör ofta om affären blir bra eller dålig. Säljer du för att du är trött, för att bolaget står inför större investeringar eller för att du faktiskt vill frigöra tid och kapital? Här testar du om du säljer av rätt skäl, om marknadsläget talar för eller emot försäljning och hur en professionell köpare kommer tolka din tajming.',
    BA: 'Här granskar du ditt bolag som en köpare gör: utan känslor, med fokus på fakta. Hur ser lönsamhet, kassaflöde, tillväxt, kundbas och risk ut när man skalar bort allt personligt? Finns beroenden till dig, enstaka kunder eller leverantörer som skrämmer bort en seriös köpare? Här får du en ärlig bild av hur attraktivt ditt case faktiskt är på marknaden idag.',
    VP: 'Vad du tycker att bolaget är värt och vad marknaden är beredd att betala är två olika saker. Här går du igenom vad som faktiskt driver värdet: lönsamhet, tillväxt, risk, beroenden och framtida potential. Vi tittar också på hur kontantdel, tilläggsköpeskilling, säljarrevers och andra upplägg påverkar vad du får i handen – och hur mycket risk du tar efter affären.',
    KS: '"Rätt köpare" är sällan den som bara bjuder högst. En industriell köpare, en finansiell aktör eller en branschkollega kommer att se på ditt bolag på helt olika sätt. Här kartlägger du vilka köpargrupper som är realistiska, vad de letar efter, hur du bäst närmar dig dem och hur du undviker att lägga tid på fel typ av köpare som aldrig kommer avsluta.',
    PD: 'En köpare kommer inte "känna efter", de kommer gräva. I en riktig process krävs ordning på siffror, avtal, styrdokument, nyckeltal och historik. Kan du snabbt ta fram det som efterfrågas, eller sitter allt i mappar, mejl och ditt minne? Här prövar du om du faktiskt klarar en skarp DD, utan kaos, brandkårsutryckningar och onödiga frågetecken.',
    AG: 'Det är lätt att stirra sig blind på köpeskillingen, men det är villkoren som avgör hur mycket risk du behåller. Vilka garantier om historik, skatter, tvister och dolda fel förväntas du skriva under på? Hur länge kan köparen komma tillbaka med krav? Här går du igenom dina alternativ för att begränsa ansvar, undvika fällor och minska risken för framtida konflikter.',
    SK: 'Det avgörande är inte prislappen i rubriken, utan hur mycket som faktiskt landar på ditt konto efter skatt, lån och kostnader. Här går du igenom olika sätt att ta ut pengar, hur försäljningsstruktur påverkar skatten och vad du behöver tänka på för att inte skjuta dig själv i foten. Målet är att du får en klar bild av din privata "nettoaffär".',
    LP: 'När du säljer följer inte bara maskiner och avtal med – utan människor. Köpare tittar på om ledningen är självgående, om nyckelpersoner kan stanna kvar och hur sårbart bolaget är om någon slutar. Hur mycket sitter i ditt huvud? Finns strukturer, rutiner och incitament som gör att verksamheten rullar även utan dig? Här går du igenom vad som krävs för ett tryggt ägarbyte.',
    VK: 'För många ägare är det viktigare vad som händer med bolagets själ än att pressa sista kronan. Här tittar du på hur en köpare kan påverka varumärke, kultur, arbetssätt och kundrelationer. Vill du ha inflytande över detta i avtalet eller släppa taget helt? Vi går igenom vilka frågor du bör ställa – och vilka krav du faktiskt kan ställa – om ditt arv ska leva vidare.',
    DL: 'När affären är klar förändras din vardag i grunden. Ska du stanna kvar en period, sitta i styrelsen, vara rådgivare eller kliva av helt? Vad händer med din identitet när du inte längre "är" bolaget? Här utforskar du hur du vill att ditt liv efter affären ska se ut – praktiskt, ekonomiskt och mentalt – så att du inte vaknar upp med mycket pengar men utan riktning.',
  };
  return tips[sectionCode] || '';
};

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

  // Detailed Section Reports - Show ALL sections with their detailed content
  checkPageBreak(20);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detaljerad rapport per område', margin, yPosition);
  yPosition += 10;

  sortedSections.forEach((section) => {
    // Skip sections without content
    if (!section.content || !section.content.text || !section.content.nextSteps) {
      return;
    }

    checkPageBreak(40);

    // Section title with score and range
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    const sectionTitle = section.title || section.label;
    doc.text(sectionTitle, margin, yPosition);
    yPosition += 7;

    // Score and range info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Poäng: ${Math.round(section.score)}/100 | Nivå: ${section.content.range}`, margin, yPosition);
    yPosition += 8;

    // "Din nuvarande situation" section
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Din nuvarande situation', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addWrappedText(section.content.text, margin, yPosition, contentWidth, 6);
    yPosition += 8;

    // "Nästa steg" section
    checkPageBreak(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Nästa steg', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    section.content.nextSteps.forEach((step, index) => {
      checkPageBreak(15);
      const stepText = `${index + 1}. ${step}`;
      yPosition = addWrappedText(stepText, margin, yPosition, contentWidth, 6);
      yPosition += 3;
    });

    yPosition += 8;

    // "Tips från din Exit Coach" section
    checkPageBreak(15);
    const coachTip = getExitCoachTip(section.code);
    if (coachTip) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Tips från din Exit Coach:', margin, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...textColor);
      yPosition = addWrappedText(coachTip, margin, yPosition, contentWidth, 6);
      yPosition += 5;
    }

    yPosition += 10;
  });

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
