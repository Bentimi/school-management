const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const DB_URL = process.env.DATABASE_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
        process.exit(1);
    }
}

module.exports = connectDB;