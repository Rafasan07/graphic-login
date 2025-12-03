"use client"
export default function WelcomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white shadow-md rounded-2xl p-10 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome Back! 👋
                </h1>

                <p className="text-gray-600 mb-8">
                    You have successfully logged in. We're happy to see you again!
                </p>
            </div>
        </div>
    );
}
