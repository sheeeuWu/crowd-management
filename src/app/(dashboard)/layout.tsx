"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AlertsDrawer } from "@/components/layout/AlertsDrawer";
import { useSocket } from "@/context/SocketContext";

const emptySubscribe = () => () => { };
function useIsClient() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isClient = useIsClient();

    const { alerts } = useSocket();

    useEffect(() => {
        if (isClient && !isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isClient, isAuthenticated, isLoading, router]);

    if (!isClient || isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 relative">
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onOpenAlerts={() => setIsAlertsOpen(true)}
                    alertCount={alerts.length}
                    onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
            </div>

            <AlertsDrawer
                isOpen={isAlertsOpen}
                onClose={() => setIsAlertsOpen(false)}
                alerts={alerts}
            />
        </div>
    );
}