import express from "express";
const router = express.Router();

// GET /api/users - list users
router.get("/", (req, res) => {
  res.send("User route");
});

export default router;

/** router.get and res.send
- router.get(path, handler) registers a handler that runs when an incoming request is an HTTP GET to that path. 
The handler signature is (req, res) => {...} — req has the incoming request data (params, query, body, headers), res is used to build the response.

- res.send(data) sends the response body back to the client and ends the request-response cycle. 
It's flexible — pass it a string, an object/array (auto-JSON-encoded with the right Content-Type), a Buffer, etc. 
In real APIs you'd typically use res.json(...) for clarity when returning JSON, but res.send works for either.
*/
