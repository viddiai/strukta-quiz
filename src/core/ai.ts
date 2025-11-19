import Anthropic from '@anthropic-ai/sdk';
import { SectionScore } from './types';

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export async function generateExitAnalysis(payload: {
  totalScore: number;
  sections: SectionScore[];
  openAnswers?: Record<string, string>;
}): Promise<AnalysisResult> {
  const client = getClient();

  const systemPrompt = `Du är en erfaren exit-coach för svenska ägare av ägarledda bolag (30-250 Mkr omsättning).

Din uppgift: analysera exit-beredskapen baserat på kvantitativ scoring.

Svara ENDAST med valid JSON i detta exakta format (ingen text utanför JSON):
{
  "overall": "2-3 meningar övergripande bedömning",
  "priorities": ["Prioritet 1", "Prioritet 2", "Prioritet 3"],
  "sections": [
    {
      "code": "ST",
      "label": "Strategi & Tajming",
      "summary": "1-2 meningar om sektionen",
      "recommendations": ["Rekommendation 1", "Rekommendation 2"]
    }
  ]
}

VIKTIGT: Inkludera ENDAST sektioner som har score under 70. Om alla sektioner är över 70, returnera tom array för "sections".`;

  const userContent = `Här är ägarens exit-diagnos resultat:

Total score: ${payload.totalScore}/100

Sektioner:
${payload.sections.map((s) => `- ${s.label} (${s.code}): ${s.score}/100`).join('\n')}

${payload.openAnswers ? `Fritextsvar: ${JSON.stringify(payload.openAnswers)}` : ''}

Analysera och ge strukturerad feedback enligt JSON-formatet.`;

  try {
    console.log('\n=== AI ANALYSIS START ===');
    console.log('Anthropic API Request:');
    console.log('Model: claude-sonnet-4-5-20250929');
    console.log('Max tokens: 4000');
    console.log('System prompt length:', systemPrompt.length);
    console.log('User content length:', userContent.length);
    console.log('User content:', userContent);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    });

    console.log('\nAnthropic API Response received:');
    console.log('Response ID:', response.id);
    console.log('Response model:', response.model);
    console.log('Stop reason:', response.stop_reason);
    console.log('Usage:', JSON.stringify(response.usage, null, 2));
    console.log('Content blocks:', response.content.length);

    let text = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('\nRaw response text (first 500 chars):', text.substring(0, 500));
    console.log('Full response text length:', text.length);

    // Remove markdown code blocks if present
    const originalText = text;
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    if (originalText !== text) {
      console.log('Markdown code blocks removed');
      console.log('Cleaned text (first 500 chars):', text.substring(0, 500));
    }

    if (!text) {
      console.error('ERROR: Empty text after cleanup');
      throw new Error('Tom respons från AI');
    }

    console.log('\nAttempting JSON.parse...');
    const result = JSON.parse(text);
    console.log('JSON parsed successfully');
    console.log('Parsed result structure:', {
      hasOverall: !!result.overall,
      prioritiesCount: Array.isArray(result.priorities) ? result.priorities.length : 'not array',
      sectionsCount: Array.isArray(result.sections) ? result.sections.length : 'not array',
    });

    // Validate the structure
    if (!result.overall || !Array.isArray(result.priorities) || !Array.isArray(result.sections)) {
      console.error('ERROR: Invalid JSON structure');
      console.error('Result:', JSON.stringify(result, null, 2));
      throw new Error('Ogiltig JSON-struktur från AI');
    }

    console.log('Validation passed');
    console.log('=== AI ANALYSIS SUCCESS ===\n');
    return result;
  } catch (error) {
    console.error('\n!!! AI ANALYSIS ERROR !!!');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }

    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('Falling back to default response');
    console.error('=== AI ANALYSIS FAILED ===\n');

    // Return a fallback response
    const fallback = {
      overall: 'Din exit-beredskap har analyserats. Se detaljerad information nedan.',
      priorities: [
        'Fokusera på områden med lägst poäng',
        'Säkerställ att alla dokument är i ordning',
        'Kontakta rådgivare för personlig genomgång',
      ],
      sections: payload.sections
        .filter((s) => s.score < 70)
        .map((s) => ({
          code: s.code,
          label: s.label,
          summary: `Detta område behöver förbättras (${s.score}/100).`,
          recommendations: [
            'Gå igenom frågorna i detta avsnitt igen',
            'Kontakta en rådgivare för specifik hjälp',
          ],
        })),
    };

    console.log('Fallback response:', JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

export interface AnalysisResult {
  overall: string;
  priorities: string[];
  sections: Array<{
    code: string;
    label: string;
    summary: string;
    recommendations: string[];
  }>;
}
