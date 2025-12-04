"use client"
import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar";

export default function WelcomePage() {
    const [username, setUsername] = useState<string | null>(null);
    useEffect(() => {
        fetch('/api/me').then(res => res.json()).then(data => {
            setUsername(data?.user?.username);
        });
    }, []);
    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
        });
        window.location.href = "/login";
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-gray-300 shadow-md rounded-2xl p-10 max-w-md w-full text-center">
                {username ?
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Welcome {username}! 👋
                        </h1>

                        <p className="text-gray-600 mb-8">
                            You have successfully logged in. We're happy to see you!
                        </p>
                        <button
                            onClick={handleLogout}
                            className={"px-4 py-2 rounded-lg text-white bg-red-400 hover:bg-red-700 cursor-pointer"}
                        >
                            Logout
                        </button>
                    </div>
                    :
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-600">Fetching your Account...</h2>
                        <ProgressBar value={0} infinite />
                    </div>}
            </div>
        </div>
    );
}
