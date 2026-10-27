"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Maximize2, Power, Menu, X } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

function SidebarBackground({ idPrefix = "desktop" }: { idPrefix?: string }) {
    const gradId = `polyLineGrad-${idPrefix}`;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(180deg, #282829 2%, #08262b 12%, #154847 65%, #282829 100%)",
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at 60% 65%, rgba(20, 184, 166, 0.18) 0%, rgba(13, 148, 136, 0.08) 45%, transparent 75%)",
                }}
            />

            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 240 900"
                preserveAspectRatio="none"
                style={{ opacity: 0.22 }}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.1" />
                        <stop offset="40%" stopColor="#2dd4bf" stopOpacity="0.1" />
                        <stop offset="70%" stopColor="#5eead4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                <g stroke={`url(#${gradId})`} strokeWidth="3" fill="none" strokeLinejoin="round">
                    <polygon points="80,310 20,420 180,390" />
                    <polygon points="260,260 180,390 280,480" />

                    <polygon points="20,420 120,530 180,390" />
                    <polygon points="120,530 280,480 240,620" />
                    <polygon points="-40,560 20,420 120,530" />

                    <polygon points="-40,560 60,670 120,530" />
                    <polygon points="120,530 240,620 160,710" />
                    <polygon points="60,670 160,710 120,530" />

                    <polygon points="-30,760 60,670 90,820" />
                    <polygon points="160,710 270,780 90,820" />
                    <polygon points="90,820 270,780 180,920" />
                    <polygon points="-30,760 90,820 40,940" />
                </g>

                <g fill="#5eead4" opacity="0.6">
                    <circle cx="80" cy="310" r="1.5" />
                    <circle cx="180" cy="390" r="1.5" />
                    <circle cx="20" cy="420" r="1.2" />
                    <circle cx="120" cy="530" r="1.8" />
                    <circle cx="60" cy="670" r="1.5" />
                    <circle cx="160" cy="710" r="1.5" />
                    <circle cx="90" cy="820" r="1.5" />
                </g>
            </svg>
        </div>
    );
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isOverview = pathname === "/overview" || pathname === "/";
    const isEntries = pathname.startsWith("/crowd-entries");

    const renderNav = (compact: boolean) => (
        <>
            <nav className="px-3 pt-6 space-y-2 flex-1">
                <div className="relative group">
                    <Link
                        href="/overview"
                        onClick={onMobileClose}
                        className={`relative flex items-center rounded-lg tracking-wide transition-all ${compact ? "justify-center p-3" : "gap-3 px-3.5 py-3 text-sm font-medium"
                            } ${isOverview
                                ? "bg-[#33464a]/80 text-white shadow-sm font-semibold"
                                : "text-slate-300 hover:bg-white/5 hover:text-slate-white"
                            }`}
                    >
                        {isOverview && (
                            <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-white" />
                        )}
                        <Home className="w-5 h-5 shrink-0 text-slate-200" />
                        {!compact && <span>Overview</span>}
                    </Link>

                    {/* tooltip */}
                    {compact && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-xl border border-slate-100 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                            Overview
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <Link
                        href="/crowd-entries"
                        onClick={onMobileClose}
                        className={`relative flex items-center rounded-lg tracking-wide transition-all ${compact ? "justify-center p-3" : "gap-3 px-3.5 py-3 text-sm font-medium"
                            } ${isEntries
                                ? "bg-[#33464a]/80 text-white shadow-sm font-semibold"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        {isEntries && (
                            <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-white" />
                        )}
                        <Maximize2 className="w-5 h-5 shrink-0 text-slate-300" />
                        {!compact && <span>Crowd Entries</span>}
                    </Link>

                    {/* tooltip */}
                    {compact && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-xl border border-slate-100 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                            Crowd Entries
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
                        </div>
                    )}
                </div>
            </nav>

            <div className="p-3 pb-6">
                <div className="relative group">
                    <button
                        onClick={() => {
                            if (onMobileClose) onMobileClose();
                            logout();
                        }}
                        className={`flex items-center text-slate-300 hover:text-white hover:bg-white/5 tracking-wide rounded-lg transition-colors w-full ${compact ? "justify-center p-3" : "gap-3 px-3.5 py-2.5 text-sm font-medium"
                            }`}
                    >
                        <Power className="w-5 h-5 shrink-0 text-slate-300 group-hover:text-red-400 transition-colors" />
                        {!compact && <span>Logout</span>}
                    </button>

                    {/* tooltip */}
                    {compact && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-xl border border-slate-100 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                            Logout
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white" />
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            <aside
                className={`hidden md:flex flex-col justify-between shrink-0 select-none min-h-screen text-slate-300 relative transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-60"
                    }`}
            >
                <SidebarBackground idPrefix="desktop" />

                <div className="relative z-10 flex flex-col h-full">
                    <div
                        className={`h-16 flex items-center pt-2 ${isCollapsed ? "justify-center px-2" : "justify-between px-3"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {!isCollapsed && (
                                <>
                                    <Image
                                        src="/Kloudspot_Horizontal.svg"
                                        alt="logo-horizontal"
                                        priority
                                        width={120}
                                        height={120}
                                        className="w-30 h-auto"
                                    />
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-[#33464a]/50 hover:bg-white/10 transition-colors focus:outline-none"
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {renderNav(isCollapsed)}
                </div>
            </aside>

            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                        onClick={onMobileClose}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col justify-between text-slate-300 shadow-2xl animate-in slide-in-from-left duration-250 select-none overflow-hidden">
                        <SidebarBackground idPrefix="mobile" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-16 flex items-center justify-between px-3 pt-2">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src="/Kloudspot_Horizontal.svg"
                                        alt="logo-horizontal"
                                        priority
                                        width={120}
                                        height={120}
                                        className="w-30 h-auto"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={onMobileClose}
                                    className="text-white p-1.5 rounded-lg"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {renderNav(false)}
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}