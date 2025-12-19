import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { authenticated } = useAuth();

    return authenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;