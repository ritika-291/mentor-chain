import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="text-center max-w-lg">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 mb-4">
                    Oops!
                </h1>
                <h2 className="text-3xl font-bold mb-4">Something went wrong.</h2>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-8">
                    <p className="text-xl text-gray-300 mb-4">
                        {error.statusText || error.message || "An unexpected error occurred."}
                    </p>
                    {error.status === 404 && (
                        <p className="text-gray-400">
                            The page you are looking for does not exist or has been moved.
                        </p>
                    )}
                </div>

                <div className="flex justify-center space-x-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-lg border border-gray-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
