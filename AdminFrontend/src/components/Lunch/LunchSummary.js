import React, { useEffect, useState } from "react";
import { Card, Table, Spin, message } from "antd";

const LunchSummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/lunch-report`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await res.json();

                if (!data.success) {
                    message.warning(data.message || "Lunch summary not available yet.");
                } else {
                    const todayData = data.report;

                    const yesCount = todayData.filter((item) => item.status === "Yes").length;
                    const noCount = todayData.filter((item) => item.status === "No").length;
                    const totalCount = todayData.length;

                    setSummary({
                        Yes: yesCount,
                        No: noCount,
                        Total: totalCount,
                    });
                }
            } catch (err) {
                console.error("Fetch error:", err);
                message.error("Failed to load lunch summary.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const columns = [
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (text) => (
                <span
                    style={{
                        fontSize: "26px",
                        fontWeight: 700,
                        color:
                            text === "Yes"
                                ? "green" // bright blue for Yes
                                : text === "No"
                                    ? "red" // red for No
                                    : "#002766", // deep blue fallback
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
            align: "center",
            render: (count) => (
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: "26px",
                        color: "#001529", // dark navy for numbers
                    }}
                >
                    {count}
                </span>
            ),
        },
    ];

    const tableData = summary
        ? [
            { key: "1", status: "Yes", count: summary.Yes },
            { key: "2", status: "No", count: summary.No },
            { key: "3", status: "Total", count: summary.Total },
        ]
        : [];

    return (
        <div className="relative p-2 sm:p-4 md:p-8 flex justify-center items-start">
            <Card
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "20px",
                    boxShadow: "0 6px 20px rgba(0, 21, 41, 0.2)",
                    padding: "16px",
                    background: "linear-gradient(145deg, #e6f4ff, #ffffff)", // subtle light blue gradient
                }}
            >
                <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4"
                    style={{
                        color: "#001529",
                        borderBottom: "3px solid #1890ff",
                        display: "inline-block",
                        paddingBottom: "6px",
                        letterSpacing: "0.5px",
                    }}
                >
                    Lunch Report
                </h2>

                {loading ? (
                    <div className="flex justify-center w-full">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                        bordered
                        size="middle"
                        style={{ marginTop: "10px" }}
                    />
                )}
            </Card>

            <style jsx="true">{`
                .ant-table-thead > tr > th {
                    background-color: #003a8c !important; /* rich blue header */
                    color: #fff !important;
                    font-weight: 600;
                    text-align: center !important;
                    font-size: 18px !important;
                    border-bottom: 2px solid #1890ff !important;
                }

                .ant-table-tbody > tr > td {
                    text-align: center !important;
                    background-color: #f0f5ff !important; /* very light blue background */
                    border-bottom: 1px solid #d6e4ff !important;
                    font-size: 26px !important;
                    font-weight: 600;
                    color: #002766 !important;
                }

                .ant-table-tbody > tr:hover > td {
                    background-color: #e6f4ff !important;
                    transition: background-color 0.3s ease;
                }

                .ant-table-thead .ant-table-cell {
                    font-size: 26px !important;
                }
            `}</style>
        </div>
    );
};

export default LunchSummary;
