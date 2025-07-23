const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors")
const AuthRouter = require("./Routes/AuthRouter")

require('dotenv').config();
require("./Models/db")
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Handle favicon request
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route
app.get('/', (req, res) => {
    res.send('Server is working!');
});


app.use(bodyParser.json())
app.use(cors())
app.use("/auth",AuthRouter)

// Serve frontend if needed
// app.use(express.static(path.join(__dirname, 'client', 'build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
