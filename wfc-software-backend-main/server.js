import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import router from "./routers/routers.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use("/uploads", express.static("uploads"));
app.use("/api/v1",router)
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
}); 