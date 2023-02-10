import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
try {
  app.use(express.static(path.join(path.dirname(import.meta.url), "public"))); //esm
} catch (e) {
  app.use(express.static(path.join(__dirname, "public"))); //cjs
}

app.use("/", indexRouter);
app.use("/users", usersRouter);

export default app;
