"use client";

import React from "react";
import { useSite } from "@/context/SiteContext";
import { Bell, ChevronDown, MapPin, Menu } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
    onOpenAlerts: () => void;
    alertCount: number;
    onToggleMobileMenu?: () => void;
}

export function Header({ onOpenAlerts, alertCount, onToggleMobileMenu }: HeaderProps) {
    const { sites, selectedSite, setSelectedSite } = useSite();
    const [currentLang, setCurrentLang] = React.useState<"en" | "ar">("en");

    return (
        <header className="sticky top-0 z-30 h-16 shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 w-full">
            <div className="flex items-center gap-5 shrink-0">
                <button
                    type="button"
                    onClick={onToggleMobileMenu}
                    aria-label="Toggle sidebar menu"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-black hover:bg-gray-100/70 transition md:hidden"
                >
                    <Menu className="h-4 w-4" />
                </button>

                <span className="text-lg font-medium text-black hidden lg:inline">
                    Crowd Solutions
                </span>
                <span className="text-slate-400 hidden lg:inline">|</span>

                <div className="relative inline-block">
                    <MapPin className="w-3.5 h-3.5 text-black absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                        value={selectedSite?.siteId || ""}
                        onChange={(e) => {
                            const found = sites.find((s) => s.siteId === e.target.value);
                            if (found) setSelectedSite(found);
                        }}
                        className="appearance-none bg-white hover:bg-gray-100/70 border border-slate-200 text-black text-xs font-semibold py-1.5 pl-7 pr-5 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                    >
                        {sites.map((site) => (
                            <option key={site.siteId} value={site.siteId}>
                                {site.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-black absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <button
                    type="button"
                    onClick={() => setCurrentLang(currentLang === "en" ? "ar" : "en")}
                    className="flex items-center rounded-full border border-slate-200 bg-white p-1 hover:bg-gray-100/70 transition-colors focus:outline-hidden"
                    aria-label="Toggle language"
                >
                    <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-normal transition-all ${currentLang === "en"
                            ? "bg-[#14b8a6] text-white shadow-xs"
                            : "text-slate-700 hover:text-slate-900"
                            }`}
                    >
                        En
                    </span>
                    <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-normal transition-all ${currentLang === "ar"
                            ? "bg-[#14b8a6] text-white shadow-xs"
                            : "text-slate-700 hover:text-slate-900"
                            }`}
                    >
                        ع
                    </span>
                </button>

                <button
                    onClick={onOpenAlerts}
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg text-black hover:bg-gray-100 transition"
                    aria-label="View notifications"
                >
                    <Bell className="w-5 h-5" strokeWidth={1.5}/>
                    {alertCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                    )}
                </button>

                <div className="flex items-center">
                    <Image
                        src="/profile.svg"
                        alt="user-profile-img"
                        priority
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                </div>
            </div>
        </header>
    );
}