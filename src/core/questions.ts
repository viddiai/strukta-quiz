import { Question } from './types';

export const QUESTIONS: Question[] = [
  // ST – Strategi & tajming (2 frågor)
  {
    id: 'st_001',
    section: 'ST',
    sectionLabel: 'Strategi & Tajming',
    text: 'Jag har en tydlig och rationell motivering till varför jag överväger att sälja just nu.',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'st_002',
    section: 'ST',
    sectionLabel: 'Strategi & Tajming',
    text: 'Jag har övervägt scenariot "vänta 3–4 år" och jämfört det med att sälja nu (värde, risk, ork).',
    type: 'likert',
    weight: 1,
  },

  // BA – Bolagets attraktivitet & siffror (1 fråga)
  {
    id: 'ba_001',
    section: 'BA',
    sectionLabel: 'Bolagets Attraktivitet & Siffror',
    text: 'Vi har inte extrem beroenderisk till enstaka kunder, leverantörer eller nyckelpersoner.',
    type: 'likert',
    weight: 1,
  },

  // VP – Värdering, pris & affärsstruktur (2 frågor)
  {
    id: 'vp_001',
    section: 'VP',
    sectionLabel: 'Värdering, Pris & Affärsstruktur',
    text: 'Jag har en realistisk bild av vad marknaden sannolikt skulle värdera bolaget till idag (inte bara en drömsiffra).',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'vp_002',
    section: 'VP',
    sectionLabel: 'Värdering, Pris & Affärsstruktur',
    text: 'Jag har definierat en tydlig lägstanivå där jag hellre avstår affären än accepterar för dåliga villkor.',
    type: 'likert',
    weight: 1,
  },

  // KS – Köparlandskap & köparstrategi (1 fråga)
  {
    id: 'ks_001',
    section: 'KS',
    sectionLabel: 'Köparlandskap & Köparstrategi',
    text: 'Jag har en tydlig bild av vilka typer av köpare som är mest relevanta för mitt bolag (industriella, PE/family office, MBO/MBI).',
    type: 'likert',
    weight: 1,
  },

  // PD – Process & DD-förberedelse (2 frågor)
  {
    id: 'pd_001',
    section: 'PD',
    sectionLabel: 'Process & DD-förberedelse',
    text: 'Jag har en grov plan för hur en försäljningsprocess skulle se ut (steg, tidslinje, huvudaktörer).',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'pd_002',
    section: 'PD',
    sectionLabel: 'Process & DD-förberedelse',
    text: 'Vi har våra viktigaste avtal, policys och nyckeldokument så pass organiserade att de relativt snabbt kan läggas i ett data room.',
    type: 'likert',
    weight: 1,
  },

  // AG – Avtal, garantier & risk (1 fråga)
  {
    id: 'ag_001',
    section: 'AG',
    sectionLabel: 'Avtal, Garantier & Risk',
    text: 'Jag förstår på en grundläggande nivå vad garantier, ansvarstid, cap/basket och W&I-försäkring innebär vid en företagsförsäljning.',
    type: 'likert',
    weight: 1,
  },

  // SK – Skatt & privatekonomi (2 frågor)
  {
    id: 'sk_001',
    section: 'SK',
    sectionLabel: 'Skatt & Privatekonomi',
    text: 'Jag har gjort en första översikt över skatteeffekterna vid en försäljning (exempelvis med hjälp av rådgivare).',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'sk_002',
    section: 'SK',
    sectionLabel: 'Skatt & Privatekonomi',
    text: 'Jag har reflekterat över hur mycket kapital jag behöver för att känna mig ekonomiskt trygg efter affären.',
    type: 'likert',
    weight: 1,
  },

  // LP – Ledning, nyckelpersoner & personal (2 frågor)
  {
    id: 'lp_001',
    section: 'LP',
    sectionLabel: 'Ledning, Nyckelpersoner & Personal',
    text: 'Jag vet vilka 5–10 nyckelpersoner som är kritiska för värdet vid en försäljning.',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'lp_002',
    section: 'LP',
    sectionLabel: 'Ledning, Nyckelpersoner & Personal',
    text: 'Jag har en strategi för att minimera risken att viktiga personer lämnar mitt i eller direkt efter en process.',
    type: 'likert',
    weight: 1,
  },

  // VK – Varumärke, kultur & kundrelationer (3 frågor)
  {
    id: 'vk_001',
    section: 'VK',
    sectionLabel: 'Varumärke, Kultur & Kundrelationer',
    text: 'Jag har en klar bild av hur viktigt det är för mig vad som händer med varumärket efter en försäljning (jämfört med pris).',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'vk_002',
    section: 'VK',
    sectionLabel: 'Varumärke, Kultur & Kundrelationer',
    text: 'Jag har identifierat vilka nyckelkunder som måste hanteras extra varsamt i samband med en försäljning.',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'vk_003',
    section: 'VK',
    sectionLabel: 'Varumärke, Kultur & Kundrelationer',
    text: 'Bolaget har gjort en översyn av alla tillstånd, licenser och regulatoriska krav som gäller för verksamheten.',
    type: 'likert',
    weight: 1,
  },

  // DL – Min roll & livet efter affären (2 frågor)
  {
    id: 'dl_001',
    section: 'DL',
    sectionLabel: 'Min Roll & Livet Efter Affären',
    text: 'Jag har tänkt igenom hur mycket jag faktiskt vill vara kvar operativt efter en försäljning (om alls).',
    type: 'likert',
    weight: 1,
  },
  {
    id: 'dl_002',
    section: 'DL',
    sectionLabel: 'Min Roll & Livet Efter Affären',
    text: 'Jag har en grov plan för vad jag vill göra med min tid när jag inte längre äger/driver bolaget på samma sätt.',
    type: 'likert',
    weight: 1,
  },
];
