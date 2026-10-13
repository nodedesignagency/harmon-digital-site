/**
 * The client marks — one list, read by the home page's trust strip and the
 * contact page's row, so a client added here appears in both.
 *
 * The thirteen on Harmon Digital's current site, in its order. `mark` names
 * the file (see `components/ui/clientMarks.ts`); `name` is what a screen reader
 * gets, since a mark in a marquee says nothing on its own.
 */
export const clientLogos = [
  { name: "ProducifyX", mark: "producifyx" },
  { name: "Hoplite Capital Management", mark: "hopliteCapital" },
  { name: "Adogy", mark: "adogy" },
  { name: "TRBL", mark: "trbl" },
  { name: "Etto Leisure Carts", mark: "etto" },
  { name: "Neighbors Bank", mark: "neighborsBank" },
  { name: "SunMed Growers", mark: "sunmedGrowers" },
  { name: "Mike’s Fences", mark: "mikesFences" },
  { name: "Flume Internet", mark: "flume" },
  { name: "Happy Endings", mark: "happyEndings" },
  { name: "California Psychology Center", mark: "californiaPsychologyCenter" },
  { name: "Noble TeleHealth", mark: "nobleTelehealth" },
  { name: "Reuben Oliver", mark: "reubenOliver" },
] as const;

/** Keys the strips use to pick a client's mark. */
export type ClientMark = (typeof clientLogos)[number]["mark"];
