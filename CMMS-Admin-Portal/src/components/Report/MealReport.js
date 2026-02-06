import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    CalendarIcon,
    SunIcon,
    MoonIcon,
    ArrowPathIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    UserGroupIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Table, message } from "antd";

const MealReport = () => {
    const [lunchDetails, setLunchDetails] = useState([]);
    const [dinnerDetails, setDinnerDetails] = useState([]);
    const [lunchSummary, setLunchSummary] = useState(null);
    const [dinnerSummary, setDinnerSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const BASE_URL = process.env.REACT_APP_GUEST_B;
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const today = new Date().toISOString().split("T")[0];
    const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const fetchAllReports = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const [lunchDetailsRes, dinnerDetailsRes, lunchSummaryRes, dinnerSummaryRes] = await Promise.all([
                fetch(`${BASE_URL}/lunch/report?date=${today}`),
                fetch(`${BASE_URL}/dinner/report?date=${today}`),
                fetch(`${BACKEND_URL}/admin/lunch-report`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${BACKEND_URL}/admin/dinner-report`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            if (!lunchDetailsRes.ok || !dinnerDetailsRes.ok) {
                throw new Error("Failed to fetch meal details");
            }

            const [lunchDetailsData, dinnerDetailsData, lunchSummaryData, dinnerSummaryData] = await Promise.all([
                lunchDetailsRes.json(),
                dinnerDetailsRes.json(),
                lunchSummaryRes.json(),
                dinnerSummaryRes.json()
            ]);

            setLunchDetails(Array.isArray(lunchDetailsData) ? lunchDetailsData : []);
            setDinnerDetails(Array.isArray(dinnerDetailsData) ? dinnerDetailsData : []);

            if (lunchSummaryData.success && lunchSummaryData.report) {
                setLunchSummary(processSummaryReport(lunchSummaryData.report));
            }
            if (dinnerSummaryData.success && dinnerSummaryData.report) {
                setDinnerSummary(processSummaryReport(dinnerSummaryData.report));
            }

        } catch (err) {
            console.error("MealReport error:", err);
            setError(err.message || "Unable to load reports. Please try again.");
            message.error("Failed to load meal reports");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [today, BASE_URL, BACKEND_URL]);

    useEffect(() => {
        fetchAllReports();
    }, [fetchAllReports]);

    const processSummaryReport = (report) => {
        const yes = report.filter(i => i.status === "Yes").length;
        const no = report.filter(i => i.status === "No").length;

        return {
            Yes: yes,
            No: no,
            Total: report.length,
        };
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchAllReports();
    };

    const totalStats = useMemo(() => {
        const guestLunchMeals = lunchDetails.reduce((sum, item) => sum + item.count, 0);
        const guestDinnerMeals = dinnerDetails.reduce((sum, item) => sum + item.count, 0);
        const memberLunchMeals = lunchSummary ? lunchSummary.Yes : 0;
        const memberDinnerMeals = dinnerSummary ? dinnerSummary.Yes : 0;
        const totalLunch = guestLunchMeals + memberLunchMeals;
        const totalDinner = guestDinnerMeals + memberDinnerMeals;

        return {
            totalLunch,
            totalDinner,
            guestLunchMeals,
            guestDinnerMeals,
            memberLunchMeals,
            memberDinnerMeals,
            totalGuests: lunchDetails.length + dinnerDetails.length,
        };
    }, [lunchDetails, dinnerDetails, lunchSummary, dinnerSummary]);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorState error={error} onRetry={handleRefresh} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-white/50"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                                <CalendarIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                                    Today's Meal Report
                                </h1>
                                <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1 truncate">{todayFormatted}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="self-end sm:self-auto p-2 sm:p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex-shrink-0"
                            aria-label="Refresh data"
                        >
                            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </motion.div>

                {/* Main Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6 md:mb-8"
                >
                    <PreparationCard
                        icon={<SunIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
                        label="Total Lunch to Prepare"
                        totalValue={totalStats.totalLunch}
                        guestMeals={totalStats.guestLunchMeals}
                        memberMeals={totalStats.memberLunchMeals}
                        color="orange"
                        guestCount={lunchDetails.length}
                    />
                    <PreparationCard
                        icon={<MoonIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
                        label="Total Dinner to Prepare"
                        totalValue={totalStats.totalDinner}
                        guestMeals={totalStats.guestDinnerMeals}
                        memberMeals={totalStats.memberDinnerMeals}
                        color="purple"
                        guestCount={dinnerDetails.length}
                    />
                </motion.div>

                {/* Member Summary Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-4 sm:mb-6 md:mb-8"
                >
                    {lunchSummary && (
                        <MemberSummaryCard
                            title="Lunch Member Summary"
                            summary={lunchSummary}
                            color="orange"
                        />
                    )}
                    {dinnerSummary && (
                        <MemberSummaryCard
                            title="Dinner Member Summary"
                            summary={dinnerSummary}
                            color="purple"
                        />
                    )}
                </motion.div>

                {/* Detailed Guest Tables */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8"
                >
                    <GuestTable
                        title="Lunch Guest Details"
                        icon={<SunIcon className="w-5 h-5" />}
                        data={lunchDetails}
                        color="orange"
                    />
                    <GuestTable
                        title="Dinner Guest Details"
                        icon={<MoonIcon className="w-5 h-5" />}
                        data={dinnerDetails}
                        color="purple"
                    />
                </motion.div>
            </div>
        </div>
    );
};

// Preparation Card Component
const PreparationCard = ({ icon, label, totalValue, guestMeals, memberMeals, color, guestCount }) => {
    const colorClasses = {
        orange: "from-orange-400 to-orange-600",
        purple: "from-purple-400 to-purple-600"
    };

    const bgClasses = {
        orange: "bg-gradient-to-br from-orange-50 to-orange-100",
        purple: "bg-gradient-to-br from-purple-50 to-purple-100"
    };

    const glowClasses = {
        orange: "shadow-orange-200/50",
        purple: "shadow-purple-200/50"
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`${bgClasses[color]} rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl ${glowClasses[color]} border border-white/50 backdrop-blur-sm relative overflow-hidden cursor-pointer transition-shadow duration-300`}
        >
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-white/30 to-transparent rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-white/20 to-transparent rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16 blur-xl" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 sm:p-3.5 md:p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl shadow-lg text-white`}
                    >
                        {icon}
                    </motion.div>
                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/70 backdrop-blur-sm rounded-full border border-white/50">
                        <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                </div>

                <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 uppercase tracking-wide">{label}</p>
                <motion.p
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6"
                >
                    {totalValue.toLocaleString()}
                </motion.p>

                <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4">
                    <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-2.5 sm:p-3 bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/50 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} shadow-md`}></div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Guest Meals</span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-gray-800">{guestMeals}</span>
                    </motion.div>
                    <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-2.5 sm:p-3 bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/50 shadow-sm"
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} shadow-md`}></div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Member Meals</span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-gray-800">{memberMeals}</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// Member Summary Card Component
const MemberSummaryCard = ({ title, summary, color }) => {
    const colorClasses = {
        orange: "from-orange-400 to-orange-600",
        purple: "from-purple-400 to-purple-600"
    };

    const columns = [
        {
            title: "Status",
            dataIndex: "status",
            align: "center",
            render: (text) => (
                <span className="text-sm sm:text-base font-semibold text-gray-800">
                    {text}
                </span>
            ),
        },
        {
            title: "Count",
            dataIndex: "count",
            align: "center",
            render: (count) => (
                <span className="text-xl sm:text-2xl font-bold text-indigo-700">
                    {count}
                </span>
            ),
        },
    ];

    const tableData = [
        { key: "1", status: "Total Active Members", count: summary.Total },
        { key: "2", status: "NOT having meal", count: summary.No },
        { key: "3", status: "Having meal", count: summary.Yes },
    ];

    return (
        <Card className="!border-none !bg-transparent" styles={{ body: { padding: 0 } }}>
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/50 overflow-hidden"
            >
                <div className={`p-4 sm:p-5 md:p-6 bg-gradient-to-r ${colorClasses[color]} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16" />
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center tracking-wide relative z-10">
                        {title}
                    </h2>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                        bordered
                        className="rounded-xl overflow-hidden [&_.ant-table]:text-xs [&_.ant-table]:sm:text-sm [&_.ant-table]:md:text-base"
                        scroll={{ x: 400 }}
                    />
                </div>
            </motion.div>
        </Card>
    );
};

// Guest Table Component
const GuestTable = ({ title, icon, data, color }) => {
    const colorClasses = {
        orange: "from-orange-500 to-orange-600",
        purple: "from-purple-500 to-purple-600"
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-white/50"
        >
            <div className={`p-4 sm:p-5 md:p-6 bg-gradient-to-r ${colorClasses[color]} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20" />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex-shrink-0">
                            {React.cloneElement(icon, { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" })}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{title}</h2>
                            <p className="text-white/80 text-xs sm:text-sm mt-0.5 sm:mt-1">
                                {data.length} {data.length === 1 ? "guest" : "guests"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto max-h-[400px] sm:max-h-[450px] md:max-h-[500px]">
                <table className="w-full min-w-[500px]">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">Guest</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                            <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">Count</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <AnimatePresence>
                            {data.length === 0 ? (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="3" className="px-4 sm:px-6 py-8 sm:py-10 md:py-12">
                                        <div className="text-center">
                                            <SparklesIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                                            <p className="text-gray-500 text-base sm:text-lg font-medium">No reservations yet</p>
                                            <p className="text-gray-400 text-xs sm:text-sm mt-1">Check back later for updates</p>
                                        </div>
                                    </td>
                                </motion.tr>
                            ) : (
                                data.map((item, index) => (
                                    <motion.tr
                                        key={`${item.email}-${index}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                                        className="transition-colors"
                                    >
                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                                                    <p className="text-[10px] sm:text-xs text-gray-500">Guest #{index + 1}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                                            <p className="text-gray-600 text-xs sm:text-sm md:text-base truncate">{item.email}</p>
                                        </td>
                                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                                            <motion.span
                                                whileHover={{ scale: 1.1 }}
                                                className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full text-base sm:text-lg font-bold text-indigo-600 shadow-sm"
                                            >
                                                {item.count}
                                            </motion.span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-5 md:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl sm:rounded-2xl animate-pulse" />
                    <div className="flex-1 min-w-0">
                        <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 animate-pulse mb-2"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse"></div>
                        </div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-2 sm:mb-3"></div>
                        <div className="h-12 sm:h-14 md:h-16 bg-gray-200 rounded w-1/3 animate-pulse mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
                            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
                        <div className="h-16 sm:h-20 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                        <div className="p-4 sm:p-5 md:p-6">
                            <div className="h-32 sm:h-36 md:h-40 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Error State Component
const ErrorState = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center border border-white/50"
        >
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
            >
                <ExclamationTriangleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Oops! Something went wrong</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">{error}</p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
                <ArrowPathIcon className="w-5 h-5" />
                Try Again
            </motion.button>
        </motion.div>
    </div>
);

export default MealReport;