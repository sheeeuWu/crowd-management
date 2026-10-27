"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EntryExitRecord } from "@/types/api";
import { Users } from "lucide-react";

interface EntriesTableProps {
    records?: EntryExitRecord[];
    isLoading?: boolean;
}

function formatTimeString(localStr?: string | null): string {
    if (!localStr) return "--";
    const parts = localStr.split(" ");
    if (parts.length < 2) return localStr;
    const [h, m] = parts[1].split(":");
    const hourNum = parseInt(h, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${String(displayHour).padStart(2, "0")}:${m} ${ampm}`;
}

function formatDwell(minutes?: number | null): string {
    if (minutes === null || minutes === undefined) return "--";
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function EntriesTable({ records = [], isLoading }: EntriesTableProps) {
    if (isLoading) {
        return (
            <Card className="p-6 bg-white overflow-hidden shadow-xs">
                <div className="space-y-4">
                    <div className="grid grid-cols-5 pb-3 border-b border-slate-100">
                        {["Name", "Sex", "Entry", "Exit", "Dwell Time"].map((col) => (
                            <Skeleton key={col} className="h-4 w-20" />
                        ))}
                    </div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                        <div
                            key={row}
                            className="grid grid-cols-5 items-center py-2.5 border-b border-slate-50 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <Skeleton className="h-4 w-14" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-14" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (records.length === 0) {
        return (
            <Card className="p-12 text-center bg-white">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-md font-bold text-black">No Visitor Records Found</h4>
                <p className="text-sm text-slate-700 mt-1">
                    No crowd entries or exits were recorded for the selected site and date range.
                </p>
            </Card>
        );
    }

    return (
        <Card className="bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-sm font-semibold text-black bg-[#E8E8E8]">
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">Sex</th>
                            <th className="py-4 px-6">Entry</th>
                            <th className="py-4 px-6">Exit</th>
                            <th className="py-4 px-6">Dwell Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                        {records.map((record) => {
                            const isStillInside = !record.exitLocal;
                            const formattedEntry = formatTimeString(record.entryLocal);
                            const formattedExit = isStillInside ? "--" : formatTimeString(record.exitLocal);
                            const formattedDwellTime = isStillInside ? "--" : formatDwell(record.dwellMinutes);
                            const formattedSex =
                                record.gender.charAt(0).toUpperCase() + record.gender.slice(1).toLowerCase();

                            return (
                                <tr
                                    key={record.personId}
                                    className="hover:bg-gray-100/70 transition-colors"
                                >
                                    <td className="py-3.5 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#E8E8E8] text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                                                {record.personName.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-slate-600">
                                                {record.personName}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                                        {formattedSex}
                                    </td>

                                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                                        {formattedEntry}
                                    </td>

                                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                                        {formattedExit}
                                    </td>

                                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                                        {formattedDwellTime}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}