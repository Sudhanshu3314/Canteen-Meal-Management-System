import ReactDOM from "react-dom/client";
import App from "./App";
import "@ant-design/v5-patch-for-react-19";
import { createBrowserRouter, RouterProvider } from "react-router";

import LoginUser from "./components/Login/Login";
import RegisterUser from "./components/Register/Register";
import Body from "./components/Body";
import Profile from "./components/Profile/Profile";
import Lunch from "./components/Lunch/Lunch";
import Dinner from "./components/Dinner/Dinner";
import Home from "./components/Home/Home";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LoginUser />,
            },
            {
                path: "login",
                element: <LoginUser />,
            },
            {
                path: "register",
                element: <RegisterUser />,
            },
            {
                path: "/",
                element: <Body />, // Nested container
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                    {
                        path: "/profile",
                        element: <Profile />,
                    },
                    {
                        path: "/lunch",
                        element: <Lunch />,
                    },
                    {
                        path: "/dinner",
                        element: <Dinner />,
                    },
                ],
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
