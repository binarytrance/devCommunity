# Server — Notes

## Request flow (as understood so far)

`index.js` is the entry point of the Express app.

1. **Create the app** — `express()` is called and the returned object is stored in `app`. This object represents the whole application; you use it to register routes/middleware and to start listening for requests.

2. **Connect to the database** — `connectDB()` is called. It reads `MONGO_URI` from `.env` (loaded via `node --env-file=.env`) and calls `mongoose.connect(db)`, telling the app where the (cloud) MongoDB instance lives.

   > Note: `connectDB()` is `async` but not `await`ed in `index.js`. The connection happens in the background while the rest of `index.js` (route registration, `app.listen`) keeps running synchronously. This works because the connection usually resolves before any request arrives, but there's no strict guarantee the DB is connected before the server starts listening.

3. **Health check route** — `app.get("/", ...)` registers a single top-level route (not part of any router) that responds to `GET /` — used to check whether the server is running.

4. **Mount the resource routers** — four calls to `app.use(prefix, router)`:
   ```js
   app.use("/api/users", users);
   app.use("/api/profile", profile);
   app.use("/api/auth", auth);
   app.use("/api/posts", posts);
   ```
   `app.use(path, router)` mounts an entire router (a collection of routes defined in its own file) under a path prefix. Every route defined inside that router is relative to the prefix — e.g. inside `users.js`, `router.get("/")` combined with the `/api/users` prefix becomes `GET /api/users` (not `/api/users/` — Express normalizes trailing slashes, and the router's `"/"` maps onto the prefix itself, not a sub-path appended with a slash).

   This is a form of composition: instead of one giant file with every route, each resource (`users`, `profile`, `auth`, `posts`) gets its own router file, and `index.js` just wires them together.

   `app.get(path, handler)` is different — it doesn't mount anything, it directly attaches one handler to one method + path. Rule of thumb: `app.get` is "handle this specific request"; `app.use` is "delegate all requests under this prefix to a router."

5. **Start listening** — `app.listen(PORT, ...)` starts the server listening for incoming connections on `PORT` (from `.env`, default `5670`). Everything before this line is just configuration/registration; this is what actually makes the server live.

## Current state of each router

All four routers (`routes/api/{users,profile,auth,posts}.js`) are stubs: a single `GET /` handler that responds with a plain string (e.g. `"User route"`). No real logic yet.

## Dependencies installed but not yet wired up

- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT auth
- `express-validator` — request validation
- `gravatar` — avatar URLs from email
- `mongoose` / `mongodb` — no models/schemas exist yet
- `request` — deprecated HTTP client, likely unneeded

## Likely next step

Build out the `User` model plus real registration/login logic in `auth.js` / `users.js`: hash password with bcrypt → save user → generate gravatar URL → issue JWT.
