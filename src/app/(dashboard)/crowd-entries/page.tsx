"use client";

import React, { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSite } from "@/context/SiteContext";
import { api } from "@/lib/api";
import { getTodayEpochRange, DateRange } from "@/lib/utils";
import { EntriesTable } from "@/components/entries/EntriesTable";
import { PaginationControls } from "@/components/entries/PaginationControls";
import { DateFilter } from "@/components/ui/DateFilter";

export default function CrowdEntriesPage() {
    const { selectedSite } = useSite();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [dateRange, setDateRange] = useState<DateRange>(() => getTodayEpochRange());

    const queryParams = useMemo(() => {
        return {
            siteId: selectedSite?.siteId || "8bd0d580-fdac-44a4-a6e4-367253099c4e",
            fromUtc: dateRange.fromUtc,
            toUtc: dateRange.toUtc,
            pageNumber: currentPage,
            pageSize: pageSize,
        };
    }, [selectedSite, dateRange, currentPage, pageSize]);

    const { data, isLoading } = useQuery({
        queryKey: ["analytics", "entry-exit", queryParams],
        queryFn: () => api.getEntryExit(queryParams),
        enabled: !!queryParams.siteId,
        placeholderData: keepPreviousData,
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between pb-1">
                <h2 className="text-2xl font-semibold text-black tracking-tight">Crowd Entries</h2>
                <DateFilter
                    onRangeChange={(range) => {
                        setDateRange(range);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <section className="space-y-4">
                <EntriesTable
                    records={data?.records}
                    isLoading={isLoading}
                />

                {data && data.totalPages > 1 && (
                    <PaginationControls
                        currentPage={data.pageNumber || currentPage}
                        totalPages={data.totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        disabled={isLoading}
                    />
                )}
            </section>
        </div>
    );
}