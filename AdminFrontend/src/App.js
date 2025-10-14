import { Outlet, useLocation } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <div className="min-h-screen flex flex-col">
            {!isLoginPage && <Header />}
            <main className="flex-grow">
                <Outlet />
            </main>
            {!isLoginPage && <Footer />}
        </div>
    );
};

export default App;
