import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.route.js";
import DBConnection from "./lib/db.js";
import cookieParser from "cookie-parser"

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);


app.listen(process.env.PORT, () => {
  console.log("app is running");
  DBConnection();
});
