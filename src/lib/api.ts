import {
    LoginRequest,
    LoginResponse,
    Site,
    AnalyticsRequest,
    FootfallResponse,
    DwellTimeResponse,
    OccupancyResponse,
    DemographicsResponse,
    EntryExitRequest,
    EntryExitResponse,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hiring-dev.internal.kloudspot.com";

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

let isHandlingUnauthorized = false;

function handleUnauthorizedEvent() {
    if (typeof window === "undefined" || isHandlingUnauthorized) return;
    isHandlingUnauthorized = true;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:unauthorized"));
    setTimeout(() => {
        isHandlingUnauthorized = false;
    }, 2000);
}

function getAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options.headers,
    };

    // prevent stalled queries from hanging the page
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                handleUnauthorizedEvent();
                throw new UnauthorizedError("Session expired. Please log in again.");
            }
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export const api = {
    login: (data: LoginRequest) =>
        request<LoginResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getSites: () => request<Site[]>("/api/sites", { method: "GET" }),

    getFootfall: (params: AnalyticsRequest) =>
        request<FootfallResponse>("/api/analytics/footfall", {
            method: "POST",
            body: JSON.stringify(params),
        }),

    getDwellTime: (params: AnalyticsRequest) =>
        request<DwellTimeResponse>("/api/analytics/dwell", {
            method: "POST",
            body: JSON.stringify(params),
        }),

    getOccupancy: (params: AnalyticsRequest) =>
        request<OccupancyResponse>("/api/analytics/occupancy", {
            method: "POST",
            body: JSON.stringify(params),
        }),

    getDemographics: (params: AnalyticsRequest) =>
        request<DemographicsResponse>("/api/analytics/demographics", {
            method: "POST",
            body: JSON.stringify(params),
        }),

    getEntryExit: (params: EntryExitRequest) =>
        request<EntryExitResponse>("/api/analytics/entry-exit", {
            method: "POST",
            body: JSON.stringify(params),
        }),
};