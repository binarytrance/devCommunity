import authMiddleware from "#server/middleware/auth.js";
import Users from "#server/models/Users.js";
import express from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

export const loginValidations = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

// GET /api/users - list users
router.get("/", authMiddleware, async (req, res) => {
  // res.send("auth route");
  try {
    const user = await Users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POSTS /api/auth - registration route

// @route POST api/users
// @desc Authenticate uesr & get token
// @access Public

router.post("/", loginValidations, async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;

  try {
    // See if the user exists

    let user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials - user" }] });
    }

    // check for password match
    const isMatch = await bcrypt.compare(password, user.password);
    console.log({ password, user: user.password }, isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials - password" }] });
    }

    // get the payload which includes the user id
    const payload = {
      user: {
        id: user.id,
      },
    };

    // sign the token
    jwt.sign(
      payload,
      process.env.jwtSecret, // secret
      { expiresIn: 360000 }, // optional, TODO: set a smaller value before deploying
      (err, token) => {
        if (err) throw err;
        // Return jsonwebtoken
        res.json({ token });
      },
    );
    console.log(process.env.jwtSecret);

    // res.send("User created");
  } catch (error) {
    // server error
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

export default router;
