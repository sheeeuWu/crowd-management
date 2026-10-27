"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormHeaderBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(10deg, #123d42 0%, #154847 60%, #154847 100%)",
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.18) 0%, rgba(13, 148, 136, 0.08) 45%, transparent 75%)",
                }}
            />

            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 420 120"
                preserveAspectRatio="none"
                style={{ opacity: 0.28 }}
            >
                <defs>
                    <linearGradient id="loginCardHeaderGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#5eead4" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                <g stroke="url(#loginCardHeaderGrad)" strokeWidth="1.5" fill="none" strokeLinejoin="round">
                    <polygon points="150,50 260,150 130,100" />
                    <polygon points="220,40 230,120 330,55" />
                    <polygon points="330,55 310,-10 430,25" />
                    <polygon points="330,55 300,120 370,125" />
                    <polygon points="330,55 370,125 450,70" />
                </g>

                <g fill="#5eead4" opacity="0.65">
                    <circle cx="130" cy="100" r="1.8" />
                    <circle cx="220" cy="40" r="1.8" />
                    <circle cx="330" cy="55" r="1.8" />
                </g>
            </svg>
        </div>
    );
}

export default function LoginPage() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        // defaultValues: {
        //     email: "test@test.com",
        //     password: "1234567890",
        // },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setApiError(null);
            await login(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Authentication failed. Please verify credentials.";
            setApiError(message);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* bg img */}
            <div className="absolute inset-0">
                <Image
                    src="/login-page-bg.png"
                    alt="login-page-bg"
                    fill
                    priority
                    className="object-cover object-center filter brightness-60 contrast-110"
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* left side */}
                <div className="w-full lg:w-1/2 text-left space-y-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide leading-snug drop-shadow-md">
                        Welcome to the <br />
                        <span>Crowd Management System</span>
                    </h1>
                </div>

                {/* right side */}
                <div className="w-full lg:w-105">
                    <div className="bg-white rounded-lg shadow-2xl transition-all">
                        <div className="relative flex items-center justify-center py-9 px-8 rounded-t-lg overflow-hidden `min-h-26.25">
                            <LoginFormHeaderBackground />

                            <div className="relative z-10 flex items-center justify-center">
                                <Image
                                    src="/Kloudspot_Horizontal.svg"
                                    alt="logo-horizontal"
                                    priority
                                    width={150}
                                    height={150}
                                    className=""
                                />
                            </div>
                        </div>

                        {/* error alert */}
                        {apiError && (
                            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                                <span className="font-semibold">Error:</span> {apiError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Log In <span className="">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                    className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-black placeholder-slate-400 focus:outline-none transition-all ${errors.email
                                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                        : "border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500"
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Password <span className="">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        {...register("password")}
                                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-black placeholder-slate-400 pr-10 focus:outline-none transition-all ${errors.password
                                            ? "border-red-400 focus:ring-2 focus:ring-red-200"
                                            : "border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-slate-700 focus:outline-none"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}