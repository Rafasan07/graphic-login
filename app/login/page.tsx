"use client"
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import ClickableImage from "../components/ClickableImage";
import { ClickPoint } from "../register/page";
import { sanitizeEmail, sanitizeUsername } from "../utils/validation";
import LoginModal from "../components/LoginModal";

interface LoginEvent extends React.FormEvent<HTMLFormElement> { }
interface Coord {
    x: number;
    y: number;
}
interface Account {
    username: string;
    email: string;
    password: Coord;
}

export default function Login() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);


    const loadPicturePassword = () => {
        // write logic to find user by username & email and return his picture url
        try {
            // const user = await fetch("/api/getUser", {
            //     method: "Get",
            //     headers: { "Content-Type": "application/json" },

            // });
            // console.log("USER = ", user)
            setUploadedImage('file.svg');
            setShowModal(true);
        } catch (err) {
            setError("Could not find the user!");
        }

    }


    return (
        <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
            <div
                className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
            >

                <div className="p-5 bg-white md:flex-1 text-gray-700">
                    <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
                    <form action="#" className="flex flex-col space-y-5">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="username" className="text-sm font-semibold">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                                autoFocus
                                required
                                value={username}
                                onChange={handle => setUsername(handle.target.value)} />
                            <label htmlFor="email" className="text-sm font-semibold">Email address</label>
                            <input
                                type="email"
                                id="email"
                                autoFocus
                                required
                                value={email}
                                onChange={handle => setEmail(handle.target.value)}
                                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                            {error && <div className="text-sm text-red-600">{error}</div>}

                        </div>
                        <div>
                            <button
                                className="w-full 
                                                px-4 py-2 mt-2 text-lg font-semibold 
                                                text-white transition-colors 
                                                duration-300 bg-green-500 rounded-md shadow 
                                                hover:bg-green-600 
                                                focus:outline-none 
                                                focus:ring-green-200
                                                focus:ring-4 
                                                cursor-pointer 
                                                disabled:cursor-not-allowed 
                                                disabled:opacity-50 
                                                disabled:file:bg-gray-300 
                                                disabled:file:text-gray-600
                                                disabled:hover:file:bg-gray-300"
                                disabled={username === '' || email === ''}
                                onClick={loadPicturePassword}
                            >
                                Load Picture
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-gray-500">Not registered yet?</p>
                            <a href="/register" className="text-sm text-blue-600 hover:underline">Register Now</a>
                        </div>
                    </form>
                </div>
                <div
                    className="p-4 py-6  bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
                >
                    <div className="text-l text-white font-bold tracking-wider text-center">
                        <p>Load your picture once you're ready</p>
                    </div>
                    <div className="my-3 text-l font-bold text-left">
                        <span className="text-xl text-yellow-300 font-bold">🎧</span>
                        <small className="text-yellow-300 font-bold">*Make sure to wear a headset to follow audio cues</small>
                    </div>
                    {showModal &&
                        <LoginModal
                            imageUrl={uploadedImage}
                            email={email}
                            username={username}
                            setError={setError}
                            onClose={() => setShowModal(false)}
                        />}

                </div>
            </div>
        </div>
    );
}