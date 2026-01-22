import React, { useState, useEffect } from "react";
import { message, Button, Tag } from "antd";
import {
    UserOutlined,
    MailOutlined,
    ArrowRightOutlined,
    ArrowLeftOutlined,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

dayjs.extend(utc);
dayjs.extend(timezone);

const Dinner = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState(null);
    const [profile, setProfile] = useState(null);
    const [targetDate, setTargetDate] = useState("");
    const [nextDate, setNextDate] = useState("");
    const [showNextDay, setShowNextDay] = useState(false);
    const [personCount, setPersonCount] = useState(1);

    /* ================= HELPERS ================= */

    const isCutoffPassed = () => {
        const now = dayjs().tz("Asia/Kolkata");
        return (
            now.hour() > 16 ||
            (now.hour() === 16 && now.minute() >= 30)
        );
    };

    const handleTokenError = () => {
        message.error("Session expired. Please login again.");
        logout?.();
        navigate("/otp-login");
    };

    /* ================= DATE LOGIC ================= */

    useEffect(() => {
        const updateDate = () => {
            const now = dayjs().tz("Asia/Kolkata");
            const date = isCutoffPassed() ? now.add(1, "day") : now;

            setTargetDate(date.format("YYYY-MM-DD"));
            setNextDate(date.add(1, "day").format("YYYY-MM-DD"));
        };

        updateDate();
        const i = setInterval(updateDate, 60000);
        return () => clearInterval(i);
    }, []);

    /* ================= DATA LOAD ================= */

    useEffect(() => {
        if (!user?.token || !targetDate) return;
        loadData();
    }, [targetDate, showNextDay]);

    const loadData = async () => {
        setLoading(true);

        try {
            const resProfile = await fetch(
                `${process.env.BACKEND_URL}/auth/profile`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            const profileData = await resProfile.json();

            if (profileData.success) setProfile(profileData.profile);
            else return handleTokenError();

            await fetchAttendance();
        } catch {
            message.error("Error loading dinner data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const date = showNextDay ? nextDate : targetDate;
            const res = await fetch(
                `${process.env.BACKEND_URL}/dinner?date=${date}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            const data = await res.json();

            if (data?.message?.toLowerCase().includes("token")) {
                handleTokenError();
                return;
            }

            setAttendance(data || {});
            setPersonCount(data?.count || 1);
        } catch {
            message.error("Error loading dinner attendance.");
        }
    };

    /* ================= SUBMIT / UPDATE ================= */

    const submitAttendance = async (status) => {
        try {
            setLoading(true);
            const date = showNextDay ? nextDate : targetDate;

            const res = await fetch(`${process.env.BACKEND_URL}/dinner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    status,
                    date,
                    count: status === "yes" ? personCount : 0,
                }),
            });

            const data = await res.json();

            if (data?.message?.toLowerCase().includes("token")) {
                handleTokenError();
                return;
            }

            if (data.success) {
                message.success(data.message);
                await fetchAttendance();
            } else {
                message.error(data.message);
            }
        } catch {
            message.error("Error submitting dinner attendance.");
        } finally {
            setLoading(false);
        }
    };

    const updateGuestCount = async (count) => {
        try {
            setLoading(true);
            const date = showNextDay ? nextDate : targetDate;

            const res = await fetch(`${process.env.BACKEND_URL}/dinner`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    status: "yes",
                    date,
                    count,
                }),
            });

            const data = await res.json();

            if (data.success) {
                message.success(
                    count === 0
                        ? "Guest count removed successfully"
                        : "Guest count updated successfully"
                );
                await fetchAttendance();
            } else {
                message.error(data.message);
            }
        } catch {
            message.error("Error updating guest count.");
        } finally {
            setLoading(false);
        }
    };

    /* ================= UI ================= */

    const AttendanceSection = ({ date }) => {
        const formattedDate = dayjs(date).format("dddd, MMMM D YYYY");

        return (
            <div className="text-center space-y-6">
                {/* DATE CARD */}
                <div className="bg-white rounded-xl p-4 shadow border border-indigo-200">
                    <p className="text-xl sm:text-2xl font-bold text-indigo-800">
                        📅 {formattedDate}
                    </p>
                    <p className="text-indigo-600 text-sm mt-1 sm:mt-2">
                        Closes at 4:30 PM, {formattedDate}
                    </p>
                </div>

                {attendance?.status ? (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4"
                    >
                        <p className="text-green-800 font-semibold">
                            Your response is recorded
                        </p>

                        {/* BIG STATUS TAG */}
                        <Tag
                            color={attendance.status === "yes" ? "green" : "red"}
                            className="px-5 py-2"
                        >
                            {attendance.status === "yes" ? (
                                <span className="font-black text-2xl tracking-wide">
                                    🍽️ Having Dinner
                                </span>
                            ) : (
                                <span className="font-black text-2xl tracking-wide">
                                    🚫 Skipping Dinner
                                </span>
                            )}
                        </Tag>

                        {attendance.status === "yes" && (
                            <>
                                {/* BIG PERSON COUNT */}
                                <p className="text-green-800 text-xl">
                                    <span className="font-bold mr-2">Persons:</span>
                                    <Tag
                                        color="blue"
                                        className="px-4 py-2 font-black text-5xl"
                                    >
                                        {attendance.count}
                                    </Tag>
                                </p>

                                {!isCutoffPassed() ? (
                                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                                        <Button
                                            icon={<PlusOutlined />}
                                            onClick={() => setAttendance(null)}
                                        >
                                            Edit Guests
                                        </Button>
                                        <Button
                                            danger
                                            icon={<MinusOutlined />}
                                            loading={loading}
                                            onClick={() => updateGuestCount(0)}
                                        >
                                            Delete Guests
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">
                                        Guest count cannot be modified after 4:30 PM
                                    </p>
                                )}
                            </>
                        )}
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {/* GUEST SELECTOR */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                            <p className="font-bold text-indigo-700 mb-3">
                                Number of Guests
                            </p>

                            <div className="flex justify-center items-center gap-4">
                                <Button
                                    icon={<MinusOutlined />}
                                    disabled={personCount <= 1}
                                    onClick={() => setPersonCount(c => c - 1)}
                                />

                                <motion.span
                                    key={personCount}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl font-bold text-indigo-800"
                                >
                                    {personCount}
                                </motion.span>

                                <Button
                                    icon={<PlusOutlined />}
                                    disabled={personCount >= 20}
                                    onClick={() => setPersonCount(c => c + 1)}
                                />
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            <Button
                                className="h-20 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-lg font-bold sm:text-xl"
                                onClick={() => submitAttendance("yes")}
                                loading={loading}
                            >
                                🍽️ Yes
                            </Button>

                            <Button
                                className="h-20 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-lg font-bold sm:text-xl"
                                onClick={() => submitAttendance("no")}
                                loading={loading}
                            >
                                🚫 No
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };


    const selectedDate = showNextDay ? nextDate : targetDate;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center py-4 text-2xl font-bold">
                    🍽️ Dinner Attendance
                </div>

                <div className="p-6 space-y-6">
                    {user && (
                        <motion.div
                            layout
                            className="flex flex-col gap-4 p-4
            bg-gradient-to-r from-indigo-50 to-purple-50
            rounded-2xl shadow-lg border border-indigo-200
            hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Name */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14
                bg-indigo-100 text-indigo-700 rounded-full shadow-inner">
                                    <UserOutlined className="text-xl sm:text-2xl" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                                        {user.name}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-500">
                                        Full Name
                                    </span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14
                bg-indigo-100 text-indigo-700 rounded-full shadow-inner">
                                    <MailOutlined className="text-lg sm:text-xl" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-base text-gray-700 truncate">
                                        {user.email}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-500">
                                        IGIDR Email
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDate}
                            initial={{ opacity: 0, x: showNextDay ? 80 : -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: showNextDay ? -80 : 80 }}
                        >
                            <AttendanceSection date={selectedDate} />
                        </motion.div>
                    </AnimatePresence>

                    <Button
                        type="primary"
                        block
                        size="large"
                        icon={
                            showNextDay ? (
                                <ArrowLeftOutlined />
                            ) : (
                                <ArrowRightOutlined />
                            )
                        }
                        onClick={() => setShowNextDay((p) => !p)}
                    >
                        {showNextDay ? "Previous Day" : "Next Day"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Dinner;
