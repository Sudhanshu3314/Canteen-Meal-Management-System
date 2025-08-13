import React, { useState, useEffect } from "react";
import { message, Button, Spin, Tag } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Lunch = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState(null);
    const [profile, setProfile] = useState(null);
    const [targetDate, setTargetDate] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // Decide which date we are taking attendance for
    useEffect(() => {
        const updateDateAndCutoff = () => {
            let now = dayjs().tz("Asia/Kolkata");
            let dateForAttendance = now.hour() >= 9 ? now.add(1, "day") : now;
            setTargetDate(dateForAttendance.format("YYYY-MM-DD"));
        };
        updateDateAndCutoff();
        const interval = setInterval(updateDateAndCutoff, 60000);
        return () => clearInterval(interval);
    }, []);

    // Animation mount effect
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Fetch profile + attendance
    useEffect(() => {
        if (!user?.token || !targetDate) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const resProfile = await fetch("http://localhost:8080/auth/profile", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const profileData = await resProfile.json();
                if (profileData.success) setProfile(profileData.profile);
                else message.error(profileData.message);

                const resAttendance = await fetch(`http://localhost:8080/lunch?date=${targetDate}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const attData = await resAttendance.json();
                setAttendance(attData || {}); // ensure it's at least an object
            } catch (err) {
                console.error(err);
                message.error("Error loading lunch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, targetDate]);

    const submitAttendance = async (status) => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/lunch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ status, date: targetDate })
            });
            const data = await res.json();
            if (data.success) {
                message.success(data.message);
                setAttendance({ date: targetDate, status });
            } else {
                message.error(data.message);
            }
        } catch (err) {
            console.error(err);
            message.error("Error submitting lunch attendance.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                <Spin size="large" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white animate-bounce">
                                🍔
                            </div>
                        </div>
                        <p className="mt-4 text-amber-700 text-lg font-medium animate-pulse">Loading your Lunch attendance...</p>
                        <div className="mt-4 flex space-x-1">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className={`w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-700 hover:shadow-2xl ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {/* Decorative Header with lunch theme */}
                <div className="h-16 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="h-full w-16 bg-white opacity-10" style={{ transform: `skewX(${i * 5}deg)` }}></div>
                        ))}
                    </div>
                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="text-4xl animate-bounce">🍱</div>
                        <h1 className="text-2xl font-bold text-white">Lunch Attendance</h1>
                        <div className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🥗</div>
                    </div>
                </div>
                <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50 to-white">
                    {/* Date and time info with lunch theme */}
                    <div className="text-center mb-8 bg-white rounded-xl p-4 shadow-sm border border-amber-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-amber-500">📅</span>
                            <p className="text-lg font-semibold text-amber-800">For {targetDate}</p>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-amber-500">⏰</span>
                            <p className="text-amber-600">Closes at 9:00 AM every day</p>
                        </div>
                    </div>
                    {/* Profile Info with lunch theme */}
                    {profile && (
                        <div className="space-y-4 mb-8">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 flex items-center space-x-4 transition-all duration-300 hover:shadow-md hover:border-amber-300 animate-fade-in-left">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <UserOutlined className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-amber-600 uppercase tracking-wider font-bold">Full Name</p>
                                    <p className="font-medium text-gray-800">{profile.name}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 flex items-center space-x-4 transition-all duration-300 hover:shadow-md hover:border-amber-300 animate-fade-in-left">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                    <MailOutlined className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-amber-600 uppercase tracking-wider font-bold">Email Address</p>
                                    <p className="font-medium text-gray-800 truncate">{profile.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Attendance Actions with lunch theme */}
                    <div className="text-center">
                        {attendance?.status && attendance.status !== "no response" ? (
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200 animate-fade-in-up">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <span className="text-green-500 text-2xl">✅</span>
                                    <p className="text-lg font-medium text-green-800">Your response has been recorded</p>
                                </div>
                                <p className="text-green-700">
                                    You Opted For :{" "}
                                    <Tag color={attendance.status === "yes" ? "green" : "red"} className="text-lg px-3 py-1">
                                        {attendance.status === "yes" ? "Having Lunch" : "Skipping Lunch"}
                                    </Tag>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 animate-fade-in-up">
                                    <div className="flex items-center justify-center space-x-2">
                                        <span className="text-amber-500 text-xl">⚠️</span>
                                        <h3 className="text-lg font-bold text-amber-700">Time to decide!</h3>
                                    </div>
                                    <p className="text-amber-600 mt-2">Will you be joining us for lunch today?</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Button
                                        className="!h-24 !w-full sm:!w-56 !py-4 !px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex flex-col items-center justify-center animate-fade-in-left group relative overflow-hidden"
                                        onClick={() => submitAttendance("yes")}
                                    >
                                        {/* Decorative shine effect */}
                                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-white/30 to-transparent"></div>

                                        {/* Emoji with enhanced styling */}
                                        <div className="relative mb-2">
                                            <span className="text-3xl transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">🍽️</span>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center">
                                                <span className="text-xs">✓</span>
                                            </div>
                                        </div>

                                        {/* Text with enhanced styling */}
                                        <span className="font-bold text-base sm:text-lg transition-all duration-300 drop-shadow-md">Yes, I'm hungry!</span>

                                        {/* Decorative elements */}
                                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20"></div>
                                        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-white/20"></div>

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                        {/* Animated border */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Button>

                                    <Button
                                        className="!h-24 !w-full sm:!w-56 !py-4 !px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 flex flex-col items-center justify-center animate-fade-in-right group relative overflow-hidden"
                                        onClick={() => submitAttendance("no")}
                                    >
                                        {/* Decorative shine effect */}
                                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-white/30 to-transparent"></div>

                                        {/* Emoji with enhanced styling */}
                                        <div className="relative mb-2">
                                            <span className="text-3xl transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">🚫</span>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                                <span className="text-xs text-rose-600">✗</span>
                                            </div>
                                        </div>

                                        {/* Text with enhanced styling */}
                                        <span className="font-bold text-base sm:text-lg transition-all duration-300 drop-shadow-md">No, thanks!</span>

                                        {/* Decorative elements */}
                                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20"></div>
                                        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-white/20"></div>

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                        {/* Animated border */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Decorative Footer with lunch theme */}
                <div className="h-16 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="h-full w-16 bg-white opacity-10" style={{ transform: `skewX(${i * 5}deg)` }}></div>
                        ))}
                    </div>
                    <div className="relative z-10 flex items-center space-x-2">
                        <span className="text-white text-2xl animate-pulse">🍕</span>
                        <span className="text-white text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>🌮</span>
                        <span className="text-white text-2xl animate-pulse" style={{ animationDelay: '0.6s' }}>🍜</span>
                    </div>
                </div>
            </div>
            {/* Custom CSS for animations */}
            <style jsx="true">{`
                @keyframes fade-in-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-left {
                    animation: fade-in-left 0.8s ease-out;
                }
                
                @keyframes fade-in-right {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 0.8s ease-out;
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Lunch;