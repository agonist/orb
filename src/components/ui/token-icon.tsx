import { useState } from "react";
import { cn } from "@/lib/utils";

type TokenIconProps = {
  src?: string | null;
  alt?: string;
  className?: string;
};

export function TokenIcon({ src, alt = "token", className }: TokenIconProps) {
  const [errored, setErrored] = useState(false);

  const resolvedSrc = !src
    ? undefined
    : src.startsWith("http")
      ? src
      : `/icons/${src}`;

  if (!resolvedSrc || errored) {
    return (
      <div
        aria-label={alt}
        className={cn(
          "rounded-full bg-muted text-muted-foreground/80 flex items-center justify-center",
          className
        )}
      >
        <span className="text-xs">?</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={cn("rounded-full", className)}
      onError={() => setErrored(true)}
    />
  );
}
