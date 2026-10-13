import type { StaticImageData } from "next/image";
import adogy from "@public/uploads/logos/client-adogy.png";
import californiaPsychologyCenter from "@public/uploads/logos/client-california-psychology-center.png";
import etto from "@public/uploads/logos/client-etto.png";
import flume from "@public/uploads/logos/client-flume.png";
import happyEndings from "@public/uploads/logos/client-happy-endings.png";
import hopliteCapital from "@public/uploads/logos/client-hoplite-capital.png";
import mikesFences from "@public/uploads/logos/client-mikes-fences.png";
import neighborsBank from "@public/uploads/logos/client-neighbors-bank.png";
import nobleTelehealth from "@public/uploads/logos/client-noble-telehealth.png";
import producifyx from "@public/uploads/logos/client-producifyx.png";
import reubenOliver from "@public/uploads/logos/client-reuben-oliver.png";
import sunmedGrowers from "@public/uploads/logos/client-sunmed-growers.png";
import trbl from "@public/uploads/logos/client-trbl.png";
import type { ClientMark } from "@/content/clients";

/**
 * The client marks, in one place because two rows carry the same set: the
 * trust strip on the home page and the strip under the quote on contact. They
 * are one set of clients, so a mark added here appears in both rather than
 * being wired into each separately.
 *
 * Content names the mark and this says what it is — the same split the tech
 * stack and the principles make, so the lists stay free of imports.
 *
 * They are ink on nothing, and both strips sit on white, so unlike the marks
 * in `SiteIcons` these never have to follow a surface and a file is the right
 * form for them. The client's originals are white (for their dark site); these
 * are the same files recoloured to the site's ink and trimmed to the artwork.
 */
export const clientMarks: Record<ClientMark, StaticImageData> = {
  producifyx,
  hopliteCapital,
  adogy,
  trbl,
  etto,
  neighborsBank,
  sunmedGrowers,
  mikesFences,
  flume,
  happyEndings,
  californiaPsychologyCenter,
  nobleTelehealth,
  reubenOliver,
};

/**
 * How tall a mark is drawn. The slot's width and the gap beside it are the
 * marquee's own arithmetic and belong to each strip; the height is what makes
 * the two rows read as the same row, so it lives here with the files.
 */
export const MARK_HEIGHT = "h-6";
