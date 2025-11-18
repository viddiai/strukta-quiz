export type LikertScale = 1 | 2 | 3 | 4 | 5;

export type SectionCode =
  | 'ST' // Strategisk Tydlighet
  | 'BA' // Bolagsstyrning & Ansvarsfördelning
  | 'VP' // Värdeskapande Processer
  | 'KS' // Kundstock & Sälj
  | 'PD' // Produkter & Differentiering
  | 'AG' // Organisation & Ledarskap
  | 'SK' // Säkerhet & Kontinuitet
  | 'LP' // Lönsamhet & Prissättning
  | 'VK' // Verkställighet
  | 'DL'; // Dokumentation & Ledningssystem

export interface Question {
  id: string;
  section: SectionCode;
  sectionLabel: string;
  text: string;
  type: 'likert';
  weight: number; // 1.0 default, kan justera senare
}

export type Answers = Record<string, LikertScale>;

export interface SectionScore {
  code: SectionCode;
  label: string;
  score: number; // 0-100
  averageRaw: number; // 1-5
  questionCount: number;
}
