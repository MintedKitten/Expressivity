import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { getDirPath } from "./config/getDirPath";
import { DBURI } from "./config";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";

import indexRouter from "./routes/index";
import usersRouter from "./routes/user";
import locationRouter from "./routes/location";
import categoryRouter from "./routes/category";
import productRouter from "./routes/product";

mongoose.pluralize(null);
mongoose.connect(`${DBURI}`);

const app = express();

app.use(logger("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(getDirPath({ foldername: "public" })));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/location", locationRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);

app.use(errorHandler);

export default app;
