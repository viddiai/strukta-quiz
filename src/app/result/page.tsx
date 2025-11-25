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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg">Laddar resultat...</p>
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
    if (score < 40) return 'text-red-700 bg-red-50';
    if (score < 70) return 'text-amber-700 bg-amber-50';
    return 'text-green-700 bg-green-50';
  };

  const getScoreBorderColor = (score: number) => {
    if (score < 40) return 'border-red-200';
    if (score < 70) return 'border-amber-200';
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero section */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 sm:p-12 mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Din Exit-Diagnos</h1>
          <div className="mb-6">
            <div className={`inline-flex items-baseline text-7xl sm:text-8xl font-bold mb-2 px-8 py-4 rounded-2xl ${getScoreColor(totalScore)}`}>
              {totalScore}
              <span className="text-3xl sm:text-4xl ml-2">/100</span>
            </div>
          </div>
          <p className="text-xl sm:text-2xl text-slate-700 font-semibold">{getScoreLabel(totalScore)}</p>
        </div>

        {/* Section scores table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Områdesöversikt</h2>
          <div className="space-y-4">
            {sortedSections.map((section) => (
              <div
                key={section.code}
                className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 rounded-xl border-2 ${getScoreBorderColor(
                  section.score
                )} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h3 className="font-semibold text-lg text-slate-900">{section.label}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {section.questionCount} {section.questionCount === 1 ? 'fråga' : 'frågor'} • Genomsnitt: {section.averageRaw.toFixed(1)}/5
                  </p>
                </div>
                <div className={`text-2xl sm:text-3xl font-bold px-5 py-3 rounded-lg ${getScoreColor(section.score)} self-start sm:self-auto`}>
                  {Math.round(section.score)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Din personliga analys</h2>

          {/* Overall assessment */}
          <div className="mb-8">
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">{analysis.overall}</p>
          </div>

          {/* Priorities */}
          <div className="border-t-2 border-amber-100 pt-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Prioriterade åtgärder</h3>
            <ol className="list-decimal list-inside space-y-3">
              {analysis.priorities.map((priority, index) => (
                <li key={index} className="text-slate-700 text-base sm:text-lg pl-2 leading-relaxed">
                  {priority}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Unlock Report Form */}
        {!hasUnlockedReport && (
          <div className="bg-gradient-to-br from-amber-50 to-slate-100 rounded-xl shadow-lg p-8 mb-8 border-2 border-amber-200">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Lås upp din detaljerade rapport</h2>
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                För att få tillgång till den fullständiga analysen med konkreta nästa steg för varje område,
                vänligen fyll i dina uppgifter nedan.
              </p>
            </div>

            <form onSubmit={handleUnlockReport} className="max-w-md mx-auto space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Namn *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  placeholder="Ditt för- och efternamn"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  placeholder="din.epost@foretag.se"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                  Företag *
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={userInfo.company}
                  onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  placeholder="Ditt företagsnamn"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  !isFormValid || isSubmitting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? '🔓 Låser upp...' : '🔓 Lås upp detaljerad rapport'}
              </button>

              <p className="text-xs text-slate-600 text-center mt-4 leading-relaxed">
                Vi använder dina uppgifter endast för att skicka din rapport och relevant information om exit-rådgivning.
                Inga uppgifter delas med tredje part.
              </p>
            </form>
          </div>
        )}

        {/* Detailed Section Reports - Only visible after unlock */}
        {hasUnlockedReport && (
          <div id="detailed-report" className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Detaljerad rapport per område</h2>
            </div>
            <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
              Nedan får du en djupare analys av varje område baserat på din nuvarande nivå.
            </p>

            <div className="space-y-5">
              {sortedSections.map((section) => {
                // Skip sections without content
                if (!section.content || !section.content.text || !section.content.nextSteps) {
                  return null;
                }

                const isExpanded = expandedSections.has(`detail-${section.code}`);

                return (
                  <div key={`detail-${section.code}`} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all">
                    <button
                      onClick={() => toggleSection(`detail-${section.code}`)}
                      className="w-full flex justify-between items-center p-5 sm:p-6 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-lg text-xl font-bold ${getScoreColor(section.score)}`}>
                          {Math.round(section.score)}
                        </span>
                        <div className="text-left">
                          <h3 className="font-bold text-slate-900 text-lg sm:text-xl">{section.title || section.label}</h3>
                          <p className="text-sm text-slate-600 mt-1">Nivå: {section.content?.range || 'N/A'} poäng</p>
                        </div>
                      </div>
                      <svg
                        className={`w-6 h-6 text-slate-500 transition-transform flex-shrink-0 ${
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
                      <div className="px-5 sm:px-6 pb-6 bg-slate-50 border-t-2 border-slate-100">
                        <div className="pt-6">
                          <h4 className="font-semibold text-slate-900 mb-3 text-base sm:text-lg">Din nuvarande situation</h4>
                          <p className="text-slate-700 text-base leading-relaxed mb-8">{section.content.text}</p>

                          <h4 className="font-semibold text-slate-900 mb-4 text-base sm:text-lg">Nästa steg</h4>
                          <ul className="space-y-4">
                            {section.content.nextSteps.map((step, index) => (
                              <li key={index} className="flex gap-3">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center text-sm font-semibold">
                                  {index + 1}
                                </span>
                                <span className="text-slate-700 pt-0.5 text-base leading-relaxed">{step}</span>
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
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-xl p-8 sm:p-10 mb-8 text-white border-t-4 border-amber-700">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Vad gör du med den här insikten nu?</h2>
          <p className="mb-6 text-slate-200 text-base sm:text-lg leading-relaxed">
            Diagnosen är inte till för att säga &ldquo;sälj&rdquo; eller &ldquo;sälj inte&rdquo;, utan för att visa var du behöver
            bli skarpare innan du ger dig in i en av ditt livs viktigaste affärer.
          </p>
          <div className="space-y-3 mb-8 text-slate-100">
            <p className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Din totala score</strong> – hur nära är du ett realistiskt exitläge?</span>
            </p>
            <p className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Dina 3 svagaste områden</strong> – det är där värdet riskerar att rinna ut</span>
            </p>
          </div>
          <p className="text-slate-200 mb-3 font-semibold">Vill du gå vidare kan du:</p>
          <ul className="space-y-2 text-slate-100 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>Göra en konkret 12–24 månaders förberedelseplan utifrån svagaste områdena</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>Ta in rätt typ av rådgivare med ett tydligt uppdrag</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400">•</span>
              <span>Använda insikterna här som underlag i styrelse, ägarmöten och diskussioner med familj</span>
            </li>
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6">Nästa steg</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => hasUnlockedReport && generatePDF(data)}
              disabled={!hasUnlockedReport}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                hasUnlockedReport
                  ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {hasUnlockedReport ? 'Ladda ner PDF-rapport' : '🔒 Lås upp för att ladda ner PDF'}
            </button>
            <a
              href="mailto:kontakt@exitdiagnos.se?subject=Boka rådgivning - Exit-diagnos"
              className="flex-1 px-6 py-4 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition-all duration-200 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Boka rådgivning
            </a>
          </div>
          {!hasUnlockedReport && (
            <p className="text-sm text-amber-700 font-medium mt-4 text-center leading-relaxed">
              ⬆️ Fyll i formuläret ovan för att låsa upp PDF-nedladdning
            </p>
          )}
          {hasUnlockedReport && (
            <p className="text-sm text-slate-600 mt-6 text-center leading-relaxed">
              Vill du diskutera ditt resultat? Boka ett kostnadsfritt samtal med en av våra
              exit-rådgivare.
            </p>
          )}
        </div>

        {/* Back to start */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem('exitDiagnosisResult');
              router.push('/');
            }}
            className="text-slate-600 hover:text-slate-900 font-medium underline transition-colors"
          >
            Tillbaka till start
          </button>
        </div>
      </div>
    </div>
  );
}
