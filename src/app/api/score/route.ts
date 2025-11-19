import { NextResponse } from 'next/server';
import { computeSectionScores, computeTotalScore } from '@/core/scoring';
import { generateExitAnalysis } from '@/core/ai';
import { getSectionContentByScore, getSectionTitle } from '@/core/sectionContent';
import type { Answers } from '@/core/types';

export async function POST(request: Request) {
  console.log('\n========== NEW API REQUEST ==========');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Log incoming request
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));

    const { answers, openAnswers } = body as {
      answers: Answers;
      openAnswers?: Record<string, string>;
    };

    console.log('Parsed answers count:', Object.keys(answers).length);
    console.log('Has openAnswers:', !!openAnswers);

    // 1. Beräkna scores (deterministiskt)
    console.log('\n--- STEP 1: Computing section scores ---');
    const sectionScores = computeSectionScores(answers);
    console.log('Section scores computed:', JSON.stringify(sectionScores, null, 2));

    console.log('\n--- STEP 2: Computing total score ---');
    const totalScore = computeTotalScore(sectionScores);
    console.log('Total score:', totalScore);

    // 2. Generera AI-analys
    console.log('\n--- STEP 3: Generating AI analysis ---');
    console.log('Calling generateExitAnalysis with payload:', JSON.stringify({
      totalScore,
      sectionCount: sectionScores.length,
      hasOpenAnswers: !!openAnswers,
    }, null, 2));

    const analysis = await generateExitAnalysis({
      totalScore,
      sections: sectionScores,
      openAnswers,
    });

    console.log('AI analysis received:', JSON.stringify(analysis, null, 2));

    // 3. Lägg till detaljerad sektionstext för varje sektion
    console.log('\n--- STEP 4: Adding detailed section content ---');
    const sectionsWithContent = sectionScores.map((section) => {
      const content = getSectionContentByScore(section.code, section.score);
      const title = getSectionTitle(section.code);

      return {
        ...section,
        title,
        content: content
          ? {
              text: content.text,
              nextSteps: content.nextSteps,
              range: content.range,
            }
          : null,
      };
    });
    console.log('Section content added for all sections');

    // 4. Returnera komplett resultat
    console.log('\n--- STEP 5: Returning response ---');
    const response = {
      success: true,
      data: {
        totalScore,
        sectionScores: sectionsWithContent,
        analysis,
      },
    };
    console.log('Response data prepared successfully');
    console.log('========== REQUEST COMPLETED SUCCESSFULLY ==========\n');

    return NextResponse.json(response);
  } catch (error) {
    console.error('\n!!!!!!!!! ERROR OCCURRED !!!!!!!!!');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }

    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('========== REQUEST FAILED ==========\n');

    return NextResponse.json(
      { success: false, error: 'Något gick fel vid beräkning' },
      { status: 500 }
    );
  }
}
