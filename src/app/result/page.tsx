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

interface UserInfo {
  name: string;
  email: string;
  company: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [hasUnlockedReport, setHasUnlockedReport] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleUnlockReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('User info submitted:', userInfo);
      setHasUnlockedReport(true);
      setIsSubmitting(false);

      // Scroll to detailed report
      setTimeout(() => {
        const detailSection = document.getElementById('detailed-report');
        if (detailSection) {
          detailSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 500);
  };

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

  const isFormValid = userInfo.name.trim() !== '' &&
                      userInfo.email.trim() !== '' &&
                      userInfo.company.trim() !== '' &&
                      userInfo.email.includes('@');

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
                    {section.questionCount} {section.questionCount === 1 ? 'fråga' : 'frågor'} • Genomsnitt: {section.averageRaw.toFixed(1)}/5
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

        {/* Unlock Report Form */}
        {!hasUnlockedReport && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-8 mb-8 border-2 border-blue-200">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Lås upp din detaljerade rapport</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                För att få tillgång till den fullständiga analysen med konkreta nästa steg för varje område,
                vänligen fyll i dina uppgifter nedan.
              </p>
            </div>

            <form onSubmit={handleUnlockReport} className="max-w-md mx-auto space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Namn *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ditt för- och efternamn"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="din.epost@foretag.se"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Företag *
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={userInfo.company}
                  onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ditt företagsnamn"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                  !isFormValid || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? '🔓 Låser upp...' : '🔓 Lås upp detaljerad rapport'}
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Vi använder dina uppgifter endast för att skicka din rapport och relevant information om exit-rådgivning.
                Inga uppgifter delas med tredje part.
              </p>
            </form>
          </div>
        )}

        {/* Detailed Section Reports - Only visible after unlock */}
        {hasUnlockedReport && (
          <div id="detailed-report" className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900">Detaljerad rapport per område</h2>
            </div>
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
        )}

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
