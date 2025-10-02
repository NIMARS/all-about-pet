import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-md p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("mt-2 text-base text-gray-700", className)} {...props}>
      {children}
    </div>
  );
}
