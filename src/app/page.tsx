'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
            Exit-Diagnos
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Hur redo är ditt bolag för en exit? Svara på 18 frågor och få en personlig analys av din exit-beredskap.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <button
            onClick={() => router.push('/quiz')}
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Starta Exit-Diagnos
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">18 frågor</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Kortfattad bedömning som tar mindre än 10 minuter att genomföra
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">10 områden</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Djupgående analys av alla kritiska aspekter i en exit-process
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Direkta insikter</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Få omedelbar feedback och konkreta nästa steg för varje område
            </p>
          </div>
        </div>

        {/* Blurred Process Preview Section */}
        <div className="pt-20 pb-12">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
            {/* Overlay with blur effect */}
            <div className="absolute inset-0 backdrop-blur-md bg-slate-50/80 z-10 flex items-center justify-center">
              <div className="text-center space-y-4 px-6">
                <div className="inline-block p-4 bg-slate-900 rounded-full mb-2">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Fullständig process</h3>
                <p className="text-slate-700 max-w-md mx-auto">
                  Genomför diagnosen för att se hela processen från beslut till bankkonto
                </p>
                <button
                  onClick={() => router.push('/quiz')}
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Starta Exit-Diagnos
                </button>
              </div>
            </div>

            {/* Content behind blur - Process Timeline */}
            <div className="space-y-8 pointer-events-none select-none">
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                Från beslut till bankkonto
              </h2>

              <div className="max-w-3xl mx-auto space-y-8">
                {/* Step 1 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">STEG 1</h3>
                      <span className="text-sm text-amber-700 font-semibold">Analys & Värdering</span>
                    </div>
                    <p className="text-slate-600">
                      Vi sätter en realistisk prisbild och identifierar värdedrivare.
                    </p>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="ml-6 w-0.5 h-8 bg-slate-200"></div>

                {/* Step 2 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">STEG 2</h3>
                      <span className="text-sm text-amber-700 font-semibold">Säljmaterial</span>
                    </div>
                    <p className="text-slate-600">
                      Vi tar fram anonym teaser och djuplodande informationsmemorandum (IM).
                    </p>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="ml-6 w-0.5 h-8 bg-slate-200"></div>

                {/* Step 3 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">STEG 3</h3>
                      <span className="text-sm text-amber-700 font-semibold">Bearbetning</span>
                    </div>
                    <p className="text-slate-600">
                      Vi kontaktar handplockade köpare under strikt sekretess.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
