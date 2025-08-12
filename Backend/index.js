const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const Lunch = require("./models/lunchModel");
const User = require("./models/userModel");
const lunchRouter = require("./routes/lunchRoutes");
const authRouter = require("./routes/authRoutes");
require("./models/dBase");

require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/lunch", lunchRouter);

app.get("/", (req, res) => {
    res.send("Server is working!");
});

// CRON JOB — runs every day at 9:01 AM IST to mark "no response" for *today*
cron.schedule("1 9 * * *", async () => {
    try {
        const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
        const users = await User.find({}, "_id name email");

        for (const user of users) {
            const existing = await Lunch.findOne({ userId: user._id, date: today });
            if (!existing) {
                await Lunch.create({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    date: today,
                    status: "no response"
                });
            }
        }
        console.log(`[CRON] No response entries added for ${today}`);
    } catch (err) {
        console.error("[CRON ERROR]", err);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
