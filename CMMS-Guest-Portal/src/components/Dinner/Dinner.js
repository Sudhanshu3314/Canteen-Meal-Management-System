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

const Dinner = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState(null);
    const [targetDate, setTargetDate] = useState("");
    const [nextDate, setNextDate] = useState("");
    const [showNextDay, setShowNextDay] = useState(false);
    const [personCount, setPersonCount] = useState(1);

    /* ================= HELPERS ================= */

    // Dinner cutoff → 4:30 PM IST
    const isCutoffPassed = () => {
        const now = dayjs().tz("Asia/Kolkata");
        return now.hour() > 16 || (now.hour() === 16 && now.minute() >= 30);
    };

    const fetchWithAuth = async (url, options = {}) => {
        try {
            if (!user?.token) throw new Error("No token");

            const fetchOptions = {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const res = await fetch(url, fetchOptions);

            if (res.status === 401) {
                message.error("Session expired. Please login again");
                navigate("/otp-login");
                return null;
            }

            return await res.json();
        } catch (err) {
            console.error("fetchWithAuth error:", err);
            message.error("Network error");
            return null;
        }
    };

    /* ================= DATE LOGIC ================= */

    useEffect(() => {
        const updateDate = () => {
            const now = dayjs().tz("Asia/Kolkata");
            const todayOrNext = isCutoffPassed()
                ? now.add(1, "day")
                : now;

            setTargetDate(todayOrNext.format("YYYY-MM-DD"));
            setNextDate(todayOrNext.add(1, "day").format("YYYY-MM-DD"));
        };

        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    /* ================= DATA LOAD ================= */

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

        setAttendance(null); // 🔥 Clear previous date data

        const res = await fetchWithAuth(
            `${process.env.REACT_APP_BACKEND_URL}/dinner?date=${date}`
        );

        if (res) {
            setAttendance(res);
            setPersonCount(res?.count || 1);
        }
    };

    /* ================= SUBMIT / UPDATE ================= */

    const submitAttendance = async (status) => {
        setLoading(true);
        const date = showNextDay ? nextDate : targetDate;

        const res = await fetchWithAuth(
            `${process.env.REACT_APP_BACKEND_URL}/dinner`,
            {
                method: "POST",
                body: JSON.stringify({
                    status,
                    date,
                    count: status === "yes" ? personCount : 0,
                }),
            }
        );

        if (res?.success) {
            message.success(res.message);
            await fetchAttendance();
        } else {
            message.error(res?.message || "Error submitting dinner attendance");
        }

        setLoading(false);
    };

    const updateGuestCount = async (count) => {
        setLoading(true);
        const date = showNextDay ? nextDate : targetDate;

        const res = await fetchWithAuth(
            `${process.env.REACT_APP_BACKEND_URL}/dinner`,
            {
                method: "POST",
                body: JSON.stringify({
                    status: "yes",
                    date,
                    count,
                }),
            }
        );

        if (res?.success) {
            message.success(
                count === 0 ? "Guest count removed" : "Guest count updated"
            );
            await fetchAttendance();
        } else {
            message.error(res?.message || "Error updating guest count");
        }

        setLoading(false);
    };

    /* ================= UI ================= */

    const AttendanceSection = ({ date }) => {
        const formattedDate = dayjs(date).format("dddd, MMMM D YYYY");

        return (
            <div className="text-center space-y-6">
                <div className="bg-white rounded-xl p-4 shadow border border-indigo-200">
                    <p className="text-xl sm:text-2xl font-bold text-indigo-800">
                        📅 {formattedDate}
                    </p>
                    <p className="text-indigo-600 text-sm mt-1">
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

                        <Tag
                            color={attendance.status === "yes" ? "green" : "red"}
                            className="px-5 py-2"
                        >
                            {attendance.status === "yes" ? (
                                <span className="font-black text-2xl">
                                    🍽️ Having Dinner
                                </span>
                            ) : (
                                <span className="font-black text-2xl">
                                    🚫 Skipping Dinner
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

                                {!isCutoffPassed() ? (
                                    <div className="flex justify-center gap-3">
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

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                className="h-20 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-lg font-bold"
                                onClick={() => submitAttendance("yes")}
                                loading={loading}
                            >
                                🍽️ Yes
                            </Button>

                            <Button
                                className="h-20 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-lg font-bold"
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
                            className="flex flex-col gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <UserOutlined className="text-xl" />
                                </div>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500">Full Name</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <MailOutlined />
                                </div>
                                <div>
                                    <p className="text-sm">{user.email}</p>
                                    <p className="text-xs text-gray-500">IGIDR Email</p>
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

export default Dinner;
