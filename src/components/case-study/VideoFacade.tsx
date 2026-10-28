import { useEffect, useRef, useState } from "react";
import type { ProjectImage, ProjectVideo } from "@/types/content";
import { youtubeWatchUrl } from "@/lib/projects";
import { ArrowRightIcon, PlayIcon } from "@/components/ui/icons";

/** Click to play: nothing is requested from YouTube until the visitor clicks. */
export function VideoFacade({ video, poster }: { video: ProjectVideo; poster?: ProjectImage }) {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-surface-muted">
        {playing ? (
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play demo video: ${video.title}`}
            className="group absolute inset-0 flex size-full items-center justify-center"
          >
            {poster && (
              <img
                src={poster.src}
                alt=""
                width={poster.width}
                height={poster.height}
                decoding="async"
                className="absolute inset-0 size-full object-cover object-top"
              />
            )}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-background/40 transition-colors group-hover:bg-background/25"
            />
            <span
              aria-hidden="true"
              className="relative flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-raised transition-transform sm:size-20 motion-safe:group-hover:scale-105"
            >
              <PlayIcon size={28} fill="currentColor" className="ml-1" />
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-3 rounded-md border border-border bg-surface/90 px-2 py-1 font-mono text-caption"
            >
              Demo video
            </span>
          </button>
        )}
      </div>
      <a
        href={youtubeWatchUrl(video.youtubeId)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex h-11 items-center gap-1.5 text-small text-muted transition-colors hover:text-foreground"
      >
        Watch on YouTube
        <ArrowRightIcon size={14} className="-rotate-45" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
