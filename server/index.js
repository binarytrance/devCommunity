import express from "express";
import { connectDB } from "#server/config/db.js";

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5670;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
