import React from "react";
import { cn } from "@/lib/utils";

export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all",
                className
            )}
            {...props}
        />
    );
}