import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { computeSectionScores, computeTotalScore } from '@/core/scoring';
import { generateExitAnalysis } from '@/core/ai';

// Mock the dependencies
vi.mock('@/core/scoring');
vi.mock('@/core/ai');

describe('Score API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully process valid answers and return analysis', async () => {
    // Mock the scoring functions
    const mockSectionScores = [
      { code: 'ST' as const, label: 'Strategi & Tajming', score: 75, averageRaw: 4, questionCount: 4 },
      { code: 'BA' as const, label: 'Bolagets Attraktivitet & Siffror', score: 50, averageRaw: 3, questionCount: 4 },
    ];

    const mockAnalysis = {
      overall: 'Test analysis',
      priorities: ['Priority 1', 'Priority 2', 'Priority 3'],
      sections: [
        {
          code: 'ST',
          label: 'Strategi & Tajming',
          summary: 'Good strategic clarity',
          recommendations: ['Rec 1', 'Rec 2'],
        },
      ],
    };

    vi.mocked(computeSectionScores).mockReturnValue(mockSectionScores);
    vi.mocked(computeTotalScore).mockReturnValue(65);
    vi.mocked(generateExitAnalysis).mockResolvedValue(mockAnalysis);

    // Create request
    const request = new Request('http://localhost:3000/api/score', {
      method: 'POST',
      body: JSON.stringify({
        answers: {
          st_001: 4,
          st_002: 3,
          st_003: 5,
          st_004: 4,
        },
      }),
    });

    // Call the API
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.totalScore).toBe(65);
    expect(data.data.sectionScores).toEqual(mockSectionScores);
    expect(data.data.analysis).toEqual(mockAnalysis);

    // Verify mocks were called
    expect(computeSectionScores).toHaveBeenCalledOnce();
    expect(computeTotalScore).toHaveBeenCalledWith(mockSectionScores);
    expect(generateExitAnalysis).toHaveBeenCalledWith({
      totalScore: 65,
      sections: mockSectionScores,
      openAnswers: undefined,
    });
  });

  it('should handle requests with openAnswers', async () => {
    const mockSectionScores = [
      { code: 'ST' as const, label: 'Test', score: 50, averageRaw: 3, questionCount: 4 },
    ];

    vi.mocked(computeSectionScores).mockReturnValue(mockSectionScores);
    vi.mocked(computeTotalScore).mockReturnValue(50);
    vi.mocked(generateExitAnalysis).mockResolvedValue({
      overall: 'Test',
      priorities: [],
      sections: [],
    });

    const request = new Request('http://localhost:3000/api/score', {
      method: 'POST',
      body: JSON.stringify({
        answers: { st_001: 3 },
        openAnswers: { general: 'Planning to sell in 2 years' },
      }),
    });

    await POST(request);

    expect(generateExitAnalysis).toHaveBeenCalledWith({
      totalScore: 50,
      sections: mockSectionScores,
      openAnswers: { general: 'Planning to sell in 2 years' },
    });
  });

  it('should return error on exception', async () => {
    vi.mocked(computeSectionScores).mockImplementation(() => {
      throw new Error('Test error');
    });

    const request = new Request('http://localhost:3000/api/score', {
      method: 'POST',
      body: JSON.stringify({ answers: {} }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Något gick fel vid beräkning');
  });
});
