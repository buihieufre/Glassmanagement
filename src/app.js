const express = require('express')
const apiRoutes = require("./routes/index");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
const cors = require("cors");
const corsOption = {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
};

app.options("*", cors(corsOption));
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});
app.use(cors(corsOption));
app.use(express.json());

dotenv.config();

app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
