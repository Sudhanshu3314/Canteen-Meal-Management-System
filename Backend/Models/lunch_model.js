const mongoose = require("mongoose");

const LunchSchema = new mongoose.Schema({
    date: String, // "2025-07-25"
    studentEmail: String,
    studentName: String,
    status: { type: String, enum: ["yes", "no", "no response"], default: "no response" },
    submittedAt: Date
});

module.exports = mongoose.model("Lunch", LunchSchema);
