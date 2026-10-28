import { cameFrom } from "@/lib/router";
import { projectAnchorId } from "@/lib/projects";
import { cn } from "@/lib/cn";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Link to the card on the home page. When this page was opened from home, it goes Back instead. */
export function BackLink({
  projectId,
  children,
  className,
}: {
  projectId: string;
  children: string;
  className?: string;
}) {
  return (
    <a
      href={`/#${projectAnchorId(projectId)}`}
      onClick={(event) => {
        if (cameFrom() === "/") {
          event.preventDefault();
          history.back();
        }
      }}
      className={cn(
        "inline-flex h-11 items-center gap-1.5 text-small font-medium text-muted transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowRightIcon size={16} className="rotate-180" />
      {children}
    </a>
  );
}
