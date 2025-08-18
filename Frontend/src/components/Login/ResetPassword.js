import React from "react";
import { useParams, useNavigate } from "react-router";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: values.newPassword }), // ✅ only send newPassword
            });
            const data = await res.json();

            if (data.success) {
                message.success("Password reset successful! Please login.");
                navigate("/login");
            } else {
                message.error(data.message);
            }
        } catch (err) {
            message.error("Error resetting password");
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-white px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-6">Reset Password</h2>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="newPassword"
                        rules={[{ required: true, message: "Enter new password" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="New Password"
                            className="py-2 rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        rules={[{ required: true, message: "Confirm new password" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                            className="py-2 rounded-lg"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        className="!h-10 !rounded-xl !bg-amber-500 hover:!bg-amber-600"
                    >
                        Reset Password
                    </Button>
                </Form>
            </div>
        </section>
    );
};

export default ResetPassword;
