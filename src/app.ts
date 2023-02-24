console.log(getDirPath({ foldername: "test" }));
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { getDirPath } from "./config/getDirPath";
import { DBURI } from "./config";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";

mongoose.pluralize(null);
mongoose.connect(`${DBURI}`);
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import companiesRouter from "./routes/company";
import staffRouter from "./routes/staff";
import shopRouter from "./routes/shops";

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(getDirPath({ foldername: "public" })));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/company", companiesRouter);
app.use("/staff", staffRouter);
app.use("/shop", shopRouter);

app.use(errorHandler);

export default app;
