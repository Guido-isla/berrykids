/**
 * Dutch holidays, school vacations, and seasonal data.
 * Region: Noord-Holland (Haarlem area).
 */

type Holiday = {
  date: string; // ISO
  name: string;
  nameEN: string;
  isPublicHoliday: boolean; // officieel vrij
};

type SchoolVacation = {
  name: string;
  nameEN: string;
  start: string; // ISO
  end: string;
};

export type SeasonSuggestion = {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  location: string;
  tips: string[];
  ageLabel: string;
  free: boolean;
  image: string;
  relatedActivitySlugs?: string[];
};

type Season = {
  name: string;
  emoji: string;
  startMonth: number; // 1-12
  endMonth: number;
  suggestions: SeasonSuggestion[];
};

// --- Feestdagen 2026 ---
export const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "Nieuwjaarsdag", nameEN: "New Year's Day", isPublicHoliday: true },
  { date: "2026-04-03", name: "Goede Vrijdag", nameEN: "Good Friday", isPublicHoliday: false },
  { date: "2026-04-05", name: "Eerste Paasdag", nameEN: "Easter Sunday", isPublicHoliday: true },
  { date: "2026-04-06", name: "Tweede Paasdag", nameEN: "Easter Monday", isPublicHoliday: true },
  { date: "2026-04-27", name: "Koningsdag", nameEN: "King's Day", isPublicHoliday: true },
  { date: "2026-05-05", name: "Bevrijdingsdag", nameEN: "Liberation Day", isPublicHoliday: true },
  { date: "2026-05-14", name: "Hemelvaartsdag", nameEN: "Ascension Day", isPublicHoliday: true },
  { date: "2026-05-24", name: "Eerste Pinksterdag", nameEN: "Whit Sunday", isPublicHoliday: true },
  { date: "2026-05-25", name: "Tweede Pinksterdag", nameEN: "Whit Monday", isPublicHoliday: true },
  { date: "2026-12-05", name: "Sinterklaasavond", nameEN: "Sinterklaas Eve", isPublicHoliday: false },
  { date: "2026-12-25", name: "Eerste Kerstdag", nameEN: "Christmas Day", isPublicHoliday: true },
  { date: "2026-12-26", name: "Tweede Kerstdag", nameEN: "Boxing Day", isPublicHoliday: true },
];

// Long weekends: holidays that create extended weekends
const LONG_WEEKENDS: { start: string; end: string; name: string }[] = [
  { start: "2026-04-03", end: "2026-04-06", name: "Paasweekend" },
  { start: "2026-04-25", end: "2026-04-27", name: "Koningsdag weekend" },
  { start: "2026-05-14", end: "2026-05-17", name: "Hemelvaart weekend" },
  { start: "2026-05-23", end: "2026-05-25", name: "Pinksterweekend" },
  { start: "2026-12-24", end: "2026-12-27", name: "Kerstweekend" },
];

// --- Schoolvakanties 2025-2026 Noord-Holland ---
export const SCHOOL_VACATIONS: SchoolVacation[] = [
  { name: "Voorjaarsvakantie", nameEN: "Spring Break", start: "2026-02-14", end: "2026-02-22" },
  { name: "Meivakantie", nameEN: "May Holiday", start: "2026-04-25", end: "2026-05-09" },
  { name: "Zomervakantie", nameEN: "Summer Holiday", start: "2026-07-04", end: "2026-08-16" },
  { name: "Herfstvakantie", nameEN: "Autumn Break", start: "2026-10-17", end: "2026-10-25" },
  { name: "Kerstvakantie", nameEN: "Christmas Holiday", start: "2026-12-19", end: "2027-01-03" },
];

// --- Seizoenen ---
export const SEASONS: Season[] = [
  {
    name: "Lente",
    emoji: "🌷",
    startMonth: 3,
    endMonth: 5,
    suggestions: [
      {
        slug: "fietstocht-bollenstreek",
        title: "Fietstocht Bollenstreek",
        description: "De tulpen en hyacinten staan in bloei — pak de bakfiets!",
        fullDescription: "Elke lente verandert de Bollenstreek in een kleurenpalet van tulpen, hyacinten en narcissen. De route van Haarlem naar Lisse (ca. 25 km) is grotendeels vlak en goed te doen met kinderen in de bakfiets of op hun eigen fiets. Onderweg kom je langs eindeloze bollenvelden, oude boerderijen en gezellige dorpjes waar je kunt stoppen voor een ijsje of pannenkoek.",
        location: "Bollenstreek — start vanuit Haarlem richting Lisse",
        tips: [
          "De bloei is op z'n mooist van half maart tot half mei",
          "Vermijd weekenden als het druk is — doordeweeks is rustiger",
          "Neem de route via Vogelenzang en Noordwijkerhout voor de mooiste velden",
          "Bij Keukenhof kun je de fietsen gratis parkeren",
        ],
        ageLabel: "Alle leeftijden",
        free: true,
        image: "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=800&q=80",
      },
      {
        slug: "duinwandeling-met-kids",
        title: "Duinwandeling met kids",
        description: "Damherten spotten en door het zand rennen in de Kennemerduinen.",
        fullDescription: "Het Nationaal Park Zuid-Kennemerland begint op 10 minuten fietsen van het centrum van Haarlem. De Kabouterwandeling (2 km) is speciaal ontworpen voor gezinnen met jonge kinderen — met opdrachten, zoekplaatjes en een kabouterpad. Oudere kinderen kunnen de langere routes nemen door de duinvalleien, waar je bijna zeker damherten tegenkomt. In het voorjaar zijn de duinen bezaaid met wilde bloemen.",
        location: "Nationaal Park Zuid-Kennemerland, Overveen",
        tips: [
          "Start bij het Bezoekerscentrum in Overveen — daar zijn kaarten en tips",
          "De Kabouterwandeling start ook bij het bezoekerscentrum",
          "Neem verrekijkers mee voor de damherten",
          "Schoenen met profiel zijn handig in het mulle zand",
        ],
        ageLabel: "Alle leeftijden",
        free: true,
        image: "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80",
        relatedActivitySlugs: ["kennemerduinen-wandelen"],
      },
      {
        slug: "lammetjes-aaien",
        title: "Lammetjes aaien",
        description: "Bij de kinderboerderij zijn de lammetjes er weer.",
        fullDescription: "In het voorjaar worden er lammetjes geboren bij de kinderboerderijen in de regio. Bij De Olievaar in Haarlem-Noord en 't Woelige Nest in Bennebroek kun je ze aaien en soms zelfs een flesje geven. De kinderboerderijen organiseren in het voorjaar ook speciale lammetjesdagen met extra activiteiten. Gratis entree, het hele gezin is welkom.",
        location: "Kinderboerderij De Olievaar, Haarlem & 't Woelige Nest, Bennebroek",
        tips: [
          "De lammetjes zijn er van maart tot en met mei",
          "Bel even vooraf of de lammetjes er al zijn — dat verschilt per jaar",
          "Bij De Olievaar is op zaterdag ook ponyrijden (€2)",
          "Neem een picknickkleed mee — er is een mooi grasveld naast de boerderij",
        ],
        ageLabel: "Alle leeftijden",
        free: true,
        image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80",
        relatedActivitySlugs: ["kinderboerderij-de-olievaar", "woelige-nest-bennebroek"],
      },
      {
        slug: "buitenspeeldag",
        title: "Buitenspeeldag",
        description: "Het is lang licht — de speeltuinen zijn open tot laat.",
        fullDescription: "Met de lente wordt het later licht en zijn de speeltuinen weer het centrum van de buurt. Haarlem heeft tientallen speeltuinen, van het grote Paradijsje bij de Schotersingel tot de kleinere buurtspeeltuinen. Veel speeltuinen organiseren in het voorjaar extra activiteiten: knutselmiddagen, buitenspeldagen en pannenkoekenbakken. Check de lokale speeltuin voor het programma.",
        location: "Diverse speeltuinen in Haarlem en omgeving",
        tips: [
          "Speeltuin Het Paradijsje heeft een overdekte ruimte voor als het gaat regenen",
          "De Nationale Buitenspeeldag is elk jaar in juni — extra activiteiten overal",
          "Neem een bal en springtouw mee — de basics zijn het leukst",
          "Op woensdagmiddag is het vaak het gezelligst",
        ],
        ageLabel: "2 – 10 jaar",
        free: true,
        image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
        relatedActivitySlugs: ["speeltuin-de-baarsjes"],
      },
    ],
  },
  {
    name: "Zomer",
    emoji: "☀️",
    startMonth: 6,
    endMonth: 8,
    suggestions: [
      { slug: "stranddag-zandvoort", title: "Stranddag Zandvoort", description: "Zandkastelen, zwemmen en frietjes bij de strandtent.", fullDescription: "Zandvoort is op 20 minuten met de trein vanuit Haarlem. Het strand is breed, de zee is helder, en er zijn genoeg strandtenten met kindermenu's. Tip: ga naar het zuidelijke deel — rustiger en meer ruimte.", location: "Strand Zandvoort", tips: ["Trein vanuit Haarlem duurt 20 min", "Strandtent TIJN heeft een kinderspeelplek", "Zonnebrand factor 50 meenemen"], ageLabel: "Alle leeftijden", free: true, image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80" },
      { slug: "surfles-kids", title: "Surfles voor kids", description: "De golven zijn warm genoeg — boek een proefles!", fullDescription: "Pim Mulder en Pepsports bieden surflessen voor kinderen vanaf 6 jaar. Materiaal (neopak + board) is inbegrepen. In de zomer zijn er wekelijkse groepslessen op zaterdag en zondag.", location: "Strand Zandvoort", tips: ["Boek minstens een week vooruit", "Neopak + board inbegrepen", "Vanaf 6 jaar"], ageLabel: "6+ jaar", free: false, image: "https://images.unsplash.com/photo-1502680390548-bdbac40ae4e7?w=800&q=80", relatedActivitySlugs: ["pim-mulder-surfschool", "zandvoort-surfclub-kids"] },
      { slug: "buitenzwemmen", title: "Buitenzwemmen", description: "De buitenbaden zijn open. Vergeet de zonnebrand niet.", fullDescription: "Het buitenbad van De Houtvaart opent in mei. Er is een apart peuterbad, een glijbaan en veel gras om op te liggen. Op woensdag en vrijdag extra speelmateriaal in het water.", location: "Zwembad De Houtvaart, Haarlem", tips: ["Buitenbad open mei t/m september", "Kinderen €4, volwassenen €5,50", "Woensdagmiddag is het gezelligst"], ageLabel: "Alle leeftijden", free: false, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80", relatedActivitySlugs: ["zwembad-de-houtvaart"] },
      { slug: "zomerfestival", title: "Zomerfestival", description: "Muziek, eten en kinderactiviteiten op de zomerfestivals.", fullDescription: "In de zomer zijn er meerdere gezinsvriendelijke festivals in en rond Haarlem. Van foodtruckfestivals op de Grote Markt tot muziekfestivals in het park — er is altijd iets te doen. Check onze events voor het actuele programma.", location: "Diverse locaties, Haarlem", tips: ["Check onze events pagina voor actuele festivals", "Neem een kleedje en oordopjes voor de kleintjes mee"], ageLabel: "Alle leeftijden", free: true, image: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&q=80" },
    ],
  },
  {
    name: "Herfst",
    emoji: "🍂",
    startMonth: 9,
    endMonth: 11,
    suggestions: [
      { slug: "boswandeling-herfst", title: "Boswandeling", description: "Paddenstoelen zoeken en door de bladeren schoppen.", fullDescription: "De bossen rond Haarlem zijn op hun mooist in de herfst. De Kennemerduinen en het Elswout landgoed kleuren geel en rood. Kinderen kunnen paddenstoelen zoeken (niet plukken!), kastanjes rapen en door de bladeren schoppen.", location: "Kennemerduinen & Elswout, Bloemendaal", tips: ["Laarzen aan — het kan modderig zijn", "Neem een zakje mee voor kastanjes en eikels", "De route via Elswout is het mooist in oktober"], ageLabel: "Alle leeftijden", free: true, image: "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80" },
      { slug: "indoor-speeltuin-herfst", title: "Indoor speeltuin", description: "Als het buiten nat is, zijn de indoor speeltuinen perfect.", fullDescription: "Het Paradijsje heeft een overdekte speelruimte waar kinderen zich kunnen uitleven. Op woensdagmiddag is er extra programma met pannenkoeken.", location: "Speeltuin Het Paradijsje, Haarlem", tips: ["Woensdagmiddag is pannenkoekenmiddag", "Sokken meenemen voor de binnenspeeltuin"], ageLabel: "2 – 10 jaar", free: true, image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80", relatedActivitySlugs: ["speeltuin-de-baarsjes"] },
      { slug: "museum-herfst", title: "Museum met kinderen", description: "Teylers en Frans Hals hebben geweldige kinderprogramma's.", fullDescription: "Teylers Museum heeft een kinderlab waar je zelf proefjes doet. Het Frans Hals Museum geeft schetsboeken uit bij de balie. Beiden bieden maandelijks wisselende workshops aan.", location: "Teylers Museum & Frans Hals Museum, Haarlem", tips: ["Museumkaart geldig bij beiden", "Kinderlab bij Teylers is gratis bij je ticket", "Frans Hals: schetsboek gratis bij de balie"], ageLabel: "4+ jaar", free: false, image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80", relatedActivitySlugs: ["teylers-museum", "frans-hals-museum"] },
      { slug: "halloween-haarlem", title: "Halloween activiteiten", description: "Pompoenen snijden en griezelen op de kinderboerderij.", fullDescription: "Rond Halloween organiseren de kinderboerderijen en speeltuinen in Haarlem griezelactiviteiten. Pompoenen uithollen, verkleden en een spooktocht door het donkere park. Check onze events pagina voor het actuele programma.", location: "Diverse locaties, Haarlem", tips: ["Neem een eigen pompoen mee of koop er een ter plekke", "Verkleedkleren aan — er is vaak een verkledwedstrijd"], ageLabel: "3+ jaar", free: true, image: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800&q=80" },
    ],
  },
  {
    name: "Winter",
    emoji: "❄️",
    startMonth: 12,
    endMonth: 2,
    suggestions: [
      { slug: "schaatsen-haarlem", title: "Schaatsen", description: "Op de ijsbaan of, als het vriest, op de grachten!", fullDescription: "In de winter is er een ijsbaan in Haarlem waar je kunt schaatsen. En als het echt vriest, ligt heel Haarlem op de grachten. Schaatsverhuur is mogelijk bij de ijsbaan.", location: "IJsbaan Haarlem / Grachten", tips: ["Schaatsverhuur beschikbaar", "Warme chocolademelk bij de kraam"], ageLabel: "Alle leeftijden", free: false, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80" },
      { slug: "kerstmarkt-haarlem", title: "Kerstmarkt bezoeken", description: "Warme chocomel en kerstsfeer in de Haarlemse binnenstad.", fullDescription: "De Haarlemse binnenstad wordt in december omgetoverd tot een kerstsfeer met marktkramen, lichtjes en live muziek. De Grote Markt en het Verweyhal-plein zijn het centrum van de kerstmarkt.", location: "Binnenstad, Haarlem", tips: ["Meestal in het tweede weekend van december", "Op vrijdagavond is het het sfeervollst"], ageLabel: "Alle leeftijden", free: true, image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&q=80" },
      { slug: "museum-winter", title: "Museumbezoek", description: "Binnen is het warm — ontdek de musea met een kinderroute.", fullDescription: "Teylers Museum en Frans Hals Museum hebben in de winter speciale kinderprogramma's. Binnen is het warm, en de kinderroutes maken het leuk voor alle leeftijden.", location: "Teylers Museum & Frans Hals Museum, Haarlem", tips: ["Museumkaart geldig", "Check de website voor winterworkshops"], ageLabel: "4+ jaar", free: false, image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80", relatedActivitySlugs: ["teylers-museum", "frans-hals-museum"] },
      { slug: "knutselen-winter", title: "Binnen knutselen", description: "Creatieve workshops in de winter zijn altijd een hit.", fullDescription: "De bibliotheek en diverse ateliers in Haarlem bieden in de winter knutselworkshops aan. Van kerststukjes maken tot winterdieren knutselen — er is altijd iets creatiefs te doen.", location: "Bibliotheek Haarlem & diverse ateliers", tips: ["De bieb heeft op woensdag gratis knutselmiddag", "Check ook de Dakkas voor creatieve workshops"], ageLabel: "3+ jaar", free: true, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
    ],
  },
];

// --- Lookup functies ---

export function getHoliday(date: string): Holiday | undefined {
  return HOLIDAYS_2026.find((h) => h.date === date);
}

export function getHolidayWindow(date: string): Holiday | undefined {
  // Check if we're within 1 day of a holiday (for "morgen is het...")
  const d = new Date(date + "T00:00:00");
  for (let offset = 0; offset <= 1; offset++) {
    const check = new Date(d);
    check.setDate(check.getDate() + offset);
    const iso = check.toISOString().split("T")[0];
    const holiday = HOLIDAYS_2026.find((h) => h.date === iso);
    if (holiday) return holiday;
  }
  return undefined;
}

export function getLongWeekend(date: string): { name: string } | undefined {
  return LONG_WEEKENDS.find((lw) => date >= lw.start && date <= lw.end);
}

export function getSchoolVacation(date: string): SchoolVacation | undefined {
  return SCHOOL_VACATIONS.find((v) => date >= v.start && date <= v.end);
}

export function getVacationWeekNumber(date: string, vacation: SchoolVacation): number {
  const start = new Date(vacation.start + "T00:00:00");
  const current = new Date(date + "T00:00:00");
  const diff = current.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export function getSeason(date: string): Season {
  const month = new Date(date + "T00:00:00").getMonth() + 1;
  return (
    SEASONS.find((s) => {
      if (s.startMonth <= s.endMonth) {
        return month >= s.startMonth && month <= s.endMonth;
      }
      return month >= s.startMonth || month <= s.endMonth;
    }) || SEASONS[0]
  );
}

export function getAllSuggestions(): SeasonSuggestion[] {
  return SEASONS.flatMap((s) => s.suggestions);
}

export function getSuggestionBySlug(slug: string): (SeasonSuggestion & { seasonName: string; seasonEmoji: string }) | undefined {
  for (const season of SEASONS) {
    const found = season.suggestions.find((s) => s.slug === slug);
    if (found) return { ...found, seasonName: season.name, seasonEmoji: season.emoji };
  }
  return undefined;
}
