import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { MailOutlined, LockOutlined, ReloadOutlined, UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, message, Progress, Divider } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const { Title, Text } = Typography;

const OtpLogin = () => {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

    const navigate = useNavigate();
    const { user, login } = useAuth();

    // Redirect if already logged in
    if (user) return <Navigate to="/home" replace />;

    // Send OTP to email
    const sendOtp = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email, name: values.name }),
            });

            const data = await res.json();
            if (data.success) {
                setEmail(values.email);
                setName(values.name);
                setStep("otp");
                message.success("OTP sent to your email");
                // Start countdown for resend
                startResendTimer();
            } else {
                message.error(data.message || "Failed to send OTP");
            }
        } catch {
            message.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    // Start countdown timer for resend OTP
    const startResendTimer = () => {
        setResendTimer(60);
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Handle OTP input change
    const handleOtpChange = (value, index) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle OTP key press
    const handleOtpKeyPress = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Verify OTP
    const verifyOtp = async () => {
        const otp = otpDigits.join("");
        if (otp.length !== 6) {
            message.error("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/auth/verify-otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp }),
                }
            );

            const data = await res.json();

            if (data.success) {
                // ✅ USE BACKEND RESPONSE ONLY
                login({
                    ...data.user,
                    token: data.token,
                });

                message.success(`Welcome ${data.user.name}`);
                navigate("/home", { replace: true });
            } else {
                message.error(data.message || "Invalid OTP");
            }
        } catch (err) {
            console.error(err);
            message.error("Server error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10 border border-gray-100"
            >

                <div className="text-center mb-8">
                    <Title level={3} className="text-gray-800 mb-2">
                        {step === "email" ? "Welcome to IGIDR 👋" : "Verify Your Identity 🪪"}
                    </Title>
                    <Text type="secondary" className="text-sm">
                        {step === "email"
                            ? "Login using your IGIDR credentials"
                            : `We've sent a 6-digit code to ${email}`}
                    </Text>
                </div>

                {/* Progress indicator */}
                <div className="mb-8">
                    <Progress
                        percent={step === "email" ? 50 : 100}
                        showInfo={false}
                        strokeColor={{
                            '0%': '#6366f1',
                            '100%': '#8b5cf6',
                        }}
                        trailColor="#f3f4f6"
                        style={{ height: 60 }}
                    />
                    <div className="flex justify-between mt-2">
                        <Text className={`text-xs ${step === "email" ? "text-indigo-600 font-semibold" : "text-gray-400"}`}>
                            Enter Details
                        </Text>
                        <Text className={`text-xs ${step === "otp" ? "text-indigo-600 font-semibold" : "text-gray-400"}`}>
                            Verify OTP
                        </Text>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === "email" ? (
                        <motion.div
                            key="email-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Form layout="vertical" onFinish={sendOtp}>
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Full Name</span>}
                                    name="name"
                                    rules={[
                                        { required: true, message: "Name is required" },
                                        { min: 3, message: "Enter a valid name" },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Enter your full name"
                                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Email Address</span>}
                                    name="email"
                                    rules={[
                                        { required: true },
                                        {
                                            validator: (_, value) =>
                                                value?.endsWith("@igidr.ac.in")
                                                    ? Promise.resolve()
                                                    : Promise.reject(new Error("Use your IGIDR email")),
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="yourname@igidr.ac.in"
                                        className="rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    />
                                </Form.Item>

                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={loading}
                                    className="rounded-xl h-12 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none shadow-md hover:shadow-lg transition-all"
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>
                            </Form>
                        </motion.div>
                    ) : (
                            <motion.div
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form layout="vertical" onFinish={verifyOtp}>
                                    <div className="mb-6">
                                        <Text className="text-gray-700 font-medium block mb-4">Enter 6-digit OTP</Text>
                                        <div className="flex justify-between gap-2">
                                            {otpDigits.map((digit, index) => (
                                                <Input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ""), index)}
                                                    onKeyDown={(e) => handleOtpKeyPress(e, index)}
                                                    maxLength={1}
                                                    size="large"
                                                    className="w-12 h-12 text-center text-xl font-semibold rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        loading={loading}
                                        htmlType="submit" // ✅ Make it a submit button
                                        className="rounded-xl h-12 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-none shadow-md hover:shadow-lg transition-all"
                                    >
                                        {loading ? "Verifying..." : "Verify & Login"}
                                    </Button>
                                </Form>

                                <Divider className="my-6">
                                    <Text className="text-gray-400 text-sm">OR</Text>
                                </Divider>

                                <div className="text-center">
                                    <Button
                                        type="text"
                                        icon={<ReloadOutlined />}
                                        onClick={() => {
                                            if (resendTimer === 0) sendOtp({ email, name });
                                        }}
                                        disabled={loading || resendTimer > 0}
                                        className={`text-indigo-600 hover:text-indigo-800 font-medium ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                    </Button>
                                </div>

                                <div className="mt-6 text-center">
                                    <Button
                                        type="text"
                                        onClick={() => {
                                            setStep("email");
                                            setOtpDigits(["", "", "", "", "", ""]);
                                        }}
                                        className="text-gray-500 hover:text-gray-700 text-sm"
                                    >
                                        ← Back to login
                                    </Button>
                                </div>
                            </motion.div>

                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default OtpLogin;