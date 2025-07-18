import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    const Links = [
        { name: "Profile", path: "/profile" },
        { name: "Lunch", path: "/lunch" },
        { name: "Dinner", path: "/dinner" },
    ];

    const linkClasses = ({ isActive }) =>
        `relative group transition-all duration-300 ${isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
        }`;

    return (
        <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between animate-fade-in-down">
                {/* Left: Hamburger + Brand */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden focus:outline-none transition-transform hover:scale-105"
                    >
                        <Menu size={28} />
                    </button>
                    <h1 className="text-3xl font-extrabold tracking-wide hover:tracking-widest transition-all duration-300">
                        IGIDR
                    </h1>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10 text-lg">
                    {Links.map((link) => (
                        <NavLink key={link.name} to={link.path} className={linkClasses}>
                            {link.name}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full duration-300" />
                        </NavLink>
                    ))}
                    <button className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-300">
                        Logout
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } shadow-xl`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-blue-600">
                    <span className="text-xl font-bold tracking-wide">Menu</span>
                    <button onClick={() => setIsOpen(false)}>
                        <X size={24} className="hover:text-red-400 transition-colors" />
                    </button>
                </div>

                <div className="flex flex-col px-6 py-6 gap-6 animate-slide-in text-lg">
                    {Links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `transition-all duration-200 ${isActive ? "text-yellow-300 font-semibold" : "hover:text-yellow-300"
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full mt-4 font-semibold shadow-md transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
