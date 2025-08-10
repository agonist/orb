import * as React from "react";

import { cn } from "@/lib/utils";
import { useId } from "react";

interface NumberInputProps extends React.ComponentProps<"input"> {
  label?: string;
  bottomLabel?: React.ReactNode;
  readOnly?: boolean;
}

function NumberInput({
  className,
  type,
  label,
  bottomLabel,
  readOnly = false,
  ...props
}: NumberInputProps) {
  const id = useId();

  return (
    <div className="group relative min-w-[300px]">
      <label
        htmlFor={id}
        className="absolute -top-2.5 left-2 block text-xs font-medium text-muted-foreground bg-card px-1 z-10 "
      >
        <span className="inline-flex ">{label}</span>
      </label>
      <div className="">
        <input
          type={type}
          readOnly={readOnly}
          data-slot="input"
          className={cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "transition-all duration-200 ease-in-out",
            "hover:border-ring focus-visible:ring-[0px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ",
            "h-16 pb-4 md:text-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none dark:hover:bg-input/60",
            readOnly &&
              "hover:cursor-default hover:dark:bg-input/30 hover:border-input",
            className
          )}
          {...props}
        />
        <span className="absolute bottom-2 left-3.5 text-xs text-muted-foreground">
          {bottomLabel}
        </span>
      </div>
    </div>
  );
}

export { NumberInput };
