"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 py-4">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || disabled}
                className="p-1.5 rounded-md text-slate-400 hover:text-black hover:bg-gray-200/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, idx) => {
                if (page === "...") {
                    return (
                        <span
                            key={`dots-${idx}`}
                            className="px-2 text-xs text-slate-400 select-none"
                        >
                            ...
                        </span>
                    );
                }

                const isCurrent = page === currentPage;
                return (
                    <button
                        key={`page-${page}`}
                        type="button"
                        onClick={() => onPageChange(page as number)}
                        disabled={disabled}
                        className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-all ${isCurrent
                                ? "border border-[#14b8a6] text-[#14b8a6] bg-white shadow-xs"
                                : "text-slate-600 hover:bg-gray-200/50 hover:text-black"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || disabled}
                className="p-1.5 rounded-md text-slate-400 hover:text-black hover:bg-gray-200/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}