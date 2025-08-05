import { Typography } from "antd";
const { Title, Paragraph } = Typography;

const VerifyInfo = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
            <Title level={3}>Verify your email</Title>
            <Paragraph>We’ve sent a verification link to your email. Please check and click the link to activate your account.</Paragraph>
        </div>
    </div>
);

export default VerifyInfo;