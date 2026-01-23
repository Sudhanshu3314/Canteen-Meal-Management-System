import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "@ant-design/v5-patch-for-react-19";

import App from "./App";
import Body from "./components/Body";
import Home from "./components/Home/Home";
import Lunch from "./components/Lunch/Lunch";
import Dinner from "./components/Dinner/Dinner";
import OtpLogin from "./components/OtpLogin/OtpLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./components/Error/ErrorPage";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            // 🔓 PUBLIC
            { index: true, element: <OtpLogin /> },
            { path: "otp-login", element: <OtpLogin /> },

            // 🔐 PROTECTED (MIDDLEWARE)
            {
                element: <ProtectedRoute />,   // ✅ ENABLED
                children: [
                    {
                        element: <Body />,         // layout
                        children: [
                            { path: "home", element: <Home /> },
                            { path: "lunch", element: <Lunch /> },
                            { path: "dinner", element: <Dinner /> },
                        ],
                    },
                ],
            },
        ],
    },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
);
