"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface OccupancyMetricsPanelProps {
    liveOccupancy: number;
    footfall: string | number;
    dwellTime: string;
    isLoading?: boolean;
}

export function OccupancyMetricsPanel({
    liveOccupancy,
    footfall,
    dwellTime,
    isLoading,
}: OccupancyMetricsPanelProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="p-6 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="md:pr-6">
                        <Skeleton className="h-4 w-28 mb-3" />
                        <Skeleton className="h-9 w-24 mb-3" />
                        <Skeleton className="h-3.5 w-36" />
                    </div>
                    <div className="pt-4 md:pt-0 md:pl-6">
                        <Skeleton className="h-4 w-28 mb-3" />
                        <Skeleton className="h-9 w-24 mb-3" />
                        <Skeleton className="h-3.5 w-36" />
                    </div>
                </Card>
                <Card className="p-6 lg:col-span-1">
                    <Skeleton className="h-4 w-28 mb-3" />
                    <Skeleton className="h-9 w-24 mb-3" />
                    <Skeleton className="h-3.5 w-36" />
                </Card>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="p-5 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-slate-200 bg-white">
                <div className="pb-4 md:pb-0 md:pr-8">
                    <p className="text-md font-semibold text-black tracking-tight">
                        Live Occupancy
                    </p>
                    <div className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">
                        {liveOccupancy}
                    </div>
                    <div className="mt-3 flex items-end gap-1.5 text-sm text-slate-800">
                        <span className="font-bold">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            10%
                        </span>
                        <span>More than yesterday</span>
                    </div>
                </div>

                <div className="pt-4 md:pt-0 md:pl-8">
                    <p className="text-md font-semibold text-black tracking-tight">
                        Today&apos;s Footfall
                    </p>
                    <div className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">
                        {footfall}
                    </div>
                    <div className="mt-3 flex items-end gap-1.5 text-sm text-slate-800">
                        <span className="font-bold">
                            <TrendingDown className="w-4 h-4 text-red-700" />
                            10%
                        </span>
                        <span>Less than yesterday</span>
                    </div>
                </div>
            </Card>

            <Card className="p-5 lg:col-span-1 bg-white">
                <p className="text-md font-semibold text-black tracking-tight">
                    Avg Dwell Time
                </p>
                <div className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">
                    {dwellTime}
                </div>
                <div className="mt-3 flex items-end gap-1.5 text-sm text-slate-800">
                    <span className="font-bold">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        6%
                    </span>
                    <span>More than yesterday</span>
                </div>
            </Card>
        </div >
    );
}