'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generatePDF } from '@/utils/generatePDF';
import type { SectionScore } from '@/core/types';
import type { AnalysisResult } from '@/core/ai';

interface ResultData {
  totalScore: number;
  sectionScores: SectionScore[];
  analysis: AnalysisResult;
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load data from sessionStorage
    const storedData = sessionStorage.getItem('exitDiagnosisResult');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      // Redirect to quiz if no data
      router.push('/quiz');
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Laddar resultat...</p>
        </div>
      </div>
    );
  }

  const { totalScore, sectionScores, analysis } = data;

  // Get label based on score
  const getScoreLabel = (score: number) => {
    if (score < 40) return 'Tidig fas - Mycket att förbereda';
    if (score < 60) return 'Grundläggande ordning - Tydliga gap';
    if (score < 80) return 'God beredskap - Några förbättringsområden';
    return 'Utmärkt beredskap - Exit-klar';
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-600 bg-red-50';
    if (score < 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getScoreBorderColor = (score: number) => {
    if (score < 40) return 'border-red-200';
    if (score < 70) return 'border-yellow-200';
    return 'border-green-200';
  };

  // Sort sections by score (lowest first)
  const sortedSections = [...sectionScores].sort((a, b) => a.score - b.score);

  // Get sections under 70 for detailed analysis
  const sectionsNeedingWork = sortedSections.filter((s) => s.score < 70);

  const toggleSection = (code: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Din Exit-Diagnos</h1>
          <div className="mb-6">
            <div className={`inline-block text-6xl font-bold mb-2 ${getScoreColor(totalScore)}`}>
              {totalScore}
              <span className="text-3xl">/100</span>
            </div>
          </div>
          <p className="text-xl text-gray-700 font-medium">{getScoreLabel(totalScore)}</p>
        </div>

        {/* Section scores table */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Områdesöversikt</h2>
          <div className="space-y-3">
            {sortedSections.map((section) => (
              <div
                key={section.code}
                className={`flex justify-between items-center p-4 rounded-lg border-2 ${getScoreBorderColor(
                  section.score
                )}`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{section.label}</h3>
                  <p className="text-sm text-gray-500">
                    {section.questionCount} frågor • Genomsnitt: {section.averageRaw.toFixed(1)}/5
                  </p>
                </div>
                <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getScoreColor(section.score)}`}>
                  {Math.round(section.score)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Din personliga analys</h2>

          {/* Overall assessment */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{analysis.overall}</p>
          </div>

          {/* Priorities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prioriterade åtgärder</h3>
            <ol className="list-decimal list-inside space-y-2">
              {analysis.priorities.map((priority, index) => (
                <li key={index} className="text-gray-700 pl-2">
                  {priority}
                </li>
              ))}
            </ol>
          </div>

          {/* Detailed section recommendations */}
          {sectionsNeedingWork.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Områden att förbättra
              </h3>
              <div className="space-y-3">
                {sectionsNeedingWork.map((section) => {
                  const sectionAnalysis = analysis.sections.find((s) => s.code === section.code);
                  if (!sectionAnalysis) return null;

                  const isExpanded = expandedSections.has(section.code);

                  return (
                    <div
                      key={section.code}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(section.code)}
                        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(section.score)}`}>
                            {Math.round(section.score)}
                          </span>
                          <span className="font-semibold text-gray-900">{section.label}</span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 bg-gray-50">
                          <p className="text-gray-700 mb-4">{sectionAnalysis.summary}</p>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Rekommendationer:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {sectionAnalysis.recommendations.map((rec, index) => (
                                <li key={index} className="text-gray-700 pl-2">
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nästa steg</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => generatePDF(data)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              📄 Ladda ner PDF-rapport
            </button>
            <a
              href="mailto:kontakt@exitdiagnos.se?subject=Boka rådgivning - Exit-diagnos"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
            >
              📅 Boka rådgivning
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Vill du diskutera ditt resultat? Boka ett kostnadsfritt samtal med en av våra
            exit-rådgivare.
          </p>
        </div>

        {/* Back to start */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem('exitDiagnosisResult');
              router.push('/');
            }}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Tillbaka till start
          </button>
        </div>
      </div>
    </div>
  );
}
