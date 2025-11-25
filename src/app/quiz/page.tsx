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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Exit-Diagnos</h1>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Besvara alla {QUESTIONS.length} frågor för att få din personliga exit-analys.
          </p>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">
                {answeredCount} av {QUESTIONS.length} frågor besvarade
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {Math.round((answeredCount / QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-amber-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions grouped by section */}
        <div className="space-y-6">
          {sectionKeys.map((sectionKey) => {
            const sectionQuestions = sections[sectionKey];
            const sectionLabel = sectionQuestions[0]?.sectionLabel;

            return (
              <div key={sectionKey} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
                {/* Section header */}
                <div className="mb-6 pb-5 border-b-2 border-amber-100">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{sectionLabel}</h2>
                  <p className="text-sm text-slate-500 mt-2">
                    {sectionQuestions.length} {sectionQuestions.length === 1 ? 'fråga' : 'frågor'}
                  </p>
                </div>

                {/* Questions in this section */}
                <div className="space-y-8">
                  {sectionQuestions.map((question) => (
                    <div key={question.id} className="pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-base sm:text-lg text-slate-900 mb-5 leading-relaxed">{question.text}</p>

                      {/* Likert scale buttons */}
                      <div className="space-y-3">
                        <div className="flex gap-2 sm:gap-3">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(question.id, value as LikertScale)}
                              className={`flex-1 py-3 sm:py-4 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 ${
                                answers[question.id] === value
                                  ? 'border-amber-700 bg-amber-50 text-amber-900 font-semibold shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm text-slate-500 px-1">
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
        <div className="sticky bottom-0 mt-8 bg-white rounded-xl shadow-xl border border-slate-200 p-6 sm:p-8 border-t-4 border-amber-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-sm sm:text-base text-slate-600">
              {allAnswered ? (
                <span className="text-green-600 font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Alla frågor besvarade
                </span>
              ) : (
                <span className="font-medium text-slate-700">{QUESTIONS.length - answeredCount} frågor kvar att besvara</span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={`w-full sm:w-auto px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 ${
                !allAnswered || isSubmitting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
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
