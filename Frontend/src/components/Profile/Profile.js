import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Spin, message } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = user?.token;

                // Adjust this URL if your backend is not on localhost:8080
                const res = await fetch("http://localhost:8080/auth/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (data.success) {
                    console.log("API response:", data);
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

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <Spin size="large" />
                <p className="mt-4 text-gray-600 text-lg">Fetching your profile...</p> {/* Manual tip */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 via-violet-100 to-red-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 transform hover:-translate-y-1  bg-gradient-to-b from-[rgba(255,200,129,0.22)] via-white to-[rgba(142,255,131,0.22)]">
                <div className="text-center mb-8">
                    <div className="bg-indigo-500 text-white rounded-full p-4 inline-flex items-center justify-center shadow-md mb-4 animate-bounce-once">
                        <UserOutlined className="text-3xl" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
                        Your Profile
                    </h1>
                    <p className="text-gray-500 text-md">All your essential details at a glance</p>
                </div>

                {profileData ? (
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 shadow-sm border border-gray-100">
                            <UserOutlined className="text-2xl text-indigo-600" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</p>
                                <p className="text-lg font-semibold text-gray-800">{profileData.name}</p>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 shadow-sm border border-gray-100">
                            <MailOutlined className="text-2xl text-indigo-600" />
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</p>
                                <p className="text-lg font-semibold text-gray-800">{profileData.email}</p>
                            </div>
                        </div>

                        {/* You can add more profile fields here following the same pattern */}
                        {/* {profileData.role && (
                            <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4 shadow-sm border border-gray-100">
                                <TagOutlined className="text-2xl text-indigo-600" />
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</p>
                                    <p className="text-lg font-semibold text-gray-800">{profileData.role}</p>
                                </div>
                            </div>
                        )} */}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-red-600 text-lg font-medium">
                            No profile data found. Please ensure you are logged in.
                        </p>
                    </div>
                )}
            </div>
            {/* Custom CSS for a subtle animation */}
            <style jsx>{`
                @keyframes bounce-once {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    25% {
                        transform: translateY(-5px);
                    }
                    50% {
                        transform: translateY(0);
                    }
                    75% {
                        transform: translateY(-2px);
                    }
                }
                .animate-bounce-once {
                    animation: bounce-once 1s ease-out 1;
                }
            `}</style>
        </div>
    );
};

export default Profile;