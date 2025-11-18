import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import QuizPage from './page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('QuizPage', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it('should render first section with questions', () => {
    render(<QuizPage />);

    // Check for progress indicator
    expect(screen.getByText(/Steg 1 av 10/i)).toBeInTheDocument();

    // Check for section title
    expect(screen.getByText(/Strategi & Tajming/i)).toBeInTheDocument();

    // Check for Likert scale labels (they appear multiple times, once per question)
    expect(screen.getAllByText(/Stämmer inte alls/i)).toHaveLength(4);
    expect(screen.getAllByText(/Stämmer helt/i)).toHaveLength(4);
  });

  it('should display 4 questions in first section', () => {
    render(<QuizPage />);

    const questions = screen.getAllByText(/Fråga \d av 4/i);
    expect(questions).toHaveLength(4);
  });

  it('should enable Next button after answering all questions', () => {
    render(<QuizPage />);

    // Initially, Next button should be disabled
    const nextButton = screen.getByRole('button', { name: /Nästa/i });
    expect(nextButton).toBeDisabled();

    // Answer all 4 questions
    const buttons = screen.getAllByRole('button', { name: '3' });
    buttons.slice(0, 4).forEach((button) => {
      fireEvent.click(button);
    });

    // Now Next button should be enabled
    expect(nextButton).not.toBeDisabled();
  });

  it('should navigate to next section when clicking Next', () => {
    render(<QuizPage />);

    // Answer all questions in first section
    const buttons = screen.getAllByRole('button', { name: '4' });
    buttons.slice(0, 4).forEach((button) => {
      fireEvent.click(button);
    });

    // Click Next
    const nextButton = screen.getByRole('button', { name: /Nästa/i });
    fireEvent.click(nextButton);

    // Should now be on step 2
    expect(screen.getByText(/Steg 2 av 10/i)).toBeInTheDocument();
  });

  it('should allow going back to previous section', () => {
    render(<QuizPage />);

    // Answer questions and go to next section
    const buttons = screen.getAllByRole('button', { name: '4' });
    buttons.slice(0, 4).forEach((button) => {
      fireEvent.click(button);
    });
    fireEvent.click(screen.getByRole('button', { name: /Nästa/i }));

    // Verify we're on step 2
    expect(screen.getByText(/Steg 2 av 10/i)).toBeInTheDocument();

    // Click Back
    const backButton = screen.getByRole('button', { name: /Tillbaka/i });
    fireEvent.click(backButton);

    // Should be back on step 1
    expect(screen.getByText(/Steg 1 av 10/i)).toBeInTheDocument();
  });

  it('should disable Back button on first section', () => {
    render(<QuizPage />);

    const backButton = screen.getByRole('button', { name: /Tillbaka/i });
    expect(backButton).toBeDisabled();
  });

  it('should highlight selected answer', () => {
    render(<QuizPage />);

    const button3 = screen.getAllByRole('button', { name: '3' })[0];
    fireEvent.click(button3);

    // Check if the button has the selected styling classes
    expect(button3.className).toContain('border-blue-600');
    expect(button3.className).toContain('bg-blue-50');
  });

  it('should show "Visa resultat" button on last step', () => {
    render(<QuizPage />);

    // Navigate through all 10 sections
    for (let i = 0; i < 10; i++) {
      // Answer all questions
      const buttons = screen.getAllByRole('button', { name: '4' });
      buttons.slice(0, 4).forEach((button) => {
        fireEvent.click(button);
      });

      if (i < 9) {
        // Click Next for sections 1-9
        fireEvent.click(screen.getByRole('button', { name: /Nästa/i }));
      }
    }

    // On last step, should show "Visa resultat"
    expect(screen.getByRole('button', { name: /Visa resultat/i })).toBeInTheDocument();
  });

  it('should submit answers and navigate to result page', async () => {
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        success: true,
        data: {
          totalScore: 75,
          sectionScores: [],
          analysis: {},
        },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<QuizPage />);

    // Navigate to last section and answer all questions
    for (let i = 0; i < 10; i++) {
      const buttons = screen.getAllByRole('button', { name: '4' });
      buttons.slice(0, 4).forEach((button) => {
        fireEvent.click(button);
      });

      if (i < 9) {
        fireEvent.click(screen.getByRole('button', { name: /Nästa/i }));
      }
    }

    // Click submit
    const submitButton = screen.getByRole('button', { name: /Visa resultat/i });
    fireEvent.click(submitButton);

    // Wait for API call and navigation
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/score',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/result');
    });
  });

  it('should show loading state during submission', async () => {
    vi.mocked(fetch).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: async () => ({ success: true, data: {} }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any),
            100
          )
        )
    );

    render(<QuizPage />);

    // Navigate to last section
    for (let i = 0; i < 10; i++) {
      const buttons = screen.getAllByRole('button', { name: '4' });
      buttons.slice(0, 4).forEach((button) => {
        fireEvent.click(button);
      });
      if (i < 9) {
        fireEvent.click(screen.getByRole('button', { name: /Nästa/i }));
      }
    }

    const submitButton = screen.getByRole('button', { name: /Visa resultat/i });
    fireEvent.click(submitButton);

    // Should show loading text
    await waitFor(() => {
      expect(screen.getByText(/Beräknar.../i)).toBeInTheDocument();
    });
  });
});
