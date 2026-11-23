import { useEffect, useRef, useState } from "react";
import type { ProjectImage, ProjectVideo } from "@/types/content";
import { youtubeWatchUrl } from "@/lib/projects";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
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
      <BrowserFrame>
        <div className="relative aspect-video">
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
              className="group absolute inset-0 flex size-full items-center justify-center focus-visible:outline-offset-[-4px]"
            >
              {/* The whole screenshot, uncropped, on the frame colour (the player stays 16:9). */}
              {poster && (
                <img
                  src={poster.src}
                  alt=""
                  width={poster.width}
                  height={poster.height}
                  decoding="async"
                  fetchPriority="high"
                  className="absolute inset-0 size-full object-contain"
                />
              )}
              <span
                aria-hidden="true"
                className="relative flex size-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-overlay ring-4 ring-surface/70 transition-[background-color,scale] group-hover:bg-accent-hover sm:size-20 motion-safe:group-hover:scale-105"
              >
                <PlayIcon size={28} fill="currentColor" className="ml-1" />
              </span>
            </button>
          )}
        </div>
      </BrowserFrame>
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
