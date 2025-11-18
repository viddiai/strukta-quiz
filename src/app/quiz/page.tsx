'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/core/questions';
import type { Answers, LikertScale } from '@/core/types';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group questions by section (10 steps, 4 questions each)
  const sections = QUESTIONS.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, typeof QUESTIONS>);

  const sectionKeys = Object.keys(sections);
  const currentSection = sectionKeys[currentStep];
  const currentQuestions = sections[currentSection] || [];
  const isLastStep = currentStep === sectionKeys.length - 1;

  const handleAnswer = (questionId: string, value: LikertScale) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < sectionKeys.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      const result = await response.json();

      if (result.success) {
        // Store result in sessionStorage and navigate to result page
        sessionStorage.setItem('exitDiagnosisResult', JSON.stringify(result.data));
        router.push('/result');
      } else {
        alert('Ett fel uppstod vid beräkningen. Försök igen.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Ett fel uppstod. Kontrollera din internetanslutning.');
      setIsSubmitting(false);
    }
  };

  // Check if all questions in current step are answered
  const currentStepAnswered = currentQuestions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Steg {currentStep + 1} av {sectionKeys.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / sectionKeys.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / sectionKeys.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Section header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentQuestions[0]?.sectionLabel}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Besvara frågorna genom att välja hur väl påståendet stämmer
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Fråga {index + 1} av {currentQuestions.length}
                </span>
                <p className="text-lg text-gray-900 mt-2">{question.text}</p>
              </div>

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

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            ← Tillbaka
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!currentStepAnswered || isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                !currentStepAnswered || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Beräknar...' : 'Visa resultat'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentStepAnswered}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !currentStepAnswered
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Nästa →
            </button>
          )}
        </div>

        {/* Help text */}
        {!currentStepAnswered && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Besvara alla frågor för att fortsätta
          </p>
        )}
      </div>
    </div>
  );
}
