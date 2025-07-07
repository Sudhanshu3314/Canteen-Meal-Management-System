import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@ant-design/v5-patch-for-react-19';
import { createBrowserRouter } from "react-router";

const appRouter = createBrowserRouter

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
