"use client";

import React from "react";
import { X, AlertCircle, MapPin } from "lucide-react";
import { SocketAlertEvent } from "@/types/api";

interface AlertsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    alerts: SocketAlertEvent[];
}

function renderAlertDateTime(ts?: number, timeStr?: string) {
    let datePart = "";
    if (ts) {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) {
            datePart = d.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        }
    }

    const displayTime = timeStr || (ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

    return (
        <div className="flex items-center gap-1.5 text-xs">
            {datePart && <span className="text-slate-800 font-normal">{datePart}</span>}
            <span className="font-bold text-black">{displayTime}</span>
        </div>
    );
}

export function AlertsDrawer({ isOpen, onClose, alerts }: AlertsDrawerProps) {
    const severityCounts = React.useMemo(() => {
        let high = 0;
        let medium = 0;
        let low = 0;
        for (const alert of alerts) {
            const s = alert.severity?.toLowerCase();
            if (s === "high") high++;
            else if (s === "medium") medium++;
            else if (s === "low") low++;
        }
        return { high, medium, low };
    }, [alerts]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-black">Alerts</h2>
                            <span className="px-2 py-0.5 rounded-full bg-[#14b8a6]/20 text-[#14b8a6] font-semibold text-xs">
                                {alerts.length}
                            </span>
                            <span
                                title={`${severityCounts.high} High Severity`}
                                className="px-2 py-0.5 rounded-full bg-[#B42018]/20 text-[#B42018] font-semibold text-[11px] shadow-2xs"
                            >
                                {severityCounts.high}
                            </span>
                            <span
                                title={`${severityCounts.medium} Medium Severity`}
                                className="px-2 py-0.5 rounded-full bg-[#FF9900]/20 text-[#FF9900] font-semibold text-[11px] shadow-2xs"
                            >
                                {severityCounts.medium}
                            </span>
                            <span
                                title={`${severityCounts.low} Low Severity`}
                                className="px-2 py-0.5 rounded-full bg-[#00AB7B]/20 text-[#00AB7B] font-semibold text-[11px] shadow-2xs"
                            >
                                {severityCounts.low}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-md text-slate-600 hover:text-black hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {alerts.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-black text-center px-4">
                                <AlertCircle className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-sm">No new alerts.</p>
                                <p className="text-xs text-slate-700 mt-1">Live zone movements will appear here.</p>
                            </div>
                        ) : (
                            alerts.map((alert, idx) => {
                                const sev = alert.severity?.toLowerCase();
                                const isHigh = sev === "high";
                                const isMed = sev === "medium";
                                const isEntry = alert.direction === "entry";

                                return (
                                    <div
                                        key={alert.id || alert.eventId || idx}
                                        className="p-3.5 rounded-xl border border-slate-100 shadow-sm bg-white hover:bg-gray-100/70 hover:border-slate-200 transition-all"
                                    >
                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                            {renderAlertDateTime(alert.ts, alert.timestamp)}
                                            <span
                                                className={`px-2 py-1 rounded font-medium text-[10px] capitalize tracking-wider ${isHigh
                                                    ? "bg-[#B42018] text-white"
                                                    : isMed
                                                        ? "bg-[#FF9900] text-white"
                                                        : "bg-[#00AB7B] text-white"
                                                    }`}
                                            >
                                                {alert.severity}
                                            </span>
                                        </div>

                                        <div className="text-sm font-semibold text-black">
                                            {alert.personName}{" "}
                                            <span className="font-normal text-slate-700">
                                                {isEntry ? "Entered" : "Exited"}
                                            </span>
                                        </div>

                                        <div className="text-xs mt-1 flex items-center justify-between text-slate-800">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-800 shrink-0" />
                                                <span>{alert.zoneName}</span>
                                            </div>
                                            {alert.siteName && (
                                                <span className="text-slate-600 text-[11px] truncate max-w-30">
                                                    {alert.siteName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}