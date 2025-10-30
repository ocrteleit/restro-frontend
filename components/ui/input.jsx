import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-black placeholder:text-black/50 selection:bg-black selection:text-white flex h-10 w-full min-w-0 rounded-md nb-border bg-white px-3 py-2 text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm nb-shadow",
        className
      )}
      {...props}
    />
  );
}

export { Input };
