import { Answers, SectionScore, SectionCode } from './types';
import { QUESTIONS } from './questions';

export const SECTION_WEIGHTS: Record<SectionCode, number> = {
  ST: 0.1, // Strategisk Tydlighet
  BA: 0.1, // Bolagsstyrning & Ansvarsfördelning
  VP: 0.1, // Värdeskapande Processer
  KS: 0.1, // Kundstock & Sälj
  PD: 0.1, // Produkter & Differentiering
  AG: 0.1, // Organisation & Ledarskap
  SK: 0.1, // Säkerhet & Kontinuitet
  LP: 0.1, // Lönsamhet & Prissättning
  VK: 0.1, // Verkställighet
  DL: 0.1, // Dokumentation & Ledningssystem
};

export function computeSectionScores(answers: Answers): SectionScore[] {
  // Group questions by section
  const sectionMap = new Map<SectionCode, typeof QUESTIONS>();

  QUESTIONS.forEach((question) => {
    if (!sectionMap.has(question.section)) {
      sectionMap.set(question.section, []);
    }
    sectionMap.get(question.section)!.push(question);
  });

  const sectionScores: SectionScore[] = [];

  // Calculate scores for each section
  sectionMap.forEach((questions, sectionCode) => {
    const answeredQuestions = questions.filter((q) => answers[q.id] !== undefined);

    if (answeredQuestions.length === 0) {
      return; // Skip sections with no answers
    }

    // Calculate average (1-5)
    const sum = answeredQuestions.reduce((acc, q) => acc + answers[q.id], 0);
    const averageRaw = sum / answeredQuestions.length;

    // Map to 0-100 scale
    const score = (averageRaw - 1) * 25;

    sectionScores.push({
      code: sectionCode,
      label: questions[0].sectionLabel,
      score: Math.round(score * 100) / 100, // Round to 2 decimals
      averageRaw: Math.round(averageRaw * 100) / 100,
      questionCount: answeredQuestions.length,
    });
  });

  return sectionScores;
}

export function computeTotalScore(sectionScores: SectionScore[]): number {
  // Weighted average
  const weightedSum = sectionScores.reduce((acc, section) => {
    const weight = SECTION_WEIGHTS[section.code] || 0;
    return acc + section.score * weight;
  }, 0);

  return Math.round(weightedSum);
}
