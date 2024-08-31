import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
//middleware
app.use(express.json());
app.use(cookieParser());

// routes import
import authRouter from "./routes/auth.route.js";

app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 5000, () => {
  connectDB();
  console.log("Server runing on port : ", process.env.PORT || 5000);
});
