
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LunchForm = ({ studentId }) => {
    const [status, setStatus] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const cutoff = new Date(`${today}T21:00:00`);
    const now = new Date();

    const isAfterCutoff = now > cutoff;

    const handleSubmit = async () => {
        if (isAfterCutoff) {
            alert("Too late to submit!");
            return;
        }

        try {
            await axios.post("/api/lunch", {
                studentId,
                status
            });
            alert("Lunch preference submitted!");
        } catch (error) {
            console.error(error);
            alert("Submission failed.");
        }
    };

    return (
        <div jsx="true" className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">🍽️ Will you eat lunch today?</h2>
            <div className="flex gap-4">
                <button
                    onClick={() => setStatus("yes")}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Yes
                </button>
                <button
                    onClick={() => setStatus("no")}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    No
                </button>
            </div>
            <button
                onClick={handleSubmit}
                disabled={!status}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
            >
                Submit
            </button>
            {isAfterCutoff && <p className="text-red-600 mt-2">Cutoff passed for today</p>}
        </div>
    );
};

export default LunchForm;
