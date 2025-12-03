import React from 'react';
import { FaUtensils, FaMoon } from 'react-icons/fa'; // Assuming react-icons/fa is available
import weeklyMenu from '../../../utils/foodMenu';
import DinnerSummary from '../Dinner/DinnerSummary';
import LunchSummary from '../Lunch/LunchSummary';

const Home = () => {
    // Get current date and day
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Fallback to Monday if today's menu is not found
    const todayMenu = weeklyMenu[day] || weeklyMenu.Monday;

    return (
        <div jsx="true" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-inter text-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 drop-shadow-lg leading-tight">
                        🍽️ Canteen Attendance Report
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-gray-700 font-medium">
                        for{" "}
                        <span className="text-purple-700 font-bold">
                            {day}, {formattedDate}
                        </span>
                    </p>
                </header>

                {/* Menu Cards Section */}
                <div className="flex flex-col md:flex-row gap-6 p-4">
                    {/* Lunch Summary - Left */}
                    <div className="w-full md:w-1/2">
                        <LunchSummary />
                    </div>

                    {/* Dinner Summary - Right */}
                    <div className="w-full md:w-1/2">
                        <DinnerSummary />
                    </div>
                </div>

            </div>

            {/* Tailwind CSS CDN - IMPORTANT for rendering in a browser environment */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Custom CSS for 'Inter' font and animations */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
          }

          @keyframes bounceIn {
            0% { transform: scale(0.5); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
          }
          .animate-bounce-in {
            animation: bounceIn 0.8s ease-out forwards;
          }
        `}
            </style>
        </div>
    );
};

export default Home;