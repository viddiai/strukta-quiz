import { QUESTIONS } from '../src/core/questions';

describe('Questions', () => {
  it('should have exactly 18 questions', () => {
    expect(QUESTIONS.length).toBe(18);
  });

  it('should have 10 unique sections', () => {
    const sections = new Set(QUESTIONS.map((q) => q.section));
    expect(sections.size).toBe(10);
  });

  it('should have correct number of questions per section', () => {
    const sectionCounts: Record<string, number> = {};
    QUESTIONS.forEach((q) => {
      sectionCounts[q.section] = (sectionCounts[q.section] || 0) + 1;
    });

    expect(sectionCounts.ST).toBe(2);
    expect(sectionCounts.BA).toBe(1);
    expect(sectionCounts.VP).toBe(2);
    expect(sectionCounts.KS).toBe(1);
    expect(sectionCounts.PD).toBe(2);
    expect(sectionCounts.AG).toBe(1);
    expect(sectionCounts.SK).toBe(2);
    expect(sectionCounts.LP).toBe(2);
    expect(sectionCounts.VK).toBe(3);
    expect(sectionCounts.DL).toBe(2);
  });

  it('should have all questions with type "likert"', () => {
    QUESTIONS.forEach((q) => {
      expect(q.type).toBe('likert');
    });
  });

  it('should have all questions with weight 1', () => {
    QUESTIONS.forEach((q) => {
      expect(q.weight).toBe(1);
    });
  });

  it('should have unique question IDs', () => {
    const ids = QUESTIONS.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(QUESTIONS.length);
  });
});

console.log('=== EXIT-DIAGNOS FRÅGOR ===\n');
console.log(`Totalt antal frågor: ${QUESTIONS.length}\n`);

QUESTIONS.forEach((q, index) => {
  console.log(`${index + 1}. [${q.section}] ${q.sectionLabel}`);
  console.log(`   ID: ${q.id}`);
  console.log(`   Fråga: ${q.text}`);
  console.log(`   Typ: ${q.type}, Vikt: ${q.weight}\n`);
});
