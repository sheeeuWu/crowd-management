"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { DemographicsPoint } from "@/types/api";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface DemographicsLineChartProps {
    data?: DemographicsPoint[];
    isLoading?: boolean;
}

export function DemographicsLineChart({
    data = [],
    isLoading,
}: DemographicsLineChartProps) {
    if (isLoading) {
        return (
            <Card className="p-6">
                <Skeleton className="h-5 w-48 mb-6" />
                <Skeleton className="h-55 w-full rounded-lg" />
            </Card>
        );
    }

    return (
        <Card className="p-5 bg-white h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-black">Demographics Analysis</h3>
                <div className="flex items-center gap-4 text-sm font-light">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#5fa6a6]" />
                        <span className="text-slate-700">Male</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#a8dadc]" />
                        <span className="text-slate-700">Female</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-55">
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data} margin={{ top: 10, right: 15, left: -5, bottom: 5 }}>
                        <defs>
                            <linearGradient id="maleFigmaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#5fa6a6" stopOpacity={0.16} />
                                <stop offset="100%" stopColor="#5fa6a6" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="femaleFigmaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#a8dadc" stopOpacity={0.16} />
                                <stop offset="100%" stopColor="#a8dadc" stopOpacity={0.02} />
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
                            ticks={[0, 50, 100, 150, 200, 250, 330]}
                            domain={[0, 340]}
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
                                            <p className="text-[#5fa6a6] font-semibold">
                                                Male: {payload[0]?.value}
                                            </p>
                                            <p className="text-[#a8dadc] font-semibold">
                                                Female: {payload[1]?.value}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="male"
                            stroke="#5fa6a6"
                            strokeWidth={1.8}
                            fillOpacity={1}
                            fill="url(#maleFigmaGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="female"
                            stroke="#a8dadc"
                            strokeWidth={1.8}
                            fillOpacity={1}
                            fill="url(#femaleFigmaGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}