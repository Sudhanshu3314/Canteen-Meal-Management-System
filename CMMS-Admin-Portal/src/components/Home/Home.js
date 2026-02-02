import weeklyMenu from "../../../utils/foodMenu";
import MealReport from "../Report/MealReport";

const Home = () => {
    const today = new Date();
    const day = today.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const todayMenu = weeklyMenu[day] || weeklyMenu.Monday;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-inter text-gray-800">
            {/* Page wrapper */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                {/* Header */}
                <header className="text-center mb-8 sm:mb-12 animate-fade-in">
                    <h1 className="
                        text-3xl
                        sm:text-4xl
                        md:text-5xl
                        lg:text-6xl
                        font-extrabold
                        text-blue-800
                        drop-shadow-lg
                        leading-tight
                    ">
                        🍽️ Canteen Attendance Report
                    </h1>

                    <p className="
                        mt-3
                        sm:mt-4
                        text-sm
                        sm:text-base
                        md:text-lg
                        text-gray-700
                        font-medium
                    ">
                        for{" "}
                        <span className="text-purple-700 font-bold">
                            {day}, {formattedDate}
                        </span>
                    </p>
                </header>

                {/* Content */}
                <section className="
                    bg-white/60
                    backdrop-blur-md
                    rounded-2xl
                    sm:rounded-3xl
                    shadow-xl
                    p-4
                    sm:p-6
                    lg:p-8
                ">
                    <MealReport />
                </section>
            </div>
        </div>
    );
};

export default Home;
