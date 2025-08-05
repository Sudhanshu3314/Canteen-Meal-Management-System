import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { message } from "antd";

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`http://localhost:8080/auth/verify-email/${token}`);
                const data = await res.json();
                if (data.success) {
                    message.success("Email verified successfully! You can now login.");
                    navigate("/login");
                } else {
                    message.error(data.message);
                }
            } catch (err) {
                message.error("Something went wrong.");
            }
        };

        verify();
    }, [token]);

    return <p className="text-center mt-10">Verifying your email...</p>;
};

export default VerifyEmail;
