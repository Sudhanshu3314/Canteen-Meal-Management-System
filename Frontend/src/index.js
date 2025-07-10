import ReactDOM from "react-dom/client";
import App from "./App";
import "@ant-design/v5-patch-for-react-19";

import { createBrowserRouter, RouterProvider } from "react-router";
import LoginUser from "./components/Login/Login";
import RegisterUser from "./components/Register/Register";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LoginUser />, // default page
            },
            {
                path: "/login",
                element: <LoginUser />,
            },
            {
                path: "register",
                element: <RegisterUser />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);
