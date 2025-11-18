'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">Exit-Diagnos</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Hur redo är ditt bolag för en exit? Svara på 40 frågor och få en personlig analys av din exit-beredskap.
        </p>
        <button
          onClick={() => router.push('/quiz')}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
        >
          Starta Exit-Diagnos
        </button>
      </div>
    </main>
  );
}
