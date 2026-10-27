"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSite } from "@/context/SiteContext";
import { api } from "@/lib/api";
import { getTodayEpochRange, DateRange, } from "@/lib/utils";
import { OccupancyMetricsPanel } from "@/components/dashboard/OccupancyMetricsPanel";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { DemographicsDonut } from "@/components/dashboard/DemographicsDonut";
import { DemographicsLineChart } from "@/components/dashboard/DemographicsLineChart";
import { OccupancyPoint, DemographicsPoint } from "@/types/api";
import { useSocket } from "@/context/SocketContext";
import { DateFilter } from "@/components/ui/DateFilter";

export default function OverviewPage() {
    const { selectedSite } = useSite();
    const { latestLiveOccupancy, latestOccupancyCount } = useSocket();
    const [dateRange, setDateRange] = useState<DateRange>(() => getTodayEpochRange());

    const queryParams = useMemo(() => {
        return {
            siteId: selectedSite?.siteId || "8bd0d580-fdac-44a4-a6e4-367253099c4e",
            fromUtc: dateRange.fromUtc,
            toUtc: dateRange.toUtc,
        };
    }, [selectedSite, dateRange]);

    const { data: footfallData, isLoading: isFootfallLoading } = useQuery({
        queryKey: ["analytics", "footfall", queryParams],
        queryFn: () => api.getFootfall(queryParams),
        enabled: !!queryParams.siteId,
    });

    const { data: dwellData, isLoading: isDwellLoading } = useQuery({
        queryKey: ["analytics", "dwell", queryParams],
        queryFn: () => api.getDwellTime(queryParams),
        enabled: !!queryParams.siteId,
    });

    const { data: occupancyData, isLoading: isOccupancyLoading } = useQuery({
        queryKey: ["analytics", "occupancy", queryParams],
        queryFn: () => api.getOccupancy(queryParams),
        enabled: !!queryParams.siteId,
    });

    const { data: demographicsData, isLoading: isDemographicsLoading } = useQuery({
        queryKey: ["analytics", "demographics", queryParams],
        queryFn: () => api.getDemographics(queryParams),
        enabled: !!queryParams.siteId,
    });

    const { occupancyPoints, liveOccupancyCount, latestActiveHour } = useMemo(() => {
        const buckets = occupancyData?.buckets || [];
        if (buckets.length === 0) {
            return { occupancyPoints: [], liveOccupancyCount: 0, latestActiveHour: undefined };
        }

        const points: OccupancyPoint[] = buckets.map((b) => {
            const timePart = b.local ? b.local.split(" ")[1]?.substring(0, 5) : "";
            return {
                hour: timePart || `${new Date(b.utc).getHours()}:00`,
                timestamp: b.utc,
                occupancy: Math.round(b.avg),
            };
        });

        const nonZero = buckets.filter((b) => b.avg > 0);
        const latest = nonZero.length > 0 ? nonZero[nonZero.length - 1] : buckets[0];
        const liveCount = latest ? Math.round(latest.avg) : 0;
        const liveTime = latest?.local ? latest.local.split(" ")[1]?.substring(0, 5) : undefined;

        return {
            occupancyPoints: points,
            liveOccupancyCount: liveCount,
            latestActiveHour: liveTime,
        };
    }, [occupancyData]);

    const currentLiveCount = latestOccupancyCount ?? (liveOccupancyCount || 734);

    const liveMarkerTime = useMemo(() => {
        if (latestLiveOccupancy?.ts) {
            const date = new Date(latestLiveOccupancy.ts);
            const hours = String(date.getHours()).padStart(2, "0");
            const mins = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${mins}`;
        }
        return latestActiveHour;
    }, [latestLiveOccupancy, latestActiveHour]);

    const chartPoints = useMemo(() => {
        if (!occupancyPoints || occupancyPoints.length === 0) return occupancyPoints;
        if (latestOccupancyCount === null) return occupancyPoints;

        const updated = [...occupancyPoints];
        const lastIdx = updated.findLastIndex((p) => p.occupancy > 0);
        const targetIdx = lastIdx !== -1 ? lastIdx : updated.length - 1;

        if (targetIdx !== -1) {
            const pointHour = liveMarkerTime || updated[targetIdx].hour;
            updated[targetIdx] = {
                ...updated[targetIdx],
                hour: pointHour,
                occupancy: latestOccupancyCount,
            };
        }
        return updated;
    }, [occupancyPoints, latestOccupancyCount, liveMarkerTime]);

    const { demographicPoints, totalMale, totalFemale } = useMemo(() => {
        const buckets = demographicsData?.buckets || [];
        if (buckets.length === 0) {
            return { demographicPoints: [], totalMale: 0, totalFemale: 0 };
        }

        let maleTotal = 0;
        let femaleTotal = 0;

        const points: DemographicsPoint[] = buckets.map((b) => {
            const timePart = b.local ? b.local.split(" ")[1]?.substring(0, 5) : "";
            maleTotal += b.male;
            femaleTotal += b.female;
            return {
                hour: timePart || `${new Date(b.utc).getHours()}:00`,
                timestamp: b.utc,
                male: Math.round(b.male),
                female: Math.round(b.female),
            };
        });

        return {
            demographicPoints: points,
            totalMale: Math.round(maleTotal),
            totalFemale: Math.round(femaleTotal),
        };
    }, [demographicsData]);

    const formattedDwell = useMemo(() => {
        if (dwellData?.avgDwellMinutes === undefined || dwellData?.avgDwellMinutes === null) {
            return "08min 30sec";
        }
        const mins = Math.floor(dwellData.avgDwellMinutes);
        const secs = Math.round((dwellData.avgDwellMinutes - mins) * 60);
        return `${String(mins).padStart(2, "0")}min ${String(secs).padStart(2, "0")}sec`;
    }, [dwellData]);

    const currentMaleTotal = latestLiveOccupancy?.genderCount?.male ?? totalMale;
    const currentFemaleTotal = latestLiveOccupancy?.genderCount?.female ?? totalFemale;

    const liveDemoPoints = useMemo(() => {
        if (!demographicPoints || demographicPoints.length === 0) return demographicPoints;
        if (!latestLiveOccupancy?.genderCount) return demographicPoints;

        const updated = [...demographicPoints];
        const lastIdx = updated.findLastIndex((p) => p.male > 0 || p.female > 0);
        const targetIdx = lastIdx !== -1 ? lastIdx : updated.length - 1;

        if (targetIdx !== -1) {
            updated[targetIdx] = {
                ...updated[targetIdx],
                male: latestLiveOccupancy.genderCount.male,
                female: latestLiveOccupancy.genderCount.female,
                ...(liveMarkerTime ? { hour: liveMarkerTime } : {}),
            };
        }
        return updated;
    }, [demographicPoints, latestLiveOccupancy, liveMarkerTime]);

    const isKpiLoading = isFootfallLoading || isDwellLoading || isOccupancyLoading;

    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between pb-1">
                <h2 className="text-2xl font-semibold text-black tracking-tight">Overview</h2>
                <DateFilter onRangeChange={(range) => setDateRange(range)} />
            </div>

            <section>
                <h3 className="text-lg font-semibold text-black tracking-wider mb-2.5">
                    Occupancy
                </h3>
                <OccupancyMetricsPanel
                    liveOccupancy={currentLiveCount}
                    footfall={footfallData?.footfall ? footfallData.footfall.toLocaleString() : "4,003"}
                    dwellTime={formattedDwell}
                    isLoading={isKpiLoading}
                />
            </section>

            <section>
                <OccupancyChart
                    data={chartPoints}
                    liveTimestamp={latestActiveHour}
                    isLoading={isOccupancyLoading}
                />
            </section>

            <section className="space-y-2.5">
                <h3 className="text-lg font-semibold text-black tracking-wider">
                    Demographics
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-1">
                        <DemographicsDonut
                            totalMale={currentMaleTotal}
                            totalFemale={currentFemaleTotal}
                            isLoading={isDemographicsLoading}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <DemographicsLineChart
                            data={liveDemoPoints}
                            isLoading={isDemographicsLoading}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}