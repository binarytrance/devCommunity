import express from "express";
const router = express.Router();

// GET /api/users - list users
router.get("/", (req, res) => {
  res.send("auth route");
});

export default router;
