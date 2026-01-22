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
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Lunch = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState(null);
    const [targetDate, setTargetDate] = useState("");
    const [nextDate, setNextDate] = useState("");
    const [showNextDay, setShowNextDay] = useState(false);
    const [personCount, setPersonCount] = useState(1);

    // ================= HELPERS =================
    const isCutoffPassed = () => dayjs().tz("Asia/Kolkata").hour() >= 9;

    const fetchWithAuth = async (url, options = {}) => {
        try {
            if (!user?.token) throw new Error("No user token found");

            const fetchOptions = {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                    Authorization: `Bearer ${user.token}`,
                },
            };

            console.log("Fetching URL:", url);
            console.log("Options:", fetchOptions);

            const res = await fetch(url, fetchOptions);

            if (res.status === 401) {
                message.error("Session expired. Please login again");
                navigate("/otp-login");
                return null;
            }

            const data = await res.json();
            return data;
        } catch (err) {
            console.error("fetchWithAuth error:", err);
            message.error("Network error");
            return null;
        }
    };

    // ================= DATE LOGIC =================
    useEffect(() => {
        const updateDate = () => {
            const now = dayjs().tz("Asia/Kolkata");
            const todayOrNext = now.hour() >= 9 ? now.add(1, "day") : now;
            setTargetDate(todayOrNext.format("YYYY-MM-DD"));
            setNextDate(todayOrNext.add(1, "day").format("YYYY-MM-DD"));
        };
        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    // ================= DATA LOAD =================
    useEffect(() => {
        if (!user?.token || !targetDate) return;
        loadData();
    }, [targetDate, showNextDay]);

    const loadData = async () => {
        setLoading(true);
        await fetchAttendance();
        setLoading(false);
    };

    const fetchAttendance = async () => {
        const date = showNextDay ? nextDate : targetDate;
        const res = await fetchWithAuth(
            `${process.env.REACT_APP_BACKEND_URL}/lunch?date=${date}`
        );
        if (res) {
            setAttendance(res);
            setPersonCount(res?.count || 1);
        }
    };

    // ================= SUBMIT / UPDATE =================
    const submitAttendance = async (status) => {
        setLoading(true);
        const date = showNextDay ? nextDate : targetDate;

        const res = await fetchWithAuth(`${process.env.REACT_APP_BACKEND_URL}/lunch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, date, count: status === "yes" ? personCount : 0 }),
        });

        if (res?.success) {
            message.success(res.message);
            await fetchAttendance();
        } else {
            message.error(res?.message || "Error submitting attendance");
        }

        setLoading(false);
    };

    const updateGuestCount = async (count) => {
        setLoading(true);
        const date = showNextDay ? nextDate : targetDate;

        const res = await fetchWithAuth(`${process.env.REACT_APP_BACKEND_URL}/lunch`, {
            method: "POST",
            body: JSON.stringify({ status: "yes", date, count }),
        });

        if (res?.success) {
            message.success(count === 0 ? "Guest count removed" : "Guest count updated");
            await fetchAttendance();
        } else {
            message.error(res?.message || "Error updating guest count");
        }

        setLoading(false);
    };

    // ================= UI =================
    const AttendanceSection = ({ date }) => {
        const formattedDate = dayjs(date).format("dddd, MMMM D YYYY");

        return (
            <div className="text-center space-y-6">
                <div className="bg-white rounded-xl p-4 shadow border border-amber-200">
                    <p className="text-xl sm:text-2xl font-bold text-amber-800">📅 {formattedDate}</p>
                    <p className="text-amber-600 text-sm mt-1 sm:mt-2">
                        Closes at 9:00 AM, {formattedDate}
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
                        <p className="text-green-800 font-semibold">Your response is recorded</p>

                        <Tag
                            color={attendance.status === "yes" ? "green" : "red"}
                            className="px-5 py-2"
                        >
                            {attendance.status === "yes" ? (
                                <span className="font-black text-2xl tracking-wide">
                                    🍽️ Having Lunch
                                </span>
                            ) : (
                                <span className="font-black text-2xl tracking-wide">
                                    🚫 Skipping Lunch
                                </span>
                            )}
                        </Tag>


                        {attendance.status === "yes" && (
                            <>
                                <p className="text-green-800 text-xl">
                                    <span className="font-bold mr-2">Persons:</span>
                                    <Tag
                                        color="blue"
                                        className="px-4 py-2 font-black text-5xl"
                                    >
                                        {attendance.count}
                                    </Tag>
                                </p>

                                {isCutoffPassed() ? (
                                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                                        <Button icon={<PlusOutlined />} onClick={() => setAttendance(null)}>
                                            Edit Guests
                                        </Button>
                                        <Button danger icon={<MinusOutlined />} loading={loading} onClick={() => updateGuestCount(0)}>
                                            Delete Guests
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">Guest count cannot be modified after 9:00 AM</p>
                                )}
                            </>
                        )}
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="font-bold text-amber-700 mb-3">Number of Guests</p>
                            <div className="flex justify-center items-center gap-4">
                                <Button icon={<MinusOutlined />} disabled={personCount <= 1} onClick={() => setPersonCount(c => c - 1)} />
                                <motion.span
                                    key={personCount}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="text-2xl font-bold text-amber-800"
                                >
                                    {personCount}
                                </motion.span>
                                <Button icon={<PlusOutlined />} disabled={personCount >= 20} onClick={() => setPersonCount(c => c + 1)} />
                            </div>
                        </div>

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
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex justify-center items-center p-4 sm:p-6">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-4 sm:py-5 text-2xl sm:text-3xl font-bold">
                    🍱 Lunch Attendance
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                    {user && (
                        <motion.div
                            layout
                            className="flex flex-col gap-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl shadow-lg border border-amber-200 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Name */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-700 rounded-full shadow-inner">
                                    <UserOutlined className="text-xl sm:text-2xl" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-base font-semibold text-gray-800 truncate">{user.name}</span>
                                    <span className="text-xs sm:text-sm text-gray-500">Full Name</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-700 rounded-full shadow-inner">
                                    <MailOutlined className="text-lg sm:text-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm sm:text-base text-gray-700 truncate">{user.email}</span>
                                    <span className="text-xs sm:text-sm text-gray-500">IGIDR Email</span>
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
                        icon={showNextDay ? <ArrowLeftOutlined /> : <ArrowRightOutlined />}
                        onClick={() => setShowNextDay(p => !p)}
                    >
                        {showNextDay ? "Previous Day" : "Next Day"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Lunch;
