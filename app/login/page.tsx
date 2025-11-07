"use client"
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import ClickableImage from "../components/ClickableImage";

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
    const [password, setPassword] = useState('');
    const [listening, setListening] = useState(false);
    const [coords, setCoords] = useState<Coord[]>([]);
    const router = useRouter();

    const handleLogin = async (e: LoginEvent): Promise<void> => {
        e.preventDefault();
        // TODO: send login request to /api/login
        router.push('/welcome');
    };
    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const rect = (e.target as HTMLImageElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCoords([...coords, { x, y }]);
        console.log(`Clicked at: (${x}, ${y})`, coords);
    };
    const loadPicturePassword = () => {
        setListening(true);
    }
    const resetPicturePassword = () => {
        setListening(false);
        setCoords([]);
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
                            <div className="flex justify-between">
                                <button className="text-sm text-blue-600 hover:underline self-baseline py-2 cursor-pointer" onClick={loadPicturePassword}>Load Picture Password</button>
                                <button className="text-sm text-red-600 hover:underline self-baseline py-2 cursor-pointer" onClick={resetPicturePassword}>Reset Password</button>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                onSubmit={e => handleLogin}
                                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4 cursor-pointer"
                            >
                                Log in
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
                    <ClickableImage
                        src="file.svg"
                        width={320}
                        height={240}
                        className="p-2 cursor-crosshair"
                        onClick={handleClick}
                    />

                </div>
            </div>
        </div>
    );
}