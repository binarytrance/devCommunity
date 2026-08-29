import express from "express";
import { connectDB } from "#server/config/db.js";
import users from "#server/routes/api/users.js";
import profile from "#server/routes/api/profile.js";
import auth from "#server/routes/api/auth.js";
import posts from "#server/routes/api/posts.js";

// Express step 1:
const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API running")); // health check

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/auth", auth);
app.use("/api/posts", posts);

// Express step 2:
const PORT = process.env.PORT || 5670;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

/**
app.get vs app.use

- app.get("/", handler) registers a handler for exactly one route (GET /) at the top-level app.
- app.use("/api/users", users) mounts an entire router (a collection of routes) under a path prefix. 
- Every route defined inside users (the router) gets that prefix prepended automatically.
- app.get is "handle this specific request," app.use is "delegate all requests under this prefix to the router."
*/

/**
app.use(path, router) mounts a router instance at a path prefix — think of it as "for any request path starting with /api/users, hand it off to this router object, which has its own internal set of routes (GET /, GET /:id, POST /, etc.), each relative to that prefix." 
It's a form of composition: instead of one giant file with every route, each resource (users, profile, posts...) gets its own router, and index.js just wires them together.

By contrast, app.get(path, handler) isn't mounting anything — it directly attaches one handler function to one method+path
*/

/**
Why router.get("/") instead of router.get("/api/users")

Because the prefix is already applied by app.use("/api/users", users) in index.js. Inside the router, paths are relative to the mount point. So:

- router.get("/", ...) → matches GET /api/users
- router.get("/:id", ...) → matches GET /api/users/:id

If you wrote router.get("/api/users", ...) inside users.js, the real path would become /api/users/api/users — wrong. 
This pattern (mount prefix + relative router paths) is what lets you keep route files organized per-resource without repeating the prefix everywhere.
*/
