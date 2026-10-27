"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { FilterOption, DateRange, getDateRangeForFilter } from "@/lib/utils";

interface DateFilterProps {
    onRangeChange: (range: DateRange, label: string) => void;
}

export function DateFilter({ onRangeChange }: DateFilterProps) {
    const [selected, setSelected] = useState<FilterOption>("today");
    const [isOpen, setIsOpen] = useState(false);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const options: { id: FilterOption; label: string }[] = [
        { id: "today", label: "Today" },
        { id: "7days", label: "Last 7 Days" },
        { id: "month", label: "This Month" },
        { id: "custom", label: "Custom Range" },
    ];

    const handleSelect = (option: FilterOption) => {
        setSelected(option);
        if (option !== "custom") {
            const range = getDateRangeForFilter(option);
            const label = options.find((o) => o.id === option)?.label || "Today";
            onRangeChange(range, label);
            setIsOpen(false);
        }
    };

    const handleApplyCustom = () => {
        if (customStart && customEnd) {
            const range = getDateRangeForFilter("custom", customStart, customEnd);
            onRangeChange(range, `${customStart} to ${customEnd}`);
            setIsOpen(false);
        }
    };

    const currentLabel = options.find((o) => o.id === selected)?.label || "Today";

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-xs transition-colors focus:outline-none"
            >
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>{selected === "custom" && customStart && customEnd ? `${customStart} to ${customEnd}` : currentLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-xl z-40 p-1.5 text-xs">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelect(opt.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${selected === opt.id
                                    ? "bg-slate-100 text-teal-700 font-semibold"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <span>{opt.label}</span>
                                {selected === opt.id && <Check className="w-3.5 h-3.5 text-teal-600" />}
                            </button>
                        ))}

                        {selected === "custom" && (
                            <div className="mt-2 pt-2 border-t border-slate-100 px-2 space-y-2">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Start Date</label>
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">End Date</label>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="w-full text-xs px-2 py-1 rounded border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleApplyCustom}
                                    disabled={!customStart || !customEnd}
                                    className="w-full py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 disabled:opacity-50 transition-colors"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}