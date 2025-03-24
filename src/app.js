const express = require('express')
const apiRoutes = require("./routes/apiRoutes");
const app = express();
const port = 8000;
const dotenv = require("dotenv");
const cors = require("cors");
const corsOption = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());

dotenv.config();

app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

