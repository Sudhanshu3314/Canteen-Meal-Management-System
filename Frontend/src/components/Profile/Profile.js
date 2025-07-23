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
            <div className="flex justify-center items-center h-[50vh]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="h-[80vh] bg-gradient-to-br from-teal-100 via-violet-100 to-red-100 px-4 py-10">
            <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-indigo-600 mb-2">
                        👤 Profile Details
                    </h1>
                    <p className="text-gray-500">Your personal information</p>
                </div>

                {profileData ? (
                    <div className="space-y-6 text-gray-700 text-base">
                        <div className="flex items-center gap-4 border-b pb-4">
                            <UserOutlined className="text-xl text-indigo-500" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Full Name</p>
                                <p className="text-lg font-medium">{profileData.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 border-b pb-4">
                            <MailOutlined className="text-xl text-indigo-500" />
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Email</p>
                                <p className="text-lg font-medium">{profileData.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-red-500">No profile data found.</p>
                )}
            </div>
        </div>
    );

};

export default Profile;
