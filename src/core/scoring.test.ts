import { describe, it, expect } from 'vitest';
import { computeSectionScores, computeTotalScore, SECTION_WEIGHTS } from './scoring';
import { QUESTIONS } from './questions';
import { Answers, LikertScale } from './types';

describe('scoring', () => {
  describe('computeSectionScores', () => {
    it('should return 0 for all sections when all answers are 1', () => {
      const answers: Answers = {};
      QUESTIONS.forEach((q) => {
        answers[q.id] = 1 as LikertScale;
      });

      const sectionScores = computeSectionScores(answers);

      sectionScores.forEach((section) => {
        expect(section.score).toBe(0);
        expect(section.averageRaw).toBe(1);
      });
    });

    it('should return 100 for all sections when all answers are 5', () => {
      const answers: Answers = {};
      QUESTIONS.forEach((q) => {
        answers[q.id] = 5 as LikertScale;
      });

      const sectionScores = computeSectionScores(answers);

      sectionScores.forEach((section) => {
        expect(section.score).toBe(100);
        expect(section.averageRaw).toBe(5);
      });
    });

    it('should correctly calculate scores for mixed answers', () => {
      // ST section: st_001=3, st_002=4, st_003=2, st_004=5
      // Average: (3+4+2+5)/4 = 14/4 = 3.5
      // Score: (3.5 - 1) * 25 = 2.5 * 25 = 62.5
      const answers: Answers = {
        st_001: 3,
        st_002: 4,
        st_003: 2,
        st_004: 5,
      };

      const sectionScores = computeSectionScores(answers);
      const stSection = sectionScores.find((s) => s.code === 'ST');

      expect(stSection).toBeDefined();
      expect(stSection!.averageRaw).toBe(3.5);
      expect(stSection!.score).toBe(62.5);
      expect(stSection!.questionCount).toBe(4);
    });

    it('should handle multiple sections with different scores', () => {
      // ST section: all 2s → avg=2 → score=(2-1)*25=25
      // BA section: all 4s → avg=4 → score=(4-1)*25=75
      const answers: Answers = {
        st_001: 2,
        st_002: 2,
        st_003: 2,
        st_004: 2,
        ba_001: 4,
        ba_002: 4,
        ba_003: 4,
        ba_004: 4,
      };

      const sectionScores = computeSectionScores(answers);

      const stSection = sectionScores.find((s) => s.code === 'ST');
      const baSection = sectionScores.find((s) => s.code === 'BA');

      expect(stSection!.score).toBe(25);
      expect(stSection!.averageRaw).toBe(2);

      expect(baSection!.score).toBe(75);
      expect(baSection!.averageRaw).toBe(4);
    });
  });

  describe('computeTotalScore', () => {
    it('should return 0 when all section scores are 0', () => {
      const sectionScores = [
        { code: 'ST' as const, label: 'ST', score: 0, averageRaw: 1, questionCount: 4 },
        { code: 'BA' as const, label: 'BA', score: 0, averageRaw: 1, questionCount: 4 },
      ];

      const total = computeTotalScore(sectionScores);
      expect(total).toBe(0);
    });

    it('should return 100 when all section scores are 100', () => {
      // All 10 sections with score 100
      const sectionScores = [
        { code: 'ST' as const, label: 'ST', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'BA' as const, label: 'BA', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'VP' as const, label: 'VP', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'KS' as const, label: 'KS', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'PD' as const, label: 'PD', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'AG' as const, label: 'AG', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'SK' as const, label: 'SK', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'LP' as const, label: 'LP', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'VK' as const, label: 'VK', score: 100, averageRaw: 5, questionCount: 4 },
        { code: 'DL' as const, label: 'DL', score: 100, averageRaw: 5, questionCount: 4 },
      ];

      const total = computeTotalScore(sectionScores);
      expect(total).toBe(100);
    });

    it('should correctly calculate weighted average for mixed scores', () => {
      // ST: 50, weight 0.1 → 50 * 0.1 = 5
      // BA: 75, weight 0.1 → 75 * 0.1 = 7.5
      // Total: 5 + 7.5 = 12.5 → rounds to 13
      const sectionScores = [
        { code: 'ST' as const, label: 'ST', score: 50, averageRaw: 3, questionCount: 4 },
        { code: 'BA' as const, label: 'BA', score: 75, averageRaw: 4, questionCount: 4 },
      ];

      const total = computeTotalScore(sectionScores);
      expect(total).toBe(13);
    });
  });

  describe('SECTION_WEIGHTS', () => {
    it('should sum to exactly 1.0', () => {
      const sum = Object.values(SECTION_WEIGHTS).reduce((acc, w) => acc + w, 0);
      expect(sum).toBeCloseTo(1.0, 10); // Use toBeCloseTo for floating point comparison
    });

    it('should have weights for all 10 sections', () => {
      const sections = Object.keys(SECTION_WEIGHTS);
      expect(sections.length).toBe(10);
      expect(sections).toContain('ST');
      expect(sections).toContain('BA');
      expect(sections).toContain('VP');
      expect(sections).toContain('KS');
      expect(sections).toContain('PD');
      expect(sections).toContain('AG');
      expect(sections).toContain('SK');
      expect(sections).toContain('LP');
      expect(sections).toContain('VK');
      expect(sections).toContain('DL');
    });
  });
});
