"use client";

import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Site } from "@/types/api";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface SiteContextType {
    sites: Site[];
    selectedSite: Site | null;
    setSelectedSite: (site: Site) => void;
    isLoading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [selectedSiteOverride, setSelectedSiteOverride] = useState<Site | null>(null);

    const { data: sites = [], isLoading } = useQuery({
        queryKey: ["sites"],
        queryFn: () => api.getSites(),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const selectedSite = selectedSiteOverride || (sites.length > 0 ? sites[0] : null);

    return (
        <SiteContext.Provider
            value={{
                sites,
                selectedSite,
                setSelectedSite: setSelectedSiteOverride,
                isLoading,
            }}
        >
            {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error("useSite must be used within a SiteProvider");
    }
    return context;
}