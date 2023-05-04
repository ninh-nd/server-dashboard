import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";
import redis from "./redis";

const port = process.env.PORT || 3001;
if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL must be defined");
}
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"));
redis
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err: any) => {
    console.error(err);
  });

app.listen(port);
