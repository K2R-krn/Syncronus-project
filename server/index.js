import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config(); // with this command all the env variables will be insivde process.env which is written insive process.env

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// Setting up cors -> cors = when communicating with different servers we need to communicate between them ->  Forntend hosted on one and Backend hosted on other -> Then we need cors to communicate between them 
app.use(cors({
    origin:[process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Use this to enable cookies.. if not done this cookies wont work
}));

// When a user comes to this route and calls an image then we need ot server the set from our directory to request.
app.use("/uploads/profiles", express.static("uploads/profiles"));

// COOKIE PARSER -> To get cookie from frontend
app.use(cookieParser());
app.use(express.json()); // To have our body in json format..-> Whatever requrest made its body to get in json format..

// Auth route
app.use("/api/auth", authRoutes);

// Connecting server
const server = app.listen(port, ()=>{
    console.log(`Server running at https://localhost:${port}`);
});

// Connect DB
mongoose
    .connect(databaseURL)
    .then(()=> console.log("DB Connection Successfull."))
    .catch(err=> console.log(err.message))


