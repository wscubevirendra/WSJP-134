import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"
import express from "express"
import connectDB from "./config/db.config.js";
import categoryRouter from "./routers/category.router.js";

// Create Express application
const app = express();

// Define port
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to Express Server");
});

//API

app.use("/api/category",categoryRouter)



//Database Connectd
connectDB();
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
