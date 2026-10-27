import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


export function formatTimeDisplay(time: number | string | null | undefined): string {
    if (!time) return "--";
    if (typeof time === "string" && (time.includes("AM") || time.includes("PM") || time === "--")) {
        return time;
    }
    const date = new Date(time);
    if (isNaN(date.getTime())) return String(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


export function formatDwellDuration(minutes: number | string | null | undefined): string {
    if (minutes === null || minutes === undefined || minutes === "--") return "--";
    const num = typeof minutes === "string" ? parseFloat(minutes) : minutes;
    if (isNaN(num)) return String(minutes);

    const totalSeconds = Math.round(num * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


export function getTodayEpochRange(): { fromUtc: number; toUtc: number } {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return {
        fromUtc: startOfDay.getTime(),
        toUtc: endOfDay.getTime(),
    };
}

export type FilterOption = "today" | "7days" | "month" | "custom";

export interface DateRange {
    fromUtc: number;
    toUtc: number;
}

export function getDateRangeForFilter(
    filter: FilterOption,
    customStart?: string,
    customEnd?: string
): DateRange {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    if (filter === "7days") {
        const past7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0);
        return { fromUtc: past7.getTime(), toUtc: endOfDay };
    }

    if (filter === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        return { fromUtc: startOfMonth.getTime(), toUtc: endOfDay };
    }

    if (filter === "custom" && customStart && customEnd) {
        const start = new Date(customStart + "T00:00:00").getTime();
        const end = new Date(customEnd + "T23:59:59.999").getTime();
        if (!isNaN(start) && !isNaN(end)) {
            return { fromUtc: start, toUtc: end };
        }
    }

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    return { fromUtc: startOfDay, toUtc: endOfDay };
}