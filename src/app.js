import cookieParser from "cookie-parser";
import express from "express";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import authRouter from "./routes/authRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import recordRouter from "./routes/recordRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { globalErrorHandler } from "./utils/apiError.js";

const app = express();

app.use(express.json());
app.use(cookieParser());


// public routes
app.use("/api/auth", rateLimiter({ type: "ip" }), authRouter)

// private routes
app.use("/api/users", authMiddleware, rateLimiter({ type: "user" }), userRouter)
app.use("/api/records", authMiddleware, rateLimiter({ type: "user" }), recordRouter)
app.use("/api/dashboard", authMiddleware, rateLimiter({ type: "user" }), dashboardRouter)

app.use(globalErrorHandler) // must be at the end

export default app