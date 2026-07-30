const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const port = process.env.PORT;


app.listen(port, () => {
    connectDB();
    console.log(`server running on http://localhost:${port}`);
})