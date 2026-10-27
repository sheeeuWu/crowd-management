"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Image from "next/image";

interface DemographicsDonutProps {
    totalMale?: number;
    totalFemale?: number;
    isLoading?: boolean;
}

export function DemographicsDonut({
    totalMale = 0,
    totalFemale = 0,
    isLoading,
}: DemographicsDonutProps) {
    if (isLoading) {
        return (
            <Card className="p-6">
                <Skeleton className="h-5 w-40 mb-6" />
                <Skeleton className="h-55 w-full rounded-lg" />
            </Card>
        );
    }

    const total = totalMale + totalFemale;
    const malePercentage = total > 0 ? Math.round((totalMale / total) * 100) : 60;
    const femalePercentage = total > 0 ? 100 - malePercentage : 40;

    const data = [
        { name: "Males", value: malePercentage, color: "#5fa6a6" },
        { name: "Females", value: femalePercentage, color: "#a8dadc" },
    ];

    return (
        <Card className="p-5 flex flex-col justify-between bg-white h-full">
            <h3 className="text-md font-semibold text-black mb-2">Chart of Demographics</h3>

            <div className="relative h-44 w-full flex items-center justify-center my-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={58}
                            outerRadius={80}
                            cornerRadius={5}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-normal text-slate-700">Total Crowd</span>
                    <span className="text-sm font-bold text-black">100%</span>
                </div>
            </div>

            <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                    <Image
                        src="/male-icon.svg"
                        alt="donut-chart-male-icon"
                        priority
                        width={8}
                        height={8}
                        className="w-2 h-auto"
                    />
                    <span className="font-bold text-slate-900">{malePercentage}%</span>
                    <span className="text-slate-900 font-medium">Males</span>
                </div>
                <div className="flex items-center gap-2">
                    <Image
                        src="/female-icon.svg"
                        alt="donut-chart-female-icon"
                        priority
                        width={8}
                        height={8}
                        className="w-2 h-auto"
                    />
                    <span className="font-bold text-slate-900">{femalePercentage}%</span>
                    <span className="text-slate-900 font-medium">Females</span>
                </div>
            </div>
        </Card>
    );
}