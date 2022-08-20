import express from "express";
import logger from "morgan"; // HTTP request logger middleware for node.js
import cookieParser from "cookie-parser"; // Parse HTTP request cookies.
import cors from "./middleware/cors";
import helmet from "./middleware/helmet";
import limiter from "./middleware/limiter";
import compression from "./middleware/compress";
import auth from "./middleware/auth";
import session from "./middleware/session";
import passport from "passport";
import "./config/mongo";
import "./config/passport";

/* import routes */
import userRoute from "./router/user";
import mainRoute from "./router/main";
import authRoute from "./router/auth";

const app = express();

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

/* middlewares */
app.use(cors);
app.use(helmet);
app.use(limiter);
app.use(compression);
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* routes */
app.use("/api", mainRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", auth, userRoute);

export default app;
