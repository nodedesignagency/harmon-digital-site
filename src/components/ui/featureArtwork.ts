import type { StaticImageData } from "next/image";

// Every file is named for the card it belongs to, which for four of the six is
// not what the picture shows: card-custom-ai-agents is the lightning bolt,
// card-data-intelligence is the robot, card-workflow-automation is the
// database. Imported under what each picture actually is, so the map below
// reads true.
import arrows from "@public/uploads/images/card-continuous-improvement.png";
import lightning from "@public/uploads/images/card-custom-ai-agents.png";
import robot from "@public/uploads/images/card-data-intelligence.png";
import coin from "@public/uploads/images/card-revenue-optimization.png";
import puzzle from "@public/uploads/images/card-smart-integrations.png";
import database from "@public/uploads/images/card-workflow-automation.png";
import type { FeatureImage } from "@/content/home";

/**
 * The 3D artwork, keyed by what content names it. Two sections draw from it —
 * the feature strip and How It Works — so the six pictures live here once,
 * the same split `clientMarks` makes for the client logos.
 *
 * Total rather than partial, so an image key with no picture behind it is a
 * build error and not a dashed box someone notices on the live site.
 *
 * Each picture has a tint it was drawn to sit on — the coin's orange on peach,
 * the bolt's green on green — and content pairs them: see the `tone` beside
 * each `image` in `content/home.ts`.
 */
export const featureArtwork: Record<FeatureImage, StaticImageData> = {
  agents: robot,
  data: database,
  workflow: lightning,
  integrations: puzzle,
  improvement: arrows,
  revenue: coin,
};
