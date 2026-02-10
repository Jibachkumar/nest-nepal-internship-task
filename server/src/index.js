import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port localhost:${process.env.PORT}`);
      console.log(`swagger at port localhost:${process.env.PORT}/api-docs`)
    });
  })
  .catch((error) => {
    console.log(`mongoDB connection failed !!!, ${error}`);
  });