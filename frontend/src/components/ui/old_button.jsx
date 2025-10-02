import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-primary text-white hover:bg-primary-dark",
      outline: "border border-input text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
