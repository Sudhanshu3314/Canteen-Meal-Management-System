import LunchForm from "./LunchForm";

const Lunch = () => {
    return (
        <div jsx="true" className="min-h-screen p-10 text-xl font-semibold bg-gradient-to-br from-teal-100 via-violet-100 to-red-100">
            🍽️ Here's your Lunch Menu
            <LunchForm/>
        </div>
    );
}
export default Lunch