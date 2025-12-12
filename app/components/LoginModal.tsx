"use client";
import { useState, useRef, useEffect, use } from "react";
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
    hasAudio: boolean;
    setError: (error: string | null) => void;
    onClose: () => void;
    maxClicks?: number;
    maxSecretClicks?: number;
    audioUrl: string[]
}

export default function LoginModal({
    imageUrl = '',
    email,
    username,
    hasAudio,
    setError,
    onClose,
    maxClicks = 5,
    maxSecretClicks = 5,
    audioUrl
}: LoginModalProps) {
    const [clicks, setClicks] = useState<ClickPoint[]>([]);
    const [secret, setSecret] = useState<ClickPoint[]>([]);
    const [phase, setPhase] = useState<"normal" | "done">("normal");

    const decideRef = useRef<() => boolean>(undefined);
    const isNextSecretRef = useRef<boolean>(false);
    const normalCountRef = useRef(0);
    const secretCountRef = useRef(0);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        // hasAudio && playAudioCue(findUrlByKeyword("direction"));
        playAudioCue(findUrlByKeyword("direction"));
        decideRef.current = decideNextClick();
    }, []);

    const playAudioCue = (url: string) => {
        if (!audioRef.current) return;
        audioRef.current.src = url;
        audioRef.current.load();
        audioRef.current.play().catch((e) => {
            // ignore play errors (autoplay/user gesture policies)
            console.warn("Audio play failed:", e);
        });
    };
    const findUrlByKeyword = (keyword: string) => {
        const lowerKeyword = keyword.toLowerCase();
        for (const url of audioUrl) {
            if (url.toLowerCase().includes(lowerKeyword)) {
                return url; // return first match
            }
        }
        return ''; // no match found
    }
    const getNewClick = (e: React.MouseEvent<HTMLImageElement>): ClickPoint => {
        const rect = (imageRef.current as HTMLImageElement).getBoundingClientRect();
        const x = Number(((e.clientX - rect.left) / rect.width).toFixed(5));
        const y = Number(((e.clientY - rect.top) / rect.height).toFixed(5));

        const newClick: ClickPoint = {
            x: parseFloat(x.toFixed(5)),
            y: parseFloat(y.toFixed(5)),
        };
        return newClick;
    }

    const decideNextClick = () => {
        let remainingNormal = maxClicks - 1;
        let remainingSecret = maxSecretClicks
        let callIndex = 0;

        return function decide() {
            callIndex++;

            // First click must be normal
            if (callIndex === 1) {
                remainingNormal--;
                return false;
            }
            const totalRemaining = remainingNormal + remainingSecret;

            // 2️⃣ If no normals left → must be secret
            if (remainingNormal === 0) {
                remainingSecret--;
                return true;
            }

            // 3️⃣ If no secrets left → must be normal
            if (remainingSecret === 0) {
                remainingNormal--;
                return false;
            }

            // 4️⃣ Probability based on remaining counts
            const pSecret = remainingSecret / totalRemaining;
            const roll = Math.random();

            if (roll < pSecret) {
                remainingSecret--;
                return true; // secret
            } else {
                remainingNormal--;
                return false; // normal
            }
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!decideRef.current) return;
        if (clicks.length == maxClicks && secret.length == maxSecretClicks) {
            return;
        }
        const clickData = getNewClick(e);

        if (isNextSecretRef.current) {
            const updated = [...secret, clickData];
            setSecret(updated);
            secretCountRef.current += 1;
        } else {
            const updated = [...clicks, clickData];
            setClicks(updated);
            normalCountRef.current += 1;
        }

        const isNextSecret = decideRef.current();

        // 4️⃣ Play audio instruction BEFORE user clicks again
        if (isNextSecret) {
            playAudioCue(findUrlByKeyword(`secret${secretCountRef.current + 1}`));
        }
        isNextSecretRef.current = isNextSecret;
        if (secretCountRef.current + normalCountRef.current >= 10) {
            setPhase("done");
            return;
        }
    };

    const handleLogin = async (): Promise<void> => {
        toast.info("Finding your account...", {
            autoClose: 2000,
            closeOnClick: true,
        });
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
                toast.error(errorMsg + " Please try again.", {
                    closeOnClick: true,
                });
                handleClear();
                return;
            }
            const payload = await res.json().catch(() => ({ error: "Server error" }));
            toast.error(payload.error || errorMsg, {
                closeOnClick: true,
            });
            handleClear();
            return;
        }
        router.push('/welcome');
    };
    const handleDone = async () => {
        if (clicks.length < maxClicks) {
            toast.error(`Please select all ${maxClicks} spots.`, {
                closeOnClick: true,
            });
            return;
        }
        if (secret.length < maxSecretClicks) {
            toast.error(`Please select all ${maxSecretClicks} spots.`, {
                closeOnClick: true,
            });
            return;
        }
        await handleLogin();
    }


    const handleClear = () => {
        setClicks([]);
        setSecret([]);
        secretCountRef.current = 0;
        normalCountRef.current = 0;
        isNextSecretRef.current = false;
        decideRef.current = decideNextClick();
        setPhase("normal");
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <audio ref={audioRef} src="/audio/test.mp3" hidden />
            <ToastContainer
                position="top-center"
                autoClose={2000}
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
                    {hasAudio ? "Please follow the Audio instructions." : "Please connect your audio device to proceed."}
                </p>

                <div className={`relative w-full aspect-square border rounded-lg overflow-hidden`}>
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Image"
                        className={`w-full h-full object-cover ${true ? phase === "done" ? "cursor-not-allowed" : "cursor-crosshair" : "cursor-not-allowed"}`}
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
                            className="absolute bg-red-500 rounded-full w-5 h-5 border-2 border-white animate-pulse flex items-center justify-center text-white text-xs font-bold"
                            style={{
                                left: `${s.x * 100}%`,
                                top: `${s.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}

                        ></div>
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
