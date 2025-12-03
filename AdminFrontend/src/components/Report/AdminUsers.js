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

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [filteredInfo, setFilteredInfo] = useState({});
    const searchInput = useRef(null);
    const [tableKey, setTableKey] = useState(0);

    // ✅ New state for enlarged image
    const [enlargedImage, setEnlargedImage] = useState(null);

    const pageSize = 5;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/users`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUsers(data.users);
                    setFilteredUsers(data.users);
                } else message.error("Failed to fetch users");
            })
            .catch(() => message.error("Error loading users"))
            .finally(() => setLoading(false));
    }, []);

    const handleLiveSearch = (value, dataIndex) => {
        setSearchText(value);
        setSearchedColumn(dataIndex);

        if (!value) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter((item) =>
            item[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
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
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        filterDropdownProps: {
            onOpenChange: (visible) => {
                if (visible) setTimeout(() => searchInput.current?.select(), 100);
            },
        },
    });

    const columns = [
        {
            title: "No. Of Users",
            key: "index",
            align: "center",
            width: 80,
            render: (text, record, index) => (
                <Tag
                    color="blue"
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
                <div className="avatar-wrapper">
                    <Avatar
                        src={photo || FAKE_USER}
                        size={60}
                        onClick={() => setEnlargedImage(photo || FAKE_USER)}
                        style={{
                            border: "3px solid #1890ff",
                            backgroundColor: "#e6f7ff",
                            boxShadow: "0 0 6px rgba(24,144,255,0.4)",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                        }}
                    />
                </div>
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
                        color: "#003a8c",
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
                <span style={{ color: "#595959", fontSize: "18px" }}>{email}</span>
            ),
        },
        {
            title: "Membership Status",
            dataIndex: "membershipActive",
            key: "membershipActive",
            align: "center",
            filters: [
                { text: "Active", value: "Active" },
                { text: "Inactive", value: "Inactive" },
            ],
            onFilter: (value, record) => record.membershipActive === value,
            render: (status) => (
                <Tag
                    color={status === "Active" ? "green" : "red"}
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
        setFilteredUsers(users);
        setCurrentPage(1);
        setTableKey((k) => k + 1);
        message.success("All filters cleared!");
    };

    return (
        <div className="p-2 sm:p-4 md:p-8 min-h-screen flex justify-center items-start">
            <Card
                style={{
                    width: "100%",
                    maxWidth: "1200px",
                    borderRadius: "20px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    padding: "16px",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 text-center">
                    <h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold"
                        style={{
                            color: "#003a8c",
                            borderBottom: "3px solid #faad14",
                            display: "inline-block",
                            paddingBottom: "6px",
                        }}
                    >
                        All Users ({filteredUsers.length})
                    </h2>

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={clearAll}
                        type="default"
                        className="w-full sm:w-auto"
                        style={{
                            borderColor: "#1677ff",
                            color: "#1677ff",
                            fontWeight: 500,
                            height: "42px",
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
                            dataSource={filteredUsers}
                            rowKey="_id"
                            bordered
                            pagination={{
                                pageSize,
                                current: currentPage,
                                onChange: (page) => setCurrentPage(page),
                                position: ["bottomRight"],
                                showSizeChanger: false,
                            }}
                            onChange={(pagination, filters) => {
                                setFilteredInfo(filters);
                                let updatedData = [...users];
                                if (filters.membershipActive && filters.membershipActive.length > 0) {
                                    updatedData = updatedData.filter((user) =>
                                        filters.membershipActive.includes(user.membershipActive)
                                    );
                                }
                                if (searchText && searchedColumn) {
                                    updatedData = updatedData.filter((item) =>
                                        item[searchedColumn]
                                            ?.toString()
                                            .toLowerCase()
                                            .includes(searchText.toLowerCase())
                                    );
                                }
                                setFilteredUsers(updatedData);
                            }}
                            scroll={{ x: 700 }}
                            className="custom-table"
                        />
                    )}
                </div>

                {/* ✅ Enlarged Image Overlay */}
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

                {/* ✅ Styling */}
                <style jsx="true">{`
                    .ant-table-measure-row {
                        display: none !important;
                    }

                    .ant-table-thead > tr > th {
                        background-color: #1890ff !important;
                        color: white !important;
                        font-weight: bold;
                        text-align: center !important;
                        font-size: 15px;
                        white-space: nowrap;
                    }

                    .ant-table-tbody > tr > td {
                        text-align: center !important;
                        height: 90px !important;
                        vertical-align: middle !important;
                        white-space: nowrap;
                    }

                    .ant-table-tbody > tr:hover > td {
                        background-color: #e6f7ff !important;
                    }

                    /* ✅ Enlarged Image Animation */
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

                    /* Tablet */
                    @media (max-width: 1024px) {
                        .ant-table {
                            font-size: 14px;
                        }
                        .ant-avatar {
                            width: 50px !important;
                            height: 50px !important;
                        }
                    }

                    /* Mobile */
                    @media (max-width: 768px) {
                        .ant-table {
                            font-size: 13px;
                        }
                        .ant-table-thead > tr > th {
                            font-size: 13px !important;
                            padding: 6px !important;
                        }
                        .ant-btn {
                            font-size: 13px !important;
                            width: 100%;
                        }
                        .ant-avatar {
                            width: 45px !important;
                            height: 45px !important;
                        }
                        h2 {
                            font-size: 18px !important;
                        }
                    }

                    /* Small mobile */
                    @media (max-width: 480px) {
                        .ant-table {
                            font-size: 12px;
                        }
                        .ant-table-thead > tr > th {
                            font-size: 12px !important;
                        }
                        .ant-avatar {
                            width: 40px !important;
                            height: 40px !important;
                        }
                        .ant-card {
                            padding: 10px !important;
                        }
                    }

                    .ant-table-filter-trigger {
                        box-shadow: 0 0 6px 0.5px yellow;
                        font-size: 20px !important;
                        color: yellow !important;
                    }

                    .ant-table-filter-trigger:hover {
                        transform: scale(1.2);
                        transition: transform 0.2s ease-in-out;
                    }
                `}</style>
            </Card>
        </div>
    );
};

export default AdminUsers;
