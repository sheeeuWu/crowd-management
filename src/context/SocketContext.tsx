"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketAlertEvent, SocketLiveOccupancyEvent } from "@/types/api";
import { useAuth } from "./AuthContext";

interface SocketContextType {
    isConnected: boolean;
    alerts: SocketAlertEvent[];
    latestLiveOccupancy: SocketLiveOccupancyEvent | null;
    latestOccupancyCount: number | null;
    clearAlerts: () => void;
    getSocket: () => Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://hiring-dev.internal.kloudspot.com";

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useAuth();
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false);
    const [latestLiveOccupancy, setLatestLiveOccupancy] = useState<SocketLiveOccupancyEvent | null>(null);
    const [latestOccupancyCount, setLatestOccupancyCount] = useState<number | null>(null);
    // empty initial state
    const [alerts, setAlerts] = useState<SocketAlertEvent[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const socketInstance = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            auth: {
                token: token,
            },
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            timeout: 10000,
            autoConnect: true,
        });

        socketRef.current = socketInstance;

        socketInstance.on("connect", () => {
            setIsConnected(true);
            // console.log("[Socket.IO] Connected to gateway:", socketInstance.id);
        });

        socketInstance.on("connect_error", (err) => {
            setIsConnected(false);
            console.warn("[Socket.IO] Gateway unreachable at:", SOCKET_URL, err.message);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
            // console.log("[Socket.IO] Disconnected from gateway");
        });

        socketInstance.on("alert", (data: SocketAlertEvent | SocketAlertEvent[]) => {
            // console.log("[Socket.IO] ALERT EVENT received:", data);

            const incomingList = Array.isArray(data) ? data : [data];
            const normalizedAlerts: SocketAlertEvent[] = incomingList.map((item) => ({
                ...item,
                id: item.id || item.eventId || `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                timestamp: item.timestamp || (item.ts ? new Date(item.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"),
            }));
            setAlerts((prev) => [...normalizedAlerts, ...prev].slice(0, 100));
        });

        socketInstance.on("live_occupancy", (data: SocketLiveOccupancyEvent) => {
            // console.log("[Socket.IO] LIVE OCCUPANCY EVENT received:", data);
            const count = data.siteOccupancy ?? data.zoneOccupancy;
            if (typeof count === "number") {
                setLatestOccupancyCount(count);
                setLatestLiveOccupancy(data);
            }
        });

        return () => {
            socketInstance.off("connect");
            socketInstance.off("disconnect");
            socketInstance.off("alert");
            socketInstance.off("live_occupancy");
            socketInstance.disconnect();
            socketRef.current = null;
        };
    }, [isAuthenticated, token]);

    const clearAlerts = useCallback(() => setAlerts([]), []);

    const getSocket = useCallback(() => socketRef.current, []);

    return (
        <SocketContext.Provider
            value={{
                isConnected,
                alerts,
                latestLiveOccupancy,
                latestOccupancyCount,
                clearAlerts,
                getSocket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}