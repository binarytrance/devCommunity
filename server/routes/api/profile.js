import authMiddleware from "#server/middleware/auth.js";
import express from "express";
const router = express.Router();

// GET /api/profile - show profile
router.get("/", authMiddleware, (req, res) => {
  res.send("profile route");
});

export default router;
