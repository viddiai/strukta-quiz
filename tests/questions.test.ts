import { QUESTIONS } from '../src/core/questions';

console.log('=== EXIT-DIAGNOS FRÅGOR ===\n');
console.log(`Totalt antal frågor: ${QUESTIONS.length}\n`);

QUESTIONS.forEach((q, index) => {
  console.log(`${index + 1}. [${q.section}] ${q.sectionLabel}`);
  console.log(`   ID: ${q.id}`);
  console.log(`   Fråga: ${q.text}`);
  console.log(`   Typ: ${q.type}, Vikt: ${q.weight}\n`);
});
