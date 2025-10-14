import ReactDOM from "react-dom/client";
import App from "./App";
import "@ant-design/v5-patch-for-react-19";
import { createBrowserRouter, RouterProvider } from "react-router";

import Body from "./components/Body";
import Lunch from "./components/Lunch/Lunch";
import Dinner from "./components/Dinner/Dinner";
import Home from "./components/Home/Home";
import { AuthProvider } from "./context/AuthContext";
import ErrorPage from "./components/Error/ErrorPage";
import Report from "./components/Report/Report";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import Login from "./components/Authentication/Login";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/home", element: <Home /> },
            { path: "/login", element: <Login /> },
            {
                element: <ProtectedRoute />, // Protect all routes
                children: [
                    {
                        element: <Body />,
                        children: [
                            { path: "/report", element: <Report /> },
                            { path: "/lunch", element: <Lunch /> },
                            { path: "/dinner", element: <Dinner /> },
                        ],
                    },
                ],
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <RouterProvider router={appRouter} />
    </AuthProvider>
);
