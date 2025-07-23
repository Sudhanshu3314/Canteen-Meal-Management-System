import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:flex sm:justify-between sm:items-center">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h2 className="text-xl font-semibold text-indigo-700">
                        🍽️ IGIDR Canteen Meal Management System
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Designed to simplify meal operations and enhance your dining experience.
                    </p>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} IGIDR. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer