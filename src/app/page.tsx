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
      </div>
    </main>
  );
}
