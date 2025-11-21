"use client";
import { on } from "events";
import { useState, useRef, useEffect, use } from "react";
import Image from 'next/image'
import router, { useRouter } from "next/router";
import { upload } from "@vercel/blob/client";
import ProgressBar from "./ProgressBar";
import { sanitizeEmail, sanitizeUsername } from "../utils/validation";

interface ClickPoint {
    x: number;
    y: number;
}

interface LoginModalProps {
    imageUrl?: string;
    email: string;
    username: string;
    setError: (error: string | null) => void;
    onClose: () => void;
    maxClicks?: number;
}

export default function LoginModal({
    imageUrl = '',
    email,
    username,
    setError,
    onClose,
    maxClicks = 5,
}: LoginModalProps) {
    const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]);
    const [secret, setSecret] = useState<ClickPoint | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [phase, setPhase] = useState<"normal" | "secret" | "done">("normal");

    // const router = useRouter();



    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (phase === "done") return;
        const rect = (imageRef.current as HTMLImageElement).getBoundingClientRect();
        const x = Number(((e.clientX - rect.left) / rect.width).toFixed(3));
        const y = Number(((e.clientY - rect.top) / rect.height).toFixed(3));

        const newClick: ClickPoint = {
            x: parseFloat(x.toFixed(3)),
            y: parseFloat(y.toFixed(3)),
        };

        // Phase 1: normal clicks
        if (phase === "normal") {
            if (clicks.length >= maxClicks) {
                alert("You already selected 5 spots. Now choose your secret spot.");
                setPhase("secret");
                return;
            }

            const updated = [...clicks, newClick];
            setClicks(updated);

            if (updated.length === maxClicks) {
                setPhase("secret");
                alert("Now choose your one secret click spot.");
            }
            return;
        }

        // Phase 2: secret click
        if (phase === "secret") {
            if (secret) {
                alert("You already selected your secret spot.");
                return;
            }
            setSecret(newClick);
            setPhase("done");
            alert("Secret spot saved! Click 'Login' to finish.");
        }
    }

    const handleLogin = async (): Promise<void> => {
        // TODO: send login request to /api/login
        setError(null);
        const emailSan = sanitizeEmail(email);
        if (!emailSan.ok) {
            setError(emailSan.error);
            return;
        }
        const userSan = sanitizeUsername(username);
        if (!userSan.ok) {
            setError(userSan.error);
            return;
        }

        // logic to collect and auth clicks here
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                username: username,
                imageUrl: imageUrl,
                passwordClicks: clicks,
                secretClick: secret,
            }),
        });
        if (!res.ok) {
            const payload = await res.json().catch(() => ({ error: "Server error" }));
            throw new Error(payload?.error || "Server error");
        }
        router.push('/welcome');
    };
    const handleDone = async () => {
        if (clicks.length < maxClicks) {
            alert(`Please select all ${maxClicks} normal spots first.`);
            return;
        }
        if (!secret) {
            alert("Please select your secret spot.");
            return;
        }

        await handleLogin();

    }


    const handleClear = () => {
        setClicks([]);
        setSecret(null);
        setPhase("normal");
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-[90%] max-w-md">
                <button
                    onClick={onClose}
                    className="text-red-500 hover:text-red-800 text-xl font-bolder cursor-pointer absolute"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <p className="text-sm text-gray-500 mb-3 text-center">
                    {phase === "normal"
                        ? `Click up to ${maxClicks} spots on the image`
                        : phase === "secret"
                            ? "Choose one secret spot"
                            : "You have completed your pattern"}
                </p>

                <div className={`relative w-full aspect-square border rounded-lg overflow-hidden`}>
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Image"
                        className={`w-full h-full object-cover ${phase === "done" ? "cursor-not-allowed" : "cursor-crosshair"}`}
                        onClick={handleClick}
                        width={400}
                        height={400}
                    />
                    {clicks.map((c, i) => (
                        <div
                            key={i}
                            className="absolute bg-blue-500 rounded-full w-4 h-4 border-2 border-white"
                            style={{
                                left: `${c.x * 100}%`,
                                top: `${c.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}

                        />
                    ))}
                    {secret && (
                        <div
                            className="absolute bg-red-500 rounded-full w-5 h-5 border-2 border-white animate-pulse"
                            style={{
                                left: `${secret.x * 100}%`,
                                top: `${secret.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    )}

                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleClear}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Clear
                    </button>

                    <button
                        onClick={handleDone}
                        className={`px-4 py-2 rounded-lg text-white 
                            ${phase === "done"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
