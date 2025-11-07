"use client"
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClickableImage from "../components/ClickableImage";
import ImageSelectionPanel, { ImageSelectionPanelProps } from "../components/ImageSelectionPanel";

interface LoginEvent extends React.FormEvent<HTMLFormElement> { }
interface Coord {
    x: number;
    y: number;
}
const MOCK_STOCK_IMAGES = [
    'file.svg',
    'file.svg',
    'file.svg',
    'file.svg',
    'file.svg',
    'file.svg',
    'file.svg',
    'file.svg',
]
export default function Register() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [coords, setCoords] = useState<Coord[]>([]);
    const [stockImages, setStockImages] = useState<string[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchStockImages = async () => {
            setStockImages(MOCK_STOCK_IMAGES);
            // try {
            //     const response = await fetch('/api/stock-images');
            //     if (response.ok) {
            //         const data = await response.json();

            //     } else {
            //         console.error('Failed to fetch stock images');
            //     }
            // } catch (error) {
            //     console.error('Error fetching stock images:', error);
            // }
        }
        fetchStockImages();
    }, []);
    const handleLogin = async (e: LoginEvent): Promise<void> => {
        e.preventDefault();
        // TODO: send login request to /api/login
        router.push('/welcome');
    };

    return (
        <div className="flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
            <div
                className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 max-w-4/5"
            >

                <div className="p-5 bg-white md:flex-1 text-gray-700">
                    <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Register</h3>
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
                            <p className="text-sm font-semibold">Upload Your Own Picture or Select an image</p>
                            <div className="max-w-md mx-auto p-4">
                                <label className="flex flex-col items-center px-2 py-2 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition">
                                    <span className="mt-2 text-base leading-normal">Upload an image</span>
                                    <svg viewBox="0 0 1024 1024"
                                        className="icon"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000000">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path d="M77.312 286.208h503.808v559.104H77.312z" fill="#6188ff">
                                            </path>
                                            <path d="M133.632 342.016h391.68v335.36H133.632z" fill="#FFFFFF"></path>
                                            <path d="M189.44 621.568h93.184L236.032 537.6zM375.808 453.632l-93.184 167.936h186.88z" fill="#FFD561"></path>
                                            <path d="M637.44 621.568v83.456l337.408-165.376-211.456-432.64-252.928 122.88h110.08l120.32-58.368 127.488 259.584-230.912 113.152z" fill="#6188ff"></path>
                                        </g>
                                    </svg>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                onClick={e => handleLogin}
                                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                            >
                                Register
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-gray-500">Already Registered?</p>
                            <a href="/login" className="text-sm text-blue-600 hover:underline">Login</a>
                        </div>
                    </form>
                </div>
                <div
                    className="p-4 py-6 text-white bg-blue-500 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly w-4/5"
                >
                    {/* stock image grid */}
                    <ImageSelectionPanel images={stockImages} />
                    {/* upload my own image */}
                </div>
            </div>
        </div>
    );
}