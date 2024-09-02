import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/error";
import routes from "./routes";
// import morgan from "morgan";

const app: Application = express();

dotenv.config();
app.use(
  cors({
    origin: "*",
  })
);
// app.use(morgan("dev"));

// Connect to Database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send({ success: true }));
app.use("/api/v1/", routes);

// Middleware for Errors
app.use(errorMiddleware);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default app;
