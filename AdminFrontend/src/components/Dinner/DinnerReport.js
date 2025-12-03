import React, { useEffect, useState, useRef } from "react";
import {
    Table,
    Avatar,
    Tag,
    Spin,
    message,
    Card,
    Input,
    Button,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { FAKE_USER } from "../../../utils/constants";

const AdminDinnerReport = () => {
    const [report, setReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [filteredInfo, setFilteredInfo] = useState({});
    const searchInput = useRef(null);
    const [tableKey, setTableKey] = useState(0);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const pageSize = 5;

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/admin/dinner-report`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await res.json();
                if (!data.success) {
                    message.warning(data.message || "Dinner report not available yet.");
                } else {
                    setReport(data.report);
                    setFilteredReport(data.report);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                message.error("Failed to load dinner report.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const handleLiveSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);

        if (!value) {
            setFilteredReport(report);
            return;
        }

        const filtered = report.filter((item) =>
            item[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase())
        );
        setFilteredReport(filtered);
    };

    const getColumnSearchProps = (dataIndex, label) => ({
        filterDropdown: () => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${label}`}
                    value={searchText}
                    onChange={(e) => handleLiveSearch(e.target.value, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#722ed1" : undefined }} />
        ),
        filterDropdownProps: {
            onOpenChange: (visible) => {
                if (visible) setTimeout(() => searchInput.current?.select(), 100);
            },
        },
    });

    const handleTableChange = (pagination, filters) => {
        setFilteredInfo(filters);

        let filteredData = [...report];

        // ✅ Apply status filter
        if (filters.status && filters.status.length > 0) {
            filteredData = filteredData.filter((item) =>
                filters.status.includes(item.status)
            );
        }

        // ✅ Apply search filter (if active)
        if (searchText && searchedColumn) {
            filteredData = filteredData.filter((item) =>
                item[searchedColumn]
                    ?.toString()
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }

        // ✅ Update filtered report dynamically (this updates {filteredReport.length})
        setFilteredReport(filteredData);
    };


    const columns = [
        {
            title: "Sr. No",
            key: "index",
            align: "center",
            width: 80,
            render: (text, record, index) => (
                <Tag
                    color="#7a5af8"
                    style={{
                        fontWeight: "bold",
                        borderRadius: "8px",
                        padding: "3px 10px",
                        fontSize: "15px",
                    }}
                >
                    {(currentPage - 1) * pageSize + (index + 1)}
                </Tag>
            ),
        },
        {
            title: "Profile",
            dataIndex: "profilePhoto",
            key: "profilePhoto",
            align: "center",
            width: 100,
            render: (photo) => (
                <Avatar
                    src={photo || FAKE_USER}
                    size={60}
                    onClick={() => setEnlargedImage(photo || FAKE_USER)}
                    style={{
                        border: "3px solid #9254de",
                        backgroundColor: "#f9f0ff",
                        boxShadow: "0 0 6px rgba(114,46,209,0.4)",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                    }}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name", "Name"),
            render: (name) => (
                <span
                    style={{
                        fontWeight: "650",
                        fontSize: "18px",
                        color: "#391085",
                    }}
                >
                    {name}
                </span>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email", "Email"),
            render: (email) => (
                <span style={{ color: "#5b5b5b", fontSize: "18px" }}>{email}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            filters: [
                { text: "Yes", value: "Yes" },
                { text: "No", value: "No" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag
                    color={status === "Yes" ? "green" : "red"}
                    style={{
                        fontWeight: "bold",
                        borderRadius: "8px",
                        padding: "5px 15px",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}
                >
                    {status}
                </Tag>
            ),
        },
    ];

    const clearAll = () => {
        setFilteredInfo({});
        setSearchText("");
        setSearchedColumn("");
        setFilteredReport(report);
        setCurrentPage(1);
        setTableKey((k) => k + 1);
        message.success("All filters cleared!");
    };

    return (
        <div className="relative p-2 sm:p-4 md:p-8 min-h-screen flex justify-center items-start">
            <Card
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    borderRadius: "20px",
                    boxShadow: "0 6px 20px rgba(64,0,128,0.15)",
                    padding: "16px",
                    overflow: "hidden",
                    background: "linear-gradient(145deg, #f9f0ff, #ffffff)",
                }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 text-center">
                    <h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold relative"
                        style={{
                            color: "#531dab",
                            borderBottom: "3px solid #fa8c16",
                            display: "inline-block",
                            paddingBottom: "6px",
                        }}
                    >
                        Dinner Attendance Report ({filteredReport.length})
                       
                    </h2>
                    <div className="absolute top-2 right-10 sm:right-10 md:right-14">
                        <div
                            className="h-4 w-4 bg-green-500 rounded-full animate-pulse shadow-lg"
                            title="Active"
                        ></div>
                    </div>
                    <div className="absolute top-2 right-4 sm:right-4 md:right-6">
                        <div
                            className="h-4 w-4 bg-green-500 rounded-full animate-pulse shadow-lg"
                            title="Active"
                        ></div>
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={clearAll}
                        type="default"
                        className="w-full sm:w-auto"
                        style={{
                            borderColor: "#722ed1",
                            color: "#722ed1",
                            fontWeight: 500,
                            height: "42px",
                            boxShadow: "0 0 8px rgba(114,46,209,0.2)",
                        }}
                    >
                        Clear All Filters
                    </Button>
                </div>

                {/* Table */}
                <div
                    style={{
                        flex: 1,
                        overflowX: "auto",
                        width: "100%",
                    }}
                >
                    {loading ? (
                        <div className="flex justify-center w-full">
                            <Spin size="large" />
                        </div>
                    ) : (
                            <Table
                                key={tableKey}
                                columns={columns}
                                dataSource={filteredReport}
                                rowKey={(record) => record.email}
                                bordered
                                pagination={{
                                    pageSize,
                                    current: currentPage,
                                    onChange: (page) => setCurrentPage(page),
                                    position: ["bottomRight"],
                                    showSizeChanger: false,
                                }}
                                scroll={{ x: 700 }}
                                onChange={handleTableChange} // ✅ add this line
                                className="custom-table"
                            />
                    )}
                </div>

                {/* Enlarged Image Overlay */}
                {enlargedImage && (
                    <div
                        className="enlarged-overlay"
                        onClick={() => setEnlargedImage(null)}
                    >
                        <img
                            src={enlargedImage}
                            alt="enlarged user"
                            className="enlarged-img"
                        />
                    </div>
                )}

                {/* Responsive Styling */}
                <style jsx="true">{`
                    .ant-table-measure-row {
                        display: none !important;
                    }

                    .ant-table-thead > tr > th {
                        background-color: #722ed1 !important;
                        color: #ffffff !important;
                        font-weight: 600;
                        text-align: center !important;
                        font-size: 15px;
                        white-space: nowrap;
                        border-bottom: 2px solid #9254de !important;
                    }

                    .ant-table-tbody > tr > td {
                        text-align: center !important;
                        height: 90px !important;
                        vertical-align: middle !important;
                        background-color: #faf8ff !important;
                        border-bottom: 1px solid #e0d7f7 !important;
                    }

                    .ant-table-tbody > tr:hover > td {
                        background-color: #f0e6ff !important;
                        transition: background-color 0.3s ease;
                    }

                    .enlarged-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                    }

                    .enlarged-img {
                        max-width: 90%;
                        max-height: 90%;
                        border-radius: 10px;
                        transition: all 1s ease;
                        transform: scale(0.2);
                        animation: zoomIn 1s forwards;
                    }

                    @keyframes zoomIn {
                        to {
                            transform: scale(1);
                        }
                    }

                    .ant-table-filter-trigger {
                        box-shadow: 0 0 6px 0.5px #fa8c16;
                        font-size: 20px !important;
                        color: #fa8c16 !important;
                    }

                    .ant-table-filter-trigger:hover {
                        transform: scale(1.2);
                        transition: transform 0.2s ease-in-out;
                    }

                    /* ✅ Responsive Styles */
                    @media (max-width: 1024px) {
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            font-size: 14px !important;
                            padding: 8px !important;
                        }
                    }

                    @media (max-width: 768px) {
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            font-size: 13px !important;
                            padding: 6px !important;
                        }

                        .ant-avatar {
                            width: 45px !important;
                            height: 45px !important;
                        }

                        h2 {
                            font-size: 20px !important;
                        }

                        .ant-card {
                            padding: 10px !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .ant-table-thead > tr > th,
                        .ant-table-tbody > tr > td {
                            font-size: 12px !important;
                            padding: 5px !important;
                        }

                        .ant-avatar {
                            width: 40px !important;
                            height: 40px !important;
                        }

                        h2 {
                            font-size: 18px !important;
                        }

                        .ant-btn {
                            width: 100% !important;
                            font-size: 13px !important;
                        }

                        .custom-table {
                            overflow-x: auto !important;
                        }
                    }
                `}</style>
            </Card>
        </div>
    );
};

export default AdminDinnerReport;
