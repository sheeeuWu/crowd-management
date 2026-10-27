"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/api";

interface AuthContextType {
    user: LoginResponse["user"] | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        }
        return null;
    });

    const [user, setUser] = useState<LoginResponse["user"] | null>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (err) {
                    console.error("Corrupted user profile in localStorage. Clearing...", err);
                    localStorage.removeItem("user");
                }
            }
        }
        return null;
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleUnauthorized = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
        };

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, [router]);

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const res = await api.login(credentials);
            if (res.token) {
                setToken(res.token);
                localStorage.setItem("token", res.token);

                const userData = res.user || {
                    id: "usr_01",
                    username: credentials.email.split("@")[0],
                    role: "Administrator",
                };
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));

                router.push("/overview");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}