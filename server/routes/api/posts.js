import express from "express";
const router = express.Router();

// GET /api/users - list users
router.get("/", (req, res) => {
  res.send("posts route");
});

export default router;
