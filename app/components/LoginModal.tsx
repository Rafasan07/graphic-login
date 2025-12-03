"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { sanitizeEmail, sanitizeUsername } from "../utils/validation";
import { Bounce, ToastContainer, toast } from 'react-toastify';

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
    maxSecretClicks?: number;
}

export default function LoginModal({
    imageUrl = '',
    email,
    username,
    setError,
    onClose,
    maxClicks = 5,
    maxSecretClicks = 3
}: LoginModalProps) {
    const [clicks, setClicks] = useState<ClickPoint[]>([]);
    const [secret, setSecret] = useState<ClickPoint[]>([]);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [phase, setPhase] = useState<"normal" | "secret" | "done">("normal");

    const router = useRouter();

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
                toast.success("You already selected 5 spots. Now choose your secret spots.");
                setPhase("secret");
                return;
            }

            const updated = [...clicks, newClick];
            setClicks(updated);

            if (updated.length === maxClicks) {
                setPhase("secret");
                toast.success(`Now choose ${maxSecretClicks} secret Clicks.`);
            }
            return;
        }

        // Phase 2: secret click
        if (phase === "secret") {
            if (secret.length === maxSecretClicks) {
                toast.success("Secret Clicks saved! Click 'Login' to finish.");
                setPhase("done");
                return;
            }
            const updated = [...secret, newClick];
            setSecret(updated);
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
        const user = {
            email: email,
            username: username,
            imageUrl: imageUrl,
            picturePassword: clicks,
            secretClicks: secret,
        }
        // logic to collect and auth clicks here
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        if (!res.ok) {
            let errorMsg = 'Could not log in at this time. Please try again later.';
            if (res.status === 400) {
                const payload = await res.json().catch(() => ({}));
                errorMsg = payload?.error || "Invalid login data";
                toast.error(errorMsg + " Please try again.");
                handleClear();
                return;
            }
            const payload = await res.json().catch(() => ({ error: "Server error" }));
            toast.error(payload.error || errorMsg);
            handleClear();
            return;
        }
        router.push('/welcome');
    };
    const handleDone = async () => {
        if (clicks.length < maxClicks) {
            toast.error(`Please select all ${maxClicks} normal spots first.`);
            return;
        }
        if (!secret) {
            toast.error("Please select your secret spot.");
            return;
        }

        await handleLogin();

    }


    const handleClear = () => {
        setClicks([]);
        setSecret([]);
        setPhase("normal");
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
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
                    {secret.map((s, i) => (
                        <div
                            key={i}
                            className="absolute bg-red-500 rounded-full w-5 h-5 border-2 border-white animate-pulse"
                            style={{
                                left: `${s.x * 100}%`,
                                top: `${s.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}

                        />
                    ))}

                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleClear}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                    >
                        Clear
                    </button>

                    <button
                        onClick={handleDone}
                        className={`px-4 py-2 rounded-lg text-white 
                            ${phase === "done"
                                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
