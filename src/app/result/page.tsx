'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generatePDF } from '@/utils/generatePDF';
import type { SectionScore } from '@/core/types';
import type { AnalysisResult } from '@/core/ai';

interface SectionWithContent extends SectionScore {
  title?: string;
  content?: {
    text: string;
    nextSteps: string[];
    range: string;
  } | null;
}

interface ResultData {
  totalScore: number;
  sectionScores: SectionWithContent[];
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
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Loaded data from sessionStorage:', parsedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error parsing sessionStorage data:', error);
        // Redirect to quiz if data is corrupted
        router.push('/quiz');
      }
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

        </div>

        {/* Detailed Section Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Detaljerad rapport per område</h2>
          <p className="text-gray-600 mb-6">
            Nedan får du en djupare analys av varje område baserat på din nuvarande nivå.
          </p>

          <div className="space-y-6">
            {sortedSections.map((section) => {
              // Skip sections without content
              if (!section.content || !section.content.text || !section.content.nextSteps) {
                return null;
              }

              const isExpanded = expandedSections.has(`detail-${section.code}`);

              return (
                <div key={`detail-${section.code}`} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(`detail-${section.code}`)}
                    className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-lg text-lg font-bold ${getScoreColor(section.score)}`}>
                        {Math.round(section.score)}
                      </span>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">{section.title || section.label}</h3>
                        <p className="text-sm text-gray-500">Nivå: {section.content?.range || 'N/A'} poäng</p>
                      </div>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-500 transition-transform flex-shrink-0 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 bg-gray-50 border-t-2 border-gray-100">
                      <div className="pt-5">
                        <h4 className="font-semibold text-gray-900 mb-3 text-base">Din nuvarande situation</h4>
                        <p className="text-gray-700 leading-relaxed mb-6">{section.content.text}</p>

                        <h4 className="font-semibold text-gray-900 mb-3 text-base">Nästa steg</h4>
                        <ul className="space-y-3">
                          {section.content.nextSteps.map((step, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 pt-0.5">{step}</span>
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

        {/* Final CTA block */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-3">Vad gör du med den här insikten nu?</h2>
          <p className="mb-4 text-blue-100 leading-relaxed">
            Diagnosen är inte till för att säga &ldquo;sälj&rdquo; eller &ldquo;sälj inte&rdquo;, utan för att visa var du behöver
            bli skarpare innan du ger dig in i en av ditt livs viktigaste affärer.
          </p>
          <div className="space-y-2 mb-6 text-blue-50">
            <p>✓ <strong>Din totala score</strong> – hur nära är du ett realistiskt exitläge?</p>
            <p>✓ <strong>Dina 3 svagaste områden</strong> – det är där värdet riskerar att rinna ut</p>
          </div>
          <p className="text-blue-100 mb-2">Vill du gå vidare kan du:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-50 mb-6">
            <li>Göra en konkret 12–24 månaders förberedelseplan utifrån svagaste områdena</li>
            <li>Ta in rätt typ av rådgivare med ett tydligt uppdrag</li>
            <li>Använda insikterna här som underlag i styrelse, ägarmöten och diskussioner med familj</li>
          </ul>
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
