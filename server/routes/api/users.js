import express from "express";
import { check, validationResult } from "express-validator";
import User from "../../models/Users.js";
const router = express.Router();
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";

// express validator
// For catching invalid data early with middleware, you keep your controller logic clean and prevent unnecessary database operations.
export const validations = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters",
  ).isLength({ min: 6 }),
];

// POSTS /api/users - registration route

// @route POST api/users
// @desc Register user
// @access Public

router.post("/", validations, async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { name, email, password } = req.body;

  try {
    // See if the user exists

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: "200", //size
      r: "pg", // rating
      d: "mm", //default image
    });

    // Create the user
    user = new User({
      name,
      email,
      avatar,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save user to db
    await user.save();

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

/** router.get and res.send
- router.get(path, handler) registers a handler that runs when an incoming request is an HTTP GET to that path. 
The handler signature is (req, res) => {...} — req has the incoming request data (params, query, body, headers), res is used to build the response.

- res.send(data) sends the response body back to the client and ends the request-response cycle. 
It's flexible — pass it a string, an object/array (auto-JSON-encoded with the right Content-Type), a Buffer, etc. 
In real APIs you'd typically use res.json(...) for clarity when returning JSON, but res.send works for either.
*/
