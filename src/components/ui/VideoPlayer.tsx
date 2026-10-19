import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

/**
 * A 16:9 video — or a 9:16 one, for a clip shot on a phone — or the frame one
 * will fill.
 *
 * `src` decides which. A video file (.mp4, .webm, .mov) plays in the browser's
 * own player; anything else is treated as an embed URL and framed — use the
 * platform's embed link rather than its page link (YouTube's
 * `youtube.com/embed/<id>`, Vimeo's `player.vimeo.com/video/<id>`, Loom's
 * `loom.com/embed/<id>`, Wistia's `fast.wistia.net/embed/iframe/<id>`). Left
 * empty, it draws the placeholder: the dark frame with the play button — over
 * the poster, when there is one — so the page keeps its shape until the video
 * arrives.
 *
 * Full width of whatever holds it at every size; the height follows from the
 * aspect.
 */

type VideoPlayerProps = {
  /** A video file or an embed URL. Empty for the placeholder. */
  src?: string;
  /**
   * A still shown before a video file plays, and under the placeholder's play
   * button while there is no video. Ignored for embeds.
   */
  poster?: string | StaticImageData;
  /**
   * `landscape` (16:9) by default; `portrait` (9:16) for a phone clip; `fill`
   * takes whatever height its holder gives it, cropping to cover.
   */
  aspect?: "landscape" | "portrait" | "fill";
  /** What the video is, for assistive tech and the embed's frame title. */
  title: string;
  /** The line under the play button while there is no video. */
  placeholderLabel?: string;
  className?: string;
};

const FILE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;

export function VideoPlayer({
  src,
  poster,
  aspect = "landscape",
  title,
  placeholderLabel = "Video coming soon",
  className,
}: VideoPlayerProps) {
  const frame = cn(
    "relative w-full overflow-hidden bg-bg-raised",
    aspect === "portrait" && "aspect-[9/16]",
    aspect === "landscape" && "aspect-video",
    className,
  );
  const posterSrc = typeof poster === "string" ? poster : poster?.src;

  if (src && FILE.test(src)) {
    return (
      <div className={frame}>
        <video
          src={src}
          poster={posterSrc || undefined}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          className="size-full object-cover"
        />
      </div>
    );
  }

  if (src) {
    return (
      <div className={frame}>
        <iframe
          src={src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    );
  }

  // The placeholder. A hairline so the frame reads on the dark ground it is
  // drawn on, and a plain play button — a white disc, the dark triangle in it
  // — the one thing on it that says "this is a video". A poster goes under
  // both, behind a scrim so the label stays legible on whatever the still is.
  return (
    <div
      role="img"
      aria-label={`${title}. ${placeholderLabel}.`}
      className={cn(
        frame,
        "flex flex-col items-center justify-center gap-5 border border-fg/10",
      )}
    >
      {poster ? (
        <>
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-bg/35" />
        </>
      ) : null}
      <span
        aria-hidden="true"
        className="relative flex size-16 items-center justify-center rounded-full bg-bg-white text-bg tablet:size-20"
      >
        {/* Optically centred, not boxed: a triangle's weight sits toward its
            flat side, so centring its bounding box looks pushed right, and
            centring its centroid looks pushed left. The box sits about a
            unit right of the disc's centre, which is where it reads as
            centred. */}
        <svg viewBox="0 0 24 24" className="size-7 tablet:size-8" fill="currentColor">
          <path d="M6 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative font-ui text-label tracking-(--tracking-label) uppercase",
          poster ? "text-fg" : "text-fg/60",
        )}
      >
        {placeholderLabel}
      </span>
    </div>
  );
}
