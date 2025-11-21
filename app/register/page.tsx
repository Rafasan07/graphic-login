"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ImageSelectionPanel, { ImageSelectionPanelProps } from "../components/ImageSelectionPanel";
import { sanitizeEmail, sanitizeUsername } from "../utils/validation";
import RegisterModal from "../components/RegisterModal";


interface LoginEvent extends React.FormEvent<HTMLFormElement> { }


export interface ClickPoint {
    x: number;
    y: number;
}
export default function Register() {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [passwordClicks, setPasswordClicks] = useState<ClickPoint[]>([]);
    const [secretClick, setSecretClick] = useState<ClickPoint | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [uploadedImage, setUploadedImage] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);


    const savePattern = async () => {
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
        setEmail(emailSan.value);
        setUsername(userSan.value);
        setShowModal(true);
    }

    const clearSelectedImage = () => {
        setSelectedImage('');
        setPasswordClicks([]);
        setSecretClick(null);
    }

    return (
        <div className={`flex items-center min-h-screen p-4 bg-gray-100 lg:justify-center transition-all duration-200
              ${uploadedImage !== '' ? "border-blue-500 scale-105" : "border-transparent"}`}>
            <div
                className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 max-w-[fit-content]"
            >

                <div className="p-5 bg-white md:flex-1 text-gray-700">
                    <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Register</h3>
                    <form className="flex flex-col space-y-5">
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
                            <p className="text-sm font-semibold">Upload Your Own Picture or Select an image</p>
                            <div className="max-w-md mx-auto">
                                {!secretClick && passwordClicks.length === 0 ?
                                    <div className="relative group w-full">
                                        <input
                                            type="file"
                                            onChange={(e) => setUploadedImage(e.target.files ? e.target.files[0].name : '')}
                                            ref={inputFileRef}
                                            accept="image/jpeg, image/png, image/webp"
                                            disabled={username === '' || email === ''}
                                            className={`block w-full text-sm text-gray-500 cursor-pointer
                                                        file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                                                        file:text-sm file:font-semibold
                                                        file:bg-blue-600 file:text-white 
                                                        hover:file:bg-blue-700
                                                        disabled:cursor-not-allowed 
                                                        disabled:opacity-50 
                                                        disabled:file:bg-gray-300 
                                                        disabled:file:text-gray-600
                                                        disabled:hover:file:bg-gray-300
                                                        `}
                                        />
                                        {(username === '' || email === '') && (
                                            <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                                                Please fill in the fields
                                            </div>
                                        )}
                                        {/* {isUploading && <ProgressBar value={progress} />} */}
                                    </div>
                                    :
                                    <div className="flex flex-col items-start">
                                        <p className="text-yellow-500">Password Pattern and Image Already Selected.</p>
                                        <button
                                            className="text-left  py-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                            onClick={clearSelectedImage}>Clear and and upload picture instead?</button>
                                    </div>}
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={savePattern}
                                className="cursor-pointer w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
                            >
                                Save Pattern
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
                    <ImageSelectionPanel
                        setShowModal={setShowModal}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        clearSelection={clearSelectedImage}
                    />
                    {showModal &&
                        <RegisterModal
                            imageUrl={selectedImage}
                            file={inputFileRef.current?.files ? inputFileRef.current.files[0] : null}
                            email={email}
                            username={username}
                            setEmail={setEmail}
                            setUsername={setUsername}
                            setSelectedImage={setSelectedImage}
                            setUploadedImage={setUploadedImage}
                            setError={setError}
                            onClose={() => setShowModal(false)}

                        />}
                </div>
            </div>
        </div>
    );
}
