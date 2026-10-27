"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { OccupancyPoint } from "@/types/api";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

interface OccupancyChartProps {
    data?: OccupancyPoint[];
    liveTimestamp?: string;
    isLoading?: boolean;
}

interface CustomLabelProps {
    viewBox?: { x?: number; y?: number };
}

const LiveBadgeLabel = ({ viewBox }: CustomLabelProps) => {
    if (!viewBox || typeof viewBox.x !== "number") {
        return null;
    }
    const x = viewBox.x;
    const y = typeof viewBox.y === "number" ? viewBox.y : 10;
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect
                x="-10"
                y="0"
                width="20"
                height="32"
                rx="3"
                fill="#c10007"
            />
            <text
                x="0"
                y="19"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="600"
                textAnchor="middle"
                letterSpacing="0.5"
                transform="rotate(-90 0 16)"
            >
                LIVE
            </text>
        </g>
    );
};

export function OccupancyChart({ data = [], liveTimestamp, isLoading }: OccupancyChartProps) {
    const activePoint = React.useMemo(() => {
        if (!data || data.length === 0) return undefined;

        if (liveTimestamp && data.some((d) => d.hour === liveTimestamp)) {
            return liveTimestamp;
        }

        const activeItems = data.filter((d) => d.occupancy > 0);
        if (activeItems.length > 0) {
            return activeItems[activeItems.length - 1].hour;
        }
        return data[data.length - 1].hour;
    }, [data, liveTimestamp]);

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-70 w-full rounded-lg" />
            </Card>
        );
    }

    return (
        <Card className="p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-black">Overall Occupancy</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-700 font-light">
                    <span className="w-2 h-2 rounded-full bg-[#14b8a6] inline-block" />
                    <span>Occupancy</span>
                </div>
            </div>

            <div className="w-full h-70">
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data} margin={{ top: 25, right: 25, left: -5, bottom: 5 }}>
                        <defs>
                            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.16} />
                                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.01} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="2 3" stroke="#f1f5f9" />

                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={{ stroke: "#bdbdbd", strokeWidth: 1 }}
                            tick={{ fontSize: 11, fill: "#757575" }}
                            label={{
                                value: "Time",
                                position: "insideBottom",
                                offset: -5,
                                fill: "#0f172b",
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={{ stroke: "#bdbdbd", strokeWidth: 1 }}
                            ticks={[50, 100, 150, 200, 250]}
                            domain={[0, 260]}
                            tick={{ fontSize: 11, fill: "#757575" }}
                            label={{
                                value: "Count",
                                angle: -90,
                                position: "insideLeft",
                                offset: 15,
                                fill: "#0f172b",
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        />

                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white text-slate-900 px-3 py-1.5 rounded-md shadow-lg border border-slate-100 text-xs space-y-0.5 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
                                            <p className="text-[#0f172b]">{label}</p>
                                            <p className="font-bold text-[#14b8a6]">
                                                Occupancy: {payload[0]?.value}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        {activePoint && (
                            <ReferenceLine
                                x={activePoint}
                                stroke="#c10007"
                                strokeDasharray="2 2"
                                strokeWidth={1.5}
                                label={<LiveBadgeLabel />}
                            />
                        )}

                        <Area
                            type="monotone"
                            dataKey="occupancy"
                            stroke="#5fa6a6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#occupancyGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}