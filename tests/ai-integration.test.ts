import { config } from 'dotenv';
import { generateExitAnalysis, AnalysisResult } from '../src/core/ai';
import { SectionScore } from '../src/core/types';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testAIAnalysis() {
  console.log('=== AI INTEGRATION TEST ===\n');

  // Mock example payload with mixed section scores
  const mockSections: SectionScore[] = [
    { code: 'ST', label: 'Strategisk Tydlighet', score: 75, averageRaw: 4, questionCount: 4 },
    { code: 'BA', label: 'Bolagsstyrning & Ansvarsfördelning', score: 50, averageRaw: 3, questionCount: 4 },
  ];

  const mockPayload = {
    totalScore: 65,
    sections: mockSections,
    openAnswers: {
      general: 'Vi planerar att sälja bolaget inom 2-3 år',
    },
  };

  console.log('Input payload:');
  console.log(JSON.stringify(mockPayload, null, 2));
  console.log('\nCalling generateExitAnalysis...\n');

  try {
    const result: AnalysisResult = await generateExitAnalysis(mockPayload);

    console.log('=== ANALYSIS RESULT ===\n');
    console.log(JSON.stringify(result, null, 2));

    // Verify structure
    console.log('\n=== VALIDATION ===');

    const hasOverall = typeof result.overall === 'string' && result.overall.length > 0;
    console.log(`✓ Has overall: ${hasOverall ? 'PASS' : 'FAIL'}`);

    const hasPriorities = Array.isArray(result.priorities) && result.priorities.length > 0;
    console.log(`✓ Has priorities array: ${hasPriorities ? 'PASS' : 'FAIL'}`);

    const hasSections = Array.isArray(result.sections) && result.sections.length > 0;
    console.log(`✓ Has sections array: ${hasSections ? 'PASS' : 'FAIL'}`);

    if (result.sections && result.sections.length > 0) {
      const firstSection = result.sections[0];
      const sectionHasCode = typeof firstSection.code === 'string';
      const sectionHasLabel = typeof firstSection.label === 'string';
      const sectionHasSummary = typeof firstSection.summary === 'string';
      const sectionHasRecommendations =
        Array.isArray(firstSection.recommendations) && firstSection.recommendations.length > 0;

      console.log(`✓ Section has code: ${sectionHasCode ? 'PASS' : 'FAIL'}`);
      console.log(`✓ Section has label: ${sectionHasLabel ? 'PASS' : 'FAIL'}`);
      console.log(`✓ Section has summary: ${sectionHasSummary ? 'PASS' : 'FAIL'}`);
      console.log(
        `✓ Section has recommendations: ${sectionHasRecommendations ? 'PASS' : 'FAIL'}`
      );
    }

    const isValidJSON = hasOverall && hasPriorities && hasSections;
    console.log(`\n${isValidJSON ? '✅ ALL CHECKS PASSED' : '❌ VALIDATION FAILED'}`);

    if (!isValidJSON) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  }
}

// Run the test
testAIAnalysis().catch(console.error);
