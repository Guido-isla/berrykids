export type Activity = {
  slug: string;
  title: string;
  description: string;
  tip?: string;
  category: "sport" | "natuur" | "cultuur" | "indoor" | "dieren";
  subcategory: string;
  location: string;
  area: string;
  ageLabel: string;
  ageMin?: number;
  ageMax?: number;
  price?: string;
  free: boolean;
  website?: string;
  phone?: string;
  openingHours?: string;
  image: string;
  googlePlaceId?: string;
  seekingMembers?: boolean;
  featured?: boolean;
  availableMonths?: number[]; // 1-12; absent = year-round
  verified?: boolean; // true = data manually checked, Berry can recommend
};

export const activities: Activity[] = [
  // ===== VERIFIED ACTIVITIES — Berry can recommend these =====
  {
    slug: "padel-haarlem",
    title: "Peakz Padel Haarlem",
    description:
      "Padelbanen met speciale kidsuren op woensdagmiddag en zaterdagochtend. Clinics voor beginners, rackets te leen. De snelst groeiende sport voor gezinnen.",
    category: "sport",
    subcategory: "Padel",
    location: "Haarlemmerstroom, Haarlem",
    area: "Haarlem",
    ageLabel: "6+ jaar",
    ageMin: 6,
    price: "€15 per uur (baan)",
    free: false,
    website: "https://peakzpadel.nl/locaties/haarlem",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    googlePlaceId: "ChIJIbBFZmXvxUcRDWKLyGu74BA",
    verified: true,
  },
  {
    slug: "teylers-museum",
    title: "Teylers Museum",
    description:
      "Het oudste museum van Nederland met een fantastisch kinderlab. Fossielen, mineralen en wetenschappelijke experimenten. Museumkaart geldig.",
    tip: "Kinderlab is gratis bij je museumticket.",
    category: "cultuur",
    subcategory: "Museum",
    location: "Spaarne 16, Haarlem",
    area: "Haarlem",
    ageLabel: "6 – 12 jaar",
    ageMin: 6,
    ageMax: 12,
    price: "€15 (volwassene + kind)",
    free: false,
    website: "https://www.teylersmuseum.nl",
    openingHours: "Di-zo 10:00 – 17:00",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
    googlePlaceId: "ChIJbeZoEmnvxUcRLdbE56r1Ufo",
    verified: true,
  },
  {
    slug: "frans-hals-museum",
    title: "Frans Hals Museum",
    description:
      "Schetsboek en potloden bij de balie, speciaal voor kinderen. Maandelijks wisselende workshops. Jong en oud ontdekken samen de Gouden Eeuw.",
    category: "cultuur",
    subcategory: "Museum",
    location: "Groot Heiligland 62, Haarlem",
    area: "Haarlem",
    ageLabel: "4+ jaar",
    ageMin: 4,
    price: "€16 / kinderen gratis",
    free: false,
    website: "https://www.franshalsmuseum.nl",
    openingHours: "Di-zo 11:00 – 17:00",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    googlePlaceId: "ChIJO9v2L0DvxUcRdU0VRVnyzUg",
    verified: true,
  },
  {
    slug: "klimhal-haarlem",
    title: "De Klimmuur Haarlem",
    description:
      "Boulderen en klimmen voor kids vanaf 4 jaar. Speciale kinderwanden, klimmuur tot 15 meter. Verjaardagsfeestjes mogelijk. Geen ervaring nodig.",
    category: "sport",
    subcategory: "Klimmen",
    location: "Waarderpolder, Haarlem",
    area: "Haarlem",
    ageLabel: "4+ jaar",
    ageMin: 4,
    price: "€12 per sessie",
    free: false,
    website: "https://www.deklimmuur.nl/vestigingen/klimmuur-haarlem/",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80",
    googlePlaceId: "ChIJIZK8N3rvxUcREwBRVNkA7OY",
    verified: true,
  },
  {
    slug: "kennemerduinen-wandelen",
    title: "Nationaal Park Zuid-Kennemerland",
    description:
      "Vrij toegankelijk duingebied met wandelroutes van 2 tot 12 km. Speciaal voor gezinnen: de Kabouterwandeling (2 km) met opdrachten onderweg. Damherten spotten!",
    category: "natuur",
    subcategory: "Wandelen",
    location: "Overveen / Bloemendaal",
    area: "Overveen",
    ageLabel: "Alle leeftijden",
    free: true,
    website: "https://www.np-zuidkennemerland.nl",
    openingHours: "Dagelijks van zonsopgang tot zonsondergang",
    image: "https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80",
    googlePlaceId: "ChIJdxMUcPruxUcRXACUl51M00M",
    verified: true,
  },
  {
    slug: "zwembad-de-houtvaart",
    title: "Zwembad De Houtvaart",
    description:
      "Overdekt zwembad met apart peuterbad, glijbaan en golfslagbad. Woensdagmiddag: extra speelmateriaal in het water. Zwemlessen vanaf 4 jaar.",
    category: "sport",
    subcategory: "Zwemmen",
    location: "Piet Heinstraat 12, Haarlem",
    area: "Haarlem",
    ageLabel: "Alle leeftijden",
    price: "€5,50 / kinderen €4",
    free: false,
    website: "https://www.sro.nl/zwembad-de-houtvaart/",
    openingHours: "Ma-vr 7:00-21:00, za-zo 9:00-17:00",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
    googlePlaceId: "ChIJuQuxtBnvxUcRs_MpK_TxOTQ",
    verified: true,
  },
  {
    slug: "stadsbibliotheek-haarlem",
    title: "Bibliotheek Haarlem Centrum",
    description:
      "Enorme kinderafdeling met leeshoek, spelcomputers en wekelijks voorleesuurtje. Elke woensdag knutselen, elke zaterdag voorlezen. Gratis met bibpas.",
    category: "indoor",
    subcategory: "Bibliotheek",
    location: "Gasthuisstraat 32, Haarlem",
    area: "Haarlem",
    ageLabel: "Alle leeftijden",
    free: true,
    website: "https://www.bibliotheekzuidkennemerland.nl",
    openingHours: "Ma-za 10:00 – 17:00",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
    googlePlaceId: "ChIJw1ea1hTvxUcRtcejyGtdIGQ",
    verified: true,
  },
  {
    slug: "speeltuin-het-paradijsje",
    title: "Speeltuin Het Paradijsje",
    description:
      "Grote buitenspeeltuin met klimtoestellen, zandbak en waterspeelplek in de zomer. Overdekte ruimte voor slecht weer. Woensdagmiddag pannenkoeken.",
    category: "indoor",
    subcategory: "Speeltuin",
    location: "Schotersingel, Haarlem",
    area: "Haarlem",
    ageLabel: "2 – 10 jaar",
    ageMin: 2,
    ageMax: 10,
    free: true,
    openingHours: "Dagelijks 10:00 – 17:00",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
    googlePlaceId: "ChIJZRlzUBPvxUcREZTvGsnOq_k",
    verified: true,
  },
  {
    slug: "filmschuur-haarlem",
    title: "De Schuur",
    description:
      "Art-house bioscoop en theater met elke zondag een kinderfilm om 14:00. Regelmatig speciale kids-matinees met bijpassende activiteit. Gezellig en intiem.",
    category: "cultuur",
    subcategory: "Bioscoop & Theater",
    location: "Lange Begijnestraat 9, Haarlem",
    area: "Haarlem",
    ageLabel: "4+ jaar",
    ageMin: 4,
    price: "€7,50",
    free: false,
    website: "https://www.schuur.nl",
    openingHours: "Dagelijks, kinderprogramma zo 14:00",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    googlePlaceId: "ChIJPZOnVmnvxUcR0vOyKJgDoIE",
    verified: true,
  },
  {
    slug: "kenamju-haarlem",
    title: "Kenamju Sport Haarlem",
    description:
      "Sportcentrum met onder andere vechtsportlessen voor kinderen. Twee gratis proeflessen. Leren vallen, balans en respect.",
    category: "sport",
    subcategory: "Vechtsport",
    location: "Phoenixstraat 13, Haarlem",
    area: "Haarlem",
    ageLabel: "4+ jaar",
    ageMin: 4,
    price: "€25/maand",
    free: false,
    website: "https://www.kenamju.nl",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    googlePlaceId: "ChIJXxK_TmvvxUcRQGV6Dq-b7ew",
    verified: true,
  },
  {
    slug: "pepsports-zandvoort",
    title: "Pepsports Surfschool Zandvoort",
    description:
      "Wekelijkse surflessen voor kinderen in de zomer. Leren surfen in kleine groepen met ervaren instructeurs. Neopak en board inbegrepen.",
    category: "sport",
    subcategory: "Surfen",
    location: "Boulevard Barnaart 22, Zandvoort",
    area: "Zandvoort",
    ageLabel: "8 – 14 jaar",
    ageMin: 8,
    ageMax: 14,
    price: "€40 per les",
    free: false,
    website: "https://www.pepsports.com",
    image: "https://images.unsplash.com/photo-1502680390548-bdbac40ae4e7?w=800&q=80",
    googlePlaceId: "ChIJYQgu9TvsxUcREPAlvvECxlM",
    availableMonths: [5, 6, 7, 8, 9],
    verified: true,
  },
];
