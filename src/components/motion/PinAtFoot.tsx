"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * A dark opening that pins by its foot, for a scroll stack whose opening is
 * taller than the screen.
 *
 * The site's handover pins the opening with `sticky top-0` and lets what
 * follows ride up over it. That only works for an opening that fits the
 * screen: a taller one pinned by its top never lets its own lower half scroll
 * into view. This one scrolls normally until its foot meets the bottom of the
 * screen and holds there — `top` is the screen's height less its own, which is
 * negative exactly when it is taller — so the reader sees all of it before the
 * next section starts to cover it. One that fits pins at the top, as usual.
 *
 * Its own height is the only thing measured, through a ResizeObserver; nothing
 * reads the scroll. Until that first measurement it has no `top`, so it is not
 * pinned at all: without script the page is the plain version, never one
 * with half the opening hidden under the next section.
 *
 * Renders a `section`, and passes everything else through — `data-bg` and the
 * rest of the section's own attributes go on it as they would on a plain one.
 */
export function PinAtFoot({
  className,
  style,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn("sticky", className)}
      style={{
        ...style,
        top: height === null ? undefined : `min(0px, calc(100svh - ${height}px))`,
      }}
      {...props}
    />
  );
}
