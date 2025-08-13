import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Spin, message } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = user?.token;
                const res = await fetch("http://localhost:8080/auth/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setProfileData(data.profile);
                } else {
                    message.error(data.message || "Failed to load profile.");
                }
            } catch (err) {
                console.error(err);
                message.error("Error fetching profile.");
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.token) {
            fetchProfile();
        } else {
            setLoading(false);
            message.warning("You must be logged in to view this page.");
        }
    }, [user]);

    // Animation mount effect
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100 p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                            <Spin size="large" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 rounded-full opacity-20 animate-ping"></div>
                        </div>
                        <p className="mt-6 text-gray-600 text-lg font-medium animate-pulse">Fetching your profile...</p>
                        <div className="mt-4 w-16 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className={`w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-700 hover:shadow-2xl ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {/* Decorative Header */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 animate-gradient-x"></div>
                
                <div className="p-6 sm:p-8 bg-gradient-to-b from-[rgba(147,197,253,0.15)] via-white to-[rgba(253,224,71,0.15)]">
                    {/* Profile Header */}
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="relative inline-block mb-5">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-5 inline-flex items-center justify-center shadow-lg mb-4 sm:mb-5 transform transition-all duration-300 hover:scale-105 animate-bounce-slow">
                                <UserOutlined className="text-3xl sm:text-4xl" />
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-600 mb-2 animate-fade-in">
                            Your Profile
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base bg-blue-50 rounded-full py-2 px-4 inline-block animate-fade-in-up">
                            All your essential details at a glance
                        </p>
                    </div>
                    
                    {profileData ? (
                        <div className="space-y-5 sm:space-y-6">
                            {/* Name Field */}
                            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center gap-3 sm:gap-5 border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1 animate-fade-in-left">
                                <div className="bg-blue-100 p-2.5 sm:p-3 rounded-full flex-shrink-0 transition-transform duration-300 hover:rotate-12">
                                    <UserOutlined className="text-xl sm:text-2xl text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[0.625rem] sm:text-xs text-blue-500 uppercase tracking-wider">Full Name</p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">{profileData.name}</p>
                                </div>
                            </div>
                            
                            {/* Email Field */}
                            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center gap-3 sm:gap-5 border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1 animate-fade-in-left">
                                <div className="bg-blue-100 p-2.5 sm:p-3 rounded-full flex-shrink-0 transition-transform duration-300 hover:rotate-12">
                                    <MailOutlined className="text-xl sm:text-2xl text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[0.625rem] sm:text-xs text-blue-500 uppercase tracking-wider">Email Address</p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">{profileData.email}</p>
                                </div>
                            </div>
                            
                            {/* Additional Profile Fields */}
                            {profileData.role && (
                                <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center gap-3 sm:gap-5 border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-x-1 animate-fade-in-left">
                                    <div className="bg-blue-100 p-2.5 sm:p-3 rounded-full flex-shrink-0 transition-transform duration-300 hover:rotate-12">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[0.625rem] sm:text-xs text-blue-500 uppercase tracking-wider">Role</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">{profileData.role}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 sm:py-10 animate-fade-in-up">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 animate-pulse">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-red-600 text-lg sm:text-xl font-medium">
                                No profile data found
                            </p>
                            <p className="text-gray-500 mt-2 text-sm sm:text-base">
                                Please ensure you are logged in
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Decorative Footer */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 animate-gradient-x"></div>
            </div>
            
            {/* Custom CSS for animations */}
            <style jsx="true">{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 3s ease infinite;
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
                @keyframes fade-in-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-left {
                    animation: fade-in-left 0.8s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Profile;