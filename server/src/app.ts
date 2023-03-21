// importing modules
import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import mongoose from "mongoose";
import passport from "passport";
//importing routes
import usersRouter from "./routers/users.js";
import tasksRouter from "./routers/tasks.js";

import * as dotenv from "dotenv";

//importing made modules
import config from "./config/config.js";
import logging from "./library/Logging.js";
dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(passport.initialize());

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

const dburl = config.localdb;
const connect = mongoose.connect(dburl);
connect.then(() => {
  logging.info("connected correctly to database : " + dburl);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
