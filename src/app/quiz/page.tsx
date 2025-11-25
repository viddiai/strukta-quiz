'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/core/questions';
import type { Answers, LikertScale } from '@/core/types';

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group questions by section
  const sections = QUESTIONS.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, typeof QUESTIONS>);

  const sectionKeys = Object.keys(sections);

  const handleAnswer = (questionId: string, value: LikertScale) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log('Submitting answers to /api/score...');
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      console.log('API response status:', response.status);
      const result = await response.json();
      console.log('API response data:', result);

      if (result.success) {
        // Store result in sessionStorage and navigate to result page
        console.log('Storing result in sessionStorage...');
        sessionStorage.setItem('exitDiagnosisResult', JSON.stringify(result.data));
        console.log('Navigating to /result...');
        router.push('/result');
      } else {
        console.error('API returned success: false', result);
        alert(`Ett fel uppstod vid beräkningen: ${result.error || 'Okänt fel'}. Försök igen.`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Ett fel uppstod: ${error instanceof Error ? error.message : 'Okänt fel'}. Kontrollera din internetanslutning.`);
      setIsSubmitting(false);
    }
  };

  // Check if all questions are answered
  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Exit-Diagnos</h1>
          <p className="text-gray-600 mt-2">
            Besvara alla {QUESTIONS.length} frågor för att få din personliga exit-analys.
          </p>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {answeredCount} av {QUESTIONS.length} frågor besvarade
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((answeredCount / QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions grouped by section */}
        <div className="space-y-8">
          {sectionKeys.map((sectionKey) => {
            const sectionQuestions = sections[sectionKey];
            const sectionLabel = sectionQuestions[0]?.sectionLabel;

            return (
              <div key={sectionKey} className="bg-white rounded-lg shadow-sm p-6">
                {/* Section header */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">{sectionLabel}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {sectionQuestions.length} {sectionQuestions.length === 1 ? 'fråga' : 'frågor'}
                  </p>
                </div>

                {/* Questions in this section */}
                <div className="space-y-6">
                  {sectionQuestions.map((question) => (
                    <div key={question.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <p className="text-base text-gray-900 mb-4">{question.text}</p>

                      {/* Likert scale buttons */}
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(question.id, value as LikertScale)}
                              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                                answers[question.id] === value
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 px-1">
                          <span>Stämmer inte alls</span>
                          <span>Stämmer helt</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit button - sticky at bottom */}
        <div className="sticky bottom-0 mt-8 bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {allAnswered ? (
                <span className="text-green-600 font-medium">✓ Alla frågor besvarade</span>
              ) : (
                <span>{QUESTIONS.length - answeredCount} frågor kvar att besvara</span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !allAnswered || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Beräknar...' : 'Visa resultat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
