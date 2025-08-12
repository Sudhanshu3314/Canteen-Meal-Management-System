import React, { useState, useEffect } from "react";
import { message, Button, Spin, Tag } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Dinner = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState(null);
    const [profile, setProfile] = useState(null);
    const [targetDate, setTargetDate] = useState("");

    // Decide date for attendance
    useEffect(() => {
        const updateDateAndCutoff = () => {
            let now = dayjs().tz("Asia/Kolkata");
            let dateForAttendance = now.hour() >= 16 ? now.add(1, "day") : now; // cutoff 4 PM
            setTargetDate(dateForAttendance.format("YYYY-MM-DD"));
        };

        updateDateAndCutoff();
        const interval = setInterval(updateDateAndCutoff, 60000);
        return () => clearInterval(interval);
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

                const resAttendance = await fetch(`http://localhost:8080/dinner?date=${targetDate}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const attData = await resAttendance.json();
                setAttendance(attData || {});
            } catch (err) {
                console.error(err);
                message.error("Error loading dinner data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, targetDate]);

    const submitAttendance = async (status) => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/dinner", {
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
            message.error("Error submitting dinner attendance.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50 px-4">
                <Spin size="large" />
                <p className="mt-4 text-gray-600 text-lg text-center">Loading dinner attendance...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 via-violet-100 to-red-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 bg-gradient-to-b from-[rgba(255,200,129,0.22)] via-white to-[rgba(142,255,131,0.22)]">

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="bg-indigo-500 text-white rounded-full p-3 sm:p-4 inline-flex items-center justify-center shadow-md mb-3 sm:mb-4">
                        <UserOutlined className="text-2xl sm:text-3xl" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
                        Dinner Attendance
                    </h1>
                    <p className="text-red-500 font-bold text-lg sm:text-base">
                        For {targetDate}
                    </p>
                    <p className="text-gray-500 font-semibold text-xs sm:text-base">
                        Dinner attendance closes at 4:00 PM every day
                    </p>
                </div>

                {/* Profile Info */}
                {profile && (
                    <div className="space-y-3 sm:space-y-4 mb-6">
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex items-center gap-3 sm:gap-4 border">
                            <UserOutlined className="text-xl sm:text-2xl text-indigo-600" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Full Name</p>
                                <p className="text-base sm:text-lg font-semibold break-words">{profile.name}</p>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg flex items-center gap-3 sm:gap-4 border">
                            <MailOutlined className="text-xl sm:text-2xl text-indigo-600" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Email Address</p>
                                <p className="text-base sm:text-lg font-semibold break-words">{profile.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Actions */}
                <div className="text-center">
                    {attendance?.status && attendance.status !== "no response" ? (
                        <p className="text-sm sm:text-base">
                            You already responded:{" "}
                            <Tag color={attendance.status === "yes" ? "green" : "red"}>
                                {(attendance.status || "").toUpperCase()}
                            </Tag>
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4 items-center">
                            <h1 className="text-base sm:text-lg font-semibold text-red-500 text-center">
                                You didn’t respond anything ???
                            </h1>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                                <Button
                                    type="primary"
                                    className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 text-base sm:text-lg"
                                    onClick={() => submitAttendance("yes")}
                                >
                                    ✅ Yes, I’ll eat dinner
                                </Button>
                                <Button
                                    danger
                                    className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 text-base sm:text-lg"
                                    onClick={() => submitAttendance("no")}
                                >
                                    ❌ No, I’ll skip
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dinner;
