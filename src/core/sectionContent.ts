export interface SectionContentLevel {
  range: string;
  text: string;
  nextSteps: string[];
}

export interface SectionContent {
  code: string;
  title: string;
  levels: SectionContentLevel[];
}

export const SECTION_CONTENTS: SectionContent[] = [
  {
    code: 'ST',
    title: 'Strategi & tajming – säljer du av rätt skäl vid rätt tillfälle?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en klar och logisk story till varför du överväger försäljning nu, hur alternativen ser ut (sälja vs vänta) och vad du vill uppnå. Du har dessutom en plan B om marknad eller bolag ändrar sig.',
        nextSteps: [
          'Skriv ned din exit-story i max 1 A4 – det blir underlag för rådgivare och köpare.',
          'Testa den mot någon extern (rådgivare/erfaren ägare). Håller logiken?',
          'Säkerställ att styrelse/nyckelpersoner får en samstämmig version när tiden är rätt.',
        ],
      },
      {
        range: '60-79',
        text: 'Du har hyfsad koll på varför du vill sälja, men inte hela logiken paketerad. Du har känsla mer än tydlig kalkyl.',
        nextSteps: [
          'Gör en enkel jämförelse: "sälja nu vs sälja om 3–4 år" (värde, risk, ork, investeringar).',
          'Sätt ord på din primära drivkraft: riskavveckling, frihet, maxpris, göra något nytt?',
          'Definiera ett tidsfönster (t.ex. "inom 18–36 månader") istället för vaga "någon gång".',
        ],
      },
      {
        range: '40-59',
        text: 'Din exit-tanke är mer känslobaserad än rationell: trötthet, frustration, allmän osäkerhet. Du riskerar att gå in i en process utan tydlig strategi.',
        nextSteps: [
          'Lista brutalt ärligt: "Varför vill jag sälja?" vs "Vad händer om jag inte säljer?"',
          'Prata med någon som inte har egen agenda (erfaren ägare/rådgivare) och utmana dig själv.',
          'Bestäm om du är i läget: "Jag vill sälja NU" eller "Jag vill skapa en exit-möjlighet inom 2–3 år" – det är olika spel.',
        ],
      },
      {
        range: '0-39',
        text: 'Du har egentligen ingen tydlig exitstrategi – mer en känsla av "jag vill bort". Risken är extremt hög att du tar första bästa bud, på fel villkor.',
        nextSteps: [
          'Stanna upp. Skriv ned vad du försöker fly ifrån: arbete, risk, konflikt, trötthet, något annat?',
          'Bedöm om det du stör dig på kan lösas med operativa förändringar i stället för försäljning.',
          'Definiera en första tankehorisont: "Vad skulle vara ett bra exitläge om 2 år?" – arbeta baklänges därifrån.',
        ],
      },
    ],
  },
  {
    code: 'BA',
    title: 'Bolagets attraktivitet & siffror – hur ser en köpare på ditt case?',
    levels: [
      {
        range: '80-100',
        text: 'Ditt bolag är väl positionerat för försäljning: siffrorna är tydliga, trenden är minst stabil, beroenderisker är begripliga och case-storyn är logisk.',
        nextSteps: [
          'Gör ett köpar-deck på 5–10 slides: historik, siffror, segment, marginaler, tillväxtcase.',
          'Identifiera 3–5 datapunkter du vill förstärka de kommande 12–24 månaderna (t.ex. återkommande intäkter, kundmix).',
          'Säkerställ att CFO/ekonomiansvarig kan prata lika tydligt om siffrorna som du.',
        ],
      },
      {
        range: '60-79',
        text: 'Grunden är okej, men din story är inte vattentät: siffror, marginaler och beroenden är inte fullt genomlysta.',
        nextSteps: [
          'Ta fram en enkel men ren KPI-bild på 3–5 nyckeltal över 3 år.',
          'Identifiera dina svagaste punkter (kundkoncentration, låg marginal, volatilitet) och börja jobba på dem.',
          'Dokumentera vilka förklaringar du har till svagheter – köpare accepterar problem som är förstådda och adresserade.',
        ],
      },
      {
        range: '40-59',
        text: 'Bolaget kan vara bra, men du har dålig ordning på hur det ser ut på papper. Det är farligt i en DD-situation.',
        nextSteps: [
          'Få fram en ren översikt över: omsättning, EBITDA, kassaflöde, kundmix, bruttomarginal – minst 3 år bak.',
          'Sortera upp bokföring och rapporter så att de tål extern granskning.',
          'Prioritera att åtgärda 1–2 tydliga svagheter (t.ex. förlustaffärer, dåliga avtal, låg prissättning mot vissa kunder).',
        ],
      },
      {
        range: '0-39',
        text: 'En köpare skulle se mer frågetecken än struktur i ditt case just nu. Det är i praktiken inte DD-redo.',
        nextSteps: [
          'Ta hjälp av en kompetent ekonom (intern eller extern) för att få basic struktur på siffrorna.',
          'Fokusera på ordning före optimering: korrekta rapporter, avtalslista, kundöversikt.',
          'Sätt ett enkelt mål: "Inom 12 månader ska jag kunna visa 3 års nyckeltal på ett A4 som jag inte skäms för."',
        ],
      },
    ],
  },
  {
    code: 'VP',
    title: 'Värdering, pris & struktur – vad är bolaget värt och på vilka villkor?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en realistisk värderingsbild, tydliga principer för kontantdel/earn-out och vet var din smärtgräns går.',
        nextSteps: [
          'Sätt ett värderingsspann (låg–bas–hög) och knyt det till netto efter skatt.',
          'Definiera skriftligt: minsta kontantdel, max earn-out-andel, max earn-out-längd, max rullande ägande.',
          'Gå igenom detta med rådgivare så att alla spelar på samma spelplan.',
        ],
      },
      {
        range: '60-79',
        text: 'Du har någon form av värderingsuppfattning, men riskerar att vara för optimistisk eller otydlig kring struktur.',
        nextSteps: [
          'Gör en reality check mot multiplar i din bransch/storlek (via rådgivare).',
          'Skilj på: "vad jag vill ha" vs "vad som sannolikt går att få".',
          'Sätt preliminära principer för struktur, även om de kan justeras senare.',
        ],
      },
      {
        range: '40-59',
        text: 'Din bild av värdering och pris är mer önsketänkande än analys. Strukturfrågorna (earn-out, rulla kvar) är otydliga.',
        nextSteps: [
          'Skriv ner din drömsiffra, realistiska siffra och lägstanivå. Fundera på varför varje nivå skiljer sig.',
          'Diskutera med någon extern vad som är rimligt givet bolagets siffror.',
          'Bestäm om du mentalt är okej med earn-out och/eller att behålla ägarandel – om inte, säg det.',
        ],
      },
      {
        range: '0-39',
        text: 'Du har ingen verklig värderingsbild – bara en siffra i huvudet – och ingen tanke kring struktur. Risk: du blir lätt byte för köpares förhandlingsspel.',
        nextSteps: [
          'Acceptera att du inte kan "känna" fram rätt pris – du behöver underlag.',
          'Ta en enkel värderingsdiskussion med någon som kan M&A i ditt segment.',
          'Definiera en grundregel: "Under X netto efter skatt är jag inte intresserad."',
        ],
      },
    ],
  },
  {
    code: 'KS',
    title: 'Köparlandskap & köparstrategi – vem ska du sälja till?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en klar bild av tänkbara köpare, vet vilka typer du föredrar och varför, och har en genomtänkt strategi för bredden i processen.',
        nextSteps: [
          'Sätt upp en prioriteringslista av köparprofiler/aktörer.',
          'Planera en logisk ordning för kontakt: vem först, vem sen, vem bara vid behov.',
          'Säkerställ att rådgivare förstår vilka köparprofiler du INTE vill att de springer på.',
        ],
      },
      {
        range: '60-79',
        text: 'Du har några köparidéer men bilden är inte komplett. Strategin är mer "vi får se vilka som dyker upp".',
        nextSteps: [
          'Lista industriköpare, finansiella köpare och MBO-alternativ med pros/cons.',
          'Bestäm din "no go"-lista (aktörstyper du helst vill undvika).',
          'Diskutera med rådgivare hur man skapar konkurrens utan att sprida rykten.',
        ],
      },
      {
        range: '40-59',
        text: 'Du har varken karta eller kompass över köparlandskapet. Risk: du fastnar i första bästa dialog.',
        nextSteps: [
          'Gör ett enkelt desktoparbete eller prata med rådgivare om vilka typer av köpare som faktiskt gör deals i ditt segment.',
          'Fundera på vad som spelar störst roll för dig: pris, industriell logik, kultur, personal, långsiktighet.',
          'Bestäm om du vill sikta på ett fåtal kvalificerade köpare eller en bredare ansats – innan processen startar.',
        ],
      },
      {
        range: '0-39',
        text: 'Här är du blind. Du har ingen klar bild av vem som skulle kunna – eller borde – köpa. Det gör dig extremt sårbar.',
        nextSteps: [
          'Ta reda på vilka deals som gjorts i din bransch de senaste åren – vem köper vad?',
          'Prata med minst en rådgivare eller erfaren ägare om möjliga köpartekniker.',
          'Formulera åtminstone en grov preferens: "hellre industriell/hellre PE/hellre MBO".',
        ],
      },
    ],
  },
  {
    code: 'PD',
    title: 'Process & DD-förberedelse – klarar du en riktig försäljningsprocess?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en rimlig processbild, vet vilka internt som ska involveras, och har grundstruktur på dokumentation och DD-material.',
        nextSteps: [
          'Skapa en enkel processplan (Gantt/översikt) med faser och milstolpar.',
          'Bestäm vilka internt som får ingå i "deal team" och säkra deras tid.',
          'Gör en lätt vendor DD-genomgång för att hitta svaga punkter innan köpare gör det.',
        ],
      },
      {
        range: '60-79',
        text: 'Du vet ungefär hur en process funkar men saknar struktur. Dokumentation och data room-redohet är halvfärdig.',
        nextSteps: [
          'Bestäm vilka dokument som måste vara på plats (årsredovisningar, avtal, HR-policy, kundlistor).',
          'Avsätt tid med ekonomi/juridik internt för att börja strukturera mappstrukturen.',
          'Fundera på hur du minimerar störningar på verksamheten under ett intensivt DD-fönster.',
        ],
      },
      {
        range: '40-59',
        text: 'Att kasta dig in i process nu är som att bjuda hem folk på besiktning när huset är halvt under renovering.',
        nextSteps: [
          'Gör en intern lista över allt du idag skulle skämmas över att lämna till en köpare – börja där.',
          'Utse en ansvarig intern DD-koordinator (CFO, COO eller liknande).',
          'Sätt en förberedelseperiod (t.ex. 6–12 månader) för att bygga grundordningen.',
        ],
      },
      {
        range: '0-39',
        text: 'Du är långt ifrån processredo. En aggressiv köpare + DD nu skulle sannolikt mala sönder både dig och organisationen.',
        nextSteps: [
          'Acceptera att du först behöver bygga basic struktur: avtal, rapporter, governance.',
          'Ta hjälp av någon som gjort DD förr – be om en checklista och börja beta av.',
          'Gör inga löften till potentiella köpare om "snabb process" förrän du vet vad du faktiskt kan leverera.',
        ],
      },
    ],
  },
  {
    code: 'AG',
    title: 'Avtal, garantier & risk – hur mycket ansvar tar du efter tillträdet?',
    levels: [
      {
        range: '80-100',
        text: 'Du förstår huvudbegreppen (garantier, ansvarstid, cap/basket, W&I) och har en idé om var dina gränser går.',
        nextSteps: [
          'Dokumentera dina röda linjer för ansvarstid, ansvarstak, undantag.',
          'Diskutera W&I-försäkring och andra riskreducerande strukturer med rådgivare.',
          'Var tydlig med rådgivare från dag 1: "Jag tänker inte skriva på vad som helst bara för att få deal."',
        ],
      },
      {
        range: '60-79',
        text: 'Du har hört ord som garanti, cap, W&I – men inte satt det i relation till din egen riskaptit.',
        nextSteps: [
          'Be din advokat eller rådgivare förklara konkreta worst case-exempel.',
          'Bestäm om du är riskavert eller riskvillig efter exit – justera därifrån.',
          'Förbered dig mentalt på att pris inte är allt; villkoren kan vara minst lika viktiga.',
        ],
      },
      {
        range: '40-59',
        text: 'Du är sårbar här – risken är att du fokuserar på priset och ger bort för mycket i ansvar.',
        nextSteps: [
          'Gör klart för dig själv: "Hur mycket kan jag i värsta fall leva med att betala tillbaka?"',
          'Ta in advokat tidigt – inte när avtalsutkastet redan ligger.',
          'Se till att inte skriva på något indikativt som låser dig mot orimliga villkor senare.',
        ],
      },
      {
        range: '0-39',
        text: 'Du har i princip ingen bild av vad du kan hållas ansvarig för efter att du sålt. Det är direkt farligt.',
        nextSteps: [
          'Sätt som regel: "Jag signerar inget utan att en erfaren M&A-advokat läst igenom det."',
          'Be om en "M&A 101 genomgång" av garantier och ansvar.',
          'Prioritera detta lika högt som priset – annars kan du i praktiken ta över köparens risker.',
        ],
      },
    ],
  },
  {
    code: 'SK',
    title: 'Skatt & privatekonomi – vad får du faktiskt kvar?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en klar bild av skatteutfallet i olika scenarios och hur det påverkar din privatekonomi. Du vet vad du behöver för att vara trygg.',
        nextSteps: [
          'Finslipa din privata "efter exit-budget".',
          'Säkerställ att skatteupplägg är hållbara och lagliga, inte kreativa kortsiktiga genvägar.',
          'Stäm av med rådgivare så att skatte- och exitstruktur lirar med varandra.',
        ],
      },
      {
        range: '60-79',
        text: 'Du har viss koll men det finns fortfarande många "ungefär". Risk: du överskattar vad du får kvar.',
        nextSteps: [
          'Ta fram 3 scenarios: låg, bas, hög köpeskilling och räkna netto efter skatt.',
          'Diskutera med skattejurist/ekonom möjlig förstrukturering (holding, utdelningar, lån).',
          'Bestäm ditt miniminetto – under den nivån är det inte värt affären.',
        ],
      },
      {
        range: '40-59',
        text: 'Du tänker mest på bruttopriset. Skatten är något du "tar sen".',
        nextSteps: [
          'Gör en första grovskiss med hjälp av kunnig rådgivare: "om jag får X, vad blir kvar?"',
          'Fundera på hur din ekonomi ser ut utan bolaget: inkomster, kostnader, skulder.',
          'Definiera ett intervall: "så här mycket behöver jag för att leva det liv jag vill."',
        ],
      },
      {
        range: '0-39',
        text: 'Du är i princip blind på skatte- och privatekonomisidan. Risken är att du gör en "bra affär" på pappret och ändå står svagare privat.',
        nextSteps: [
          'Prioritera ett möte med skattejurist/erfaren privatekonomisk rådgivare.',
          'Ta fram en extremt enkel översikt: tillgångar, skulder, kostnader, inkomster efter exit.',
          'Bestäm: "Vad ska den här affären möjliggöra för mig och min familj rent ekonomiskt?"',
        ],
      },
    ],
  },
  {
    code: 'LP',
    title: 'Ledning, nyckelpersoner & personal – vad händer med människorna?',
    levels: [
      {
        range: '80-100',
        text: 'Du vet exakt vilka personer som är kritiska, har en plan för hur de informeras och hur de kan incitiveras.',
        nextSteps: [
          'Designa ett enkelt exit-incitamentsprogram för nyckelpersoner (bonus, optioner, liknande).',
          'Planera kommunikationen: i vilken ordning berättar du för vem, och med vilket budskap.',
          'Tänk igenom din roll i att "sälja in" ny ägare internt.',
        ],
      },
      {
        range: '60-79',
        text: 'Du har relativt bra koll på nyckelpersoner men ingen sammanhållen plan. Risk: ad hoc-kommunikation vid tryck.',
        nextSteps: [
          'Lista dina tio viktigaste personer och hur en exit påverkar dem.',
          'Fundera på vem som kan bli "deal-bromsare" och vad de behöver för trygghet.',
          'Bestäm när du senast måste involvera ledningen i en process.',
        ],
      },
      {
        range: '40-59',
        text: 'Du vet ungefär vilka som är viktiga, men har inte tänkt på hur en försäljning landar hos dem. Det är en svag punkt.',
        nextSteps: [
          'Rita upp organisationen och markera personer vars avhopp skulle skada en affär.',
          'Reflektera över hur mycket transparens de behöver, och när.',
          'Överväg om någon behöver bindas upp (avtal, bonus, delägarskap) innan process.',
        ],
      },
      {
        range: '0-39',
        text: 'Du har i princip inte tänkt på personalfrågan i exit-kontext. Det är naivt – stor risk för både affärs- och kulturproblem.',
        nextSteps: [
          'Acceptera att mänskliga faktorn kan fälla eller rädda affären.',
          'Identifiera de 3–5 personer du absolut inte vill förlora.',
          'Börja fundera på hur du skapar trygghet och incitament för dem – långt innan du berättar om en konkret affär.',
        ],
      },
    ],
  },
  {
    code: 'VK',
    title: 'Varumärke, kultur & kundrelationer – vad händer med ditt "arv"?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en tydlig bild av hur viktigt arvet är för dig och hur olika köpare skulle påverka varumärke och kunder. Du är klar över var du kan kompromissa.',
        nextSteps: [
          'Sätt ord på din "arvs-policy": vad är ok, vad är inte ok?',
          'Förbered frågor till köpare om deras planer för varumärke, personal och kunder.',
          'Identifiera vilka nyckelkunder som behöver hanteras extra varsamt i kommunikationen.',
        ],
      },
      {
        range: '60-79',
        text: 'Du bryr dig om arvet, men har inte konkretiserat det i krav eller frågor. Risk: du vaknar upp efter affären och ogillar utvecklingen.',
        nextSteps: [
          'Skriv ner vad som skulle göra dig stolt respektive besviken 3 år efter en exit.',
          'Bestäm ett par deal-breakers kopplade till kultur/varumärke.',
          'Fundera på hur mycket du är beredd att "betala" i lägre pris för rätt typ av köpare.',
        ],
      },
      {
        range: '40-59',
        text: 'Arvsfrågan är mer känsla än strategi. Du riskerar att antingen överdriva eller underskatta dess vikt.',
        nextSteps: [
          'Var ärlig: är detta viktigt på riktigt, eller säger du det bara för att det "ska" vara viktigt?',
          'Om det är viktigt: definiera konkreta krav (t.ex. varumärkesanvändning, ort, personalhantering).',
          'Om det inte är så viktigt: våga säga att pris och villkor väger tyngre.',
        ],
      },
      {
        range: '0-39',
        text: 'Du har inte funderat på vad som händer med bolagets själ efter affären. Det kan slå tillbaka hårt på ditt rykte och din egen känsla efteråt.',
        nextSteps: [
          'Bestäm om arvet faktiskt spelar roll för dig – om svaret är nej, acceptera det.',
          'Om ja: skriv ned 3 saker du inte vill se hända med bolaget efter exit.',
          'Ha detta med i diskussioner med både rådgivare och köpare.',
        ],
      },
    ],
  },
  {
    code: 'DL',
    title: 'Din roll & livet efter affären – vad händer med dig?',
    levels: [
      {
        range: '80-100',
        text: 'Du har en realistisk bild av hur mycket du vill vara kvar, hur länge och i vilken roll – och vad du vill göra med ditt liv efteråt.',
        nextSteps: [
          'Kommunicera dina gränser tydligt till rådgivare och köpare.',
          'Se till att avtal och struktur matchar din önskade roll (inte tvärtom).',
          'Fortsätt konkretisera din "andra halvlek" – projekt, investeringar, fritid.',
        ],
      },
      {
        range: '60-79',
        text: 'Du har tänkt på det, men här finns osäkerhet. Risk: du lovar mer än du vill hålla, eller kliver av för tidigt för att bolaget ska må bra.',
        nextSteps: [
          'Fundera ärligt: "Vill jag verkligen vara kvar operativt under en ny ägare?"',
          'Definiera ett max antal år/månader du kan tänka dig.',
          'Gör en enkel plan för dagar utan bolaget – vad fyller du dem med?',
        ],
      },
      {
        range: '40-59',
        text: 'Livet efter exit är mer en tom fläck än en plan. Risken är att du klamrar dig kvar i fel roll eller mår dåligt efteråt.',
        nextSteps: [
          'Beskriv en vanlig vecka "efter exit" – hur ser den ut?',
          'Bestäm om du vill vara ägare/investerare, styrelseproffs, entreprenör igen eller pensionär.',
          'Prata med någon som redan gjort exit om deras baksida av friheten.',
        ],
      },
      {
        range: '0-39',
        text: 'Du har i princip inte tänkt på livet efter affären. Du riskerar att byta bort ett liv du känner till mot ett vakuum.',
        nextSteps: [
          'Ta detta på allvar – tomhet efter exit är vanligt.',
          'Skriv ner 5 saker du skulle vilja ha mer av i livet om pengar och tid inte vore problem.',
          'Se till att exit-villkor inte låser upp dig i en roll du hatar bara för att "det blev så".',
        ],
      },
    ],
  },
];

/**
 * Get section content based on score
 */
export function getSectionContentByScore(sectionCode: string, score: number): SectionContentLevel | null {
  const section = SECTION_CONTENTS.find((s) => s.code === sectionCode);
  if (!section) return null;

  // Determine which level based on score
  if (score >= 80) {
    return section.levels.find((l) => l.range === '80-100') || null;
  } else if (score >= 60) {
    return section.levels.find((l) => l.range === '60-79') || null;
  } else if (score >= 40) {
    return section.levels.find((l) => l.range === '40-59') || null;
  } else {
    return section.levels.find((l) => l.range === '0-39') || null;
  }
}

/**
 * Get section title by code
 */
export function getSectionTitle(sectionCode: string): string {
  const section = SECTION_CONTENTS.find((s) => s.code === sectionCode);
  return section?.title || '';
}
