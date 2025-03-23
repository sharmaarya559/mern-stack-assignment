import express from "express";
import "dotenv/config";
import connectDB from "../connection/db.js";
import userRouter from "./routers/user.router.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
const db_url = process.env.DB_URI;

app.use(cors());
app.use(express.json());
connectDB(db_url);
app.use("/api", userRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "This is blogs api",
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
