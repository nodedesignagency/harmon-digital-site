import { cn } from "@/lib/cn";

/**
 * A 16:9 video, or the frame one will fill.
 *
 * `src` decides which. A video file (.mp4, .webm, .mov) plays in the browser's
 * own player; anything else is treated as an embed URL and framed — use the
 * platform's embed link rather than its page link (YouTube's
 * `youtube.com/embed/<id>`, Vimeo's `player.vimeo.com/video/<id>`, Loom's
 * `loom.com/embed/<id>`, Wistia's `fast.wistia.net/embed/iframe/<id>`). Left
 * empty, it draws the placeholder: the dark frame with the play button, so the
 * page keeps its shape until the video arrives.
 *
 * Full width of whatever holds it at every size; the height follows from 16:9.
 */

type VideoPlayerProps = {
  /** A video file or an embed URL. Empty for the placeholder. */
  src?: string;
  /** A still shown before a video file plays. Ignored for embeds. */
  poster?: string;
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
  title,
  placeholderLabel = "Video coming soon",
  className,
}: VideoPlayerProps) {
  const frame = cn(
    "relative aspect-video w-full overflow-hidden bg-bg-raised",
    className,
  );

  if (src && FILE.test(src)) {
    return (
      <div className={frame}>
        <video
          src={src}
          poster={poster || undefined}
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
  // drawn on, and the play button in the accent: the one thing on it that
  // says "this is a video".
  return (
    <div
      role="img"
      aria-label={`${title}. ${placeholderLabel}.`}
      className={cn(
        frame,
        "flex flex-col items-center justify-center gap-5 border border-fg/10",
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center bg-accent text-accent-fg tablet:size-24"
      >
        <svg
          viewBox="0 0 24 24"
          className="ml-1 size-6 tablet:size-9"
          fill="currentColor"
        >
          <path d="M6 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
        </svg>
      </span>
      <span
        aria-hidden="true"
        className="font-ui text-label tracking-(--tracking-label) text-fg/60 uppercase"
      >
        {placeholderLabel}
      </span>
    </div>
  );
}
