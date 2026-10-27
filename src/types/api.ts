// auth
export interface LoginRequest {
    email: string;
    password?: string;
}

export interface LoginResponse {
    token: string;
    user?: {
        id: string;
        username: string;
        role?: string;
    };
}

// sites
export interface Site {
    siteId: string;
    name: string;
    description?: string;
    zones?: string[];
}

// analytics
export interface AnalyticsRequest {
    siteId: string;
    fromUtc: number;
    toUtc: number;
}

export interface FootfallResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    footfall: number;
}

export interface DwellTimeResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    avgDwellMinutes: number;
    dwellRecords: number;
}

// occupancy 
export interface OccupancyBucket {
    utc: number;
    local: string;
    avg: number;
}

export interface OccupancyResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    timezone?: string;
    buckets: OccupancyBucket[];
}

// demographics
export interface DemographicsBucket {
    utc: number;
    local: string;
    male: number;
    female: number;
}

export interface DemographicsResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    timezone?: string;
    buckets: DemographicsBucket[];
}

export interface OccupancyPoint {
    hour: string;
    timestamp: number;
    occupancy: number;
}

export interface DemographicsPoint {
    hour: string;
    timestamp: number;
    male: number;
    female: number;
}

export interface EntryExitRequest extends AnalyticsRequest {
    pageNumber?: number;
    pageSize?: number;
}

export interface EntryExitRecord {
    personId: string;
    personName: string;
    gender: string;
    zoneId?: string;
    zoneName?: string;
    severity?: string;
    entryUtc: number;
    entryLocal: string;
    exitUtc?: number | null;
    exitLocal?: string | null;
    dwellMinutes?: number | null;
}

export interface EntryExitResponse {
    siteId: string;
    fromUtc: number;
    toUtc: number;
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    records: EntryExitRecord[];
}

// socket.io
export interface SocketAlertEvent {
    id?: string;
    eventId?: string;
    ts?: number;
    direction: "entry" | "exit";
    personName: string;
    zoneName: string;
    zoneId?: string;
    siteName?: string;
    siteId?: string;
    personId?: string;
    severity: "high" | "medium" | "low" | string;
    timestamp?: string;
}

export interface SocketLiveOccupancyEvent {
    ts: number;
    siteId: string;
    siteOccupancy: number;
    zoneId?: string;
    zoneOccupancy?: number;
    genderCount?: {
        male: number;
        female: number;
    };
}