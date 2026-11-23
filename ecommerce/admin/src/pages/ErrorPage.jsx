
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-6">

            <div className="w-full max-w-lg text-center">

                {/* Error Code */}
                <h1 className="text-[120px] font-extrabold leading-none text-[#155e52]">
                    404
                </h1>

                {/* Content */}
                <h2 className="mt-6 text-3xl font-bold text-gray-800">
                    Page Not Found
                </h2>

                <p className="mt-3 text-base text-gray-500 leading-7">
                    Sorry, the page you are looking for doesn't exist
                    or may have been moved.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex items-center justify-center gap-4">

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                        <FiArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-xl bg-[#155e52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10483f]"
                    >
                        <FiHome size={18} />
                        Dashboard
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default ErrorPage;
