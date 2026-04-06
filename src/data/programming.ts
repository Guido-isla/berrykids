/** Film, theater, and concert programming — updated weekly */

export type FilmShowtime = {
  title: string;
  cinema: string;
  times: string[];
  ageLabel: string;
  description: string;
  image: string;
};

export type TheaterShow = {
  title: string;
  venue: string;
  date: string;
  time: string;
  ageLabel: string;
  price: string;
  description: string;
  ticketUrl?: string;
  imageUrl?: string;
};

export const filmVanDeWeek: FilmShowtime = {
  title: "Sonic the Hedgehog 4",
  cinema: "Filmschuur, Haarlem",
  times: ["Zo 14:00", "Wo 14:30"],
  ageLabel: "6+ jaar",
  description:
    "Sonic is terug in een nieuw avontuur. Snelle actie, grappig voor de hele familie. Draait deze week in de Filmschuur.",
  image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
};

export const theaterAgenda: TheaterShow[] = [
  {
    title: "De Kleine Zeemeermin — Musical",
    venue: "Stadsschouwburg Haarlem",
    date: "2026-04-12",
    time: "14:30",
    ageLabel: "4+ jaar",
    price: "€12,50",
    description: "Schitterende familiemusical met live orkest. Duur: 70 min.",
    ticketUrl: "#",
  },
  {
    title: "Kindervoorstelling: Kikker",
    venue: "Patronaat, Haarlem",
    date: "2026-04-19",
    time: "11:00",
    ageLabel: "2 – 6 jaar",
    price: "€8",
    description: "Max Velthuijs' Kikker komt tot leven op het podium. Interactief en kort (40 min).",
    ticketUrl: "#",
  },
  {
    title: "Philharmonie Familieconcert: Peter en de Wolf",
    venue: "Philharmonie Haarlem",
    date: "2026-04-26",
    time: "14:00",
    ageLabel: "5+ jaar",
    price: "€10",
    description: "Het Noord-Hollands Orkest speelt Prokofjevs klassieker met verteller. Geweldig voor de eerste keer in een concertzaal.",
    ticketUrl: "#",
  },
  {
    title: "Poppentheater: De Draak van Drakensteyn",
    venue: "Theater De Liefde, Haarlem",
    date: "2026-05-03",
    time: "15:00",
    ageLabel: "3 – 7 jaar",
    price: "€7,50",
    description: "Spannend en grappig poppentheater. De kinderen mogen na afloop achter de schermen kijken.",
  },
  {
    title: "Stadsschouwburg Jeugdtheater: Matilda",
    venue: "Stadsschouwburg Haarlem",
    date: "2026-05-10",
    time: "14:30",
    ageLabel: "6+ jaar",
    price: "€15",
    description: "Roald Dahls Matilda als theatervoorstelling. Energiek, muzikaal en inspirerend.",
    ticketUrl: "#",
  },
];
