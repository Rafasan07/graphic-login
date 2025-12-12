"use client";
import { useState, useRef, useEffect, use } from "react";

import { upload } from "@vercel/blob/client";
import ProgressBar from "./ProgressBar";
import { ToastContainer, Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ClickPoint {
    x: number;
    y: number;
}

interface RegisterModalProps {
    file?: File | null;
    imageUrl?: string;
    email: string;
    username: string;
    setEmail: (email: string) => void;
    setUsername: (username: string) => void;
    setSelectedImage: (imageUrl: string) => void;
    setUploadedImage: (imageUrl: string) => void;
    setError: (error: string) => void;
    onClose: () => void;
    maxClicks?: number;
    maxSecretClicks?: number;
}

export default function RegisterModal({
    file,
    imageUrl = '',
    email,
    username,
    setEmail,
    setUsername,
    setSelectedImage,
    setUploadedImage,
    setError,
    onClose,
    maxClicks = 5,
    maxSecretClicks = 5
}: RegisterModalProps) {
    const [clicks, setClicks] = useState<ClickPoint[]>([]);
    const [secret, setSecret] = useState<ClickPoint[]>([]);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [phase, setPhase] = useState<"normal" | "secret" | "done">("normal");
    const [fileURL, setFileURL] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const router = useRouter();

    const uploadPersonalImage = async (): Promise<string | null> => {
        if (!file) return null;
        try {
            setIsUploading(true);
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
                onUploadProgress: (progressEvent) => {
                    setProgress(progressEvent.percentage);
                },
            });
            setIsUploading(false);
            setFileURL(blob.url);
            return blob.url;
        }
        catch (err) {
            setIsUploading(false);
            return null;
        }
    }

    useEffect(() => {

        const init = async () => {
            if (imageUrl) {
                setFileURL(imageUrl);
            } else {
                const fileUrl = await uploadPersonalImage();
                if (fileUrl) {
                    setFileURL(fileUrl);

                }
            }
        };
        init();

    }, []);

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (phase === "done") return;
        const rect = (imageRef.current as HTMLImageElement).getBoundingClientRect();
        const x = Number(((e.clientX - rect.left) / rect.width).toFixed(5));
        const y = Number(((e.clientY - rect.top) / rect.height).toFixed(5));

        const newClick: ClickPoint = {
            x: parseFloat(x.toFixed(5)),
            y: parseFloat(y.toFixed(5)),
        };

        // Phase 1: normal clicks
        if (phase === "normal") {
            if (clicks.length >= maxClicks) {
                toast.success("You already selected 5 spots. Now choose your secret spots.", {
                    closeOnClick: true,
                });
                setPhase("secret");
                return;
            }

            const updated = [...clicks, newClick];
            setClicks(updated);

            if (updated.length === maxClicks) {
                setPhase("secret");
                toast.success(`Now choose ${maxSecretClicks} secret Clicks.`, {
                    closeOnClick: true,
                });
            }
            return;
        }

        // Phase 2: secret click
        if (phase === "secret") {
            if (secret.length >= maxSecretClicks) {
                toast.success("Secret Clicks saved! Click 'Register' to finish.", {
                    closeOnClick: true,
                });
                setPhase("done");
                return;
            }
            const updated = [...secret, newClick];
            setSecret(updated);
        }
    }
    const registerUser = async (email: string, username: string, imageUrl: string) => {
        toast.info("Creating your account...", {
            autoClose: 2000,
            closeOnClick: true,
        });
        try {
            const user = {
                email: email,
                username: username,
                imageUrl: imageUrl,
                picturePassword: clicks,
                secretClicks: secret,
            }
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({ error: "Server error" }));
                throw new Error(payload?.error || "Server error");
            }
            setEmail('');
            setUsername('');
            setClicks([]);
            setSecret([]);
            setSelectedImage('');
            setUploadedImage('');
            router.push('/welcome');
        } catch (err: any) {
            setError(err.message || "Unknown error");
        }
    }

    const handleDone = () => {
        if (clicks.length < maxClicks) {
            toast.error(`Please select all ${maxClicks} normal spots first.`, {
                closeOnClick: true,
            });
            return;
        }
        if (secret.length < maxSecretClicks) {
            toast.error("Please select your secret spots.", {
                closeOnClick: true,
            });
            return;
        }

        registerUser(email, username, fileURL).then(() => {
            setClicks([]);
            setSecret([]);
            setPhase("normal");
            onClose();
        });

    }

    const handleClear = () => {
        setClicks([]);
        setSecret([]);
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
                    {phase === "normal" && `Click ${maxClicks} spots on the image`}
                    {phase === "secret" && "Choose the secret spots"}
                    {phase === 'done' && "You have completed your pattern"}

                </p>

                <div className={`relative w-full aspect-square border rounded-lg overflow-hidden`}>
                    {isUploading && !fileURL ? (
                        <ProgressBar value={progress} />
                    ) : fileURL ? (
                        <img
                            ref={imageRef}
                            src={fileURL}
                            alt="Selected Image"
                            className={`w-full h-full object-cover ${phase === "done" ? "cursor-not-allowed" : "cursor-crosshair"}`}
                            onClick={handleClick}
                            width={400}
                            height={400}
                        />
                    ) : <p className="text-lg text-red-500">Cannot upload the image.</p>
                    }

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

                        >
                            {i + 1}
                        </div>
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
                        className={`px-4 py-2 rounded-lg text-white ${phase === "done"
                            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Register
                    </button>
                </div>
            </div>
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
        </div>
    );
}
