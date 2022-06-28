import express from "express";
import mongoose from "mongoose";

import { login, register, getMe } from "./controllers/userController.js";
import { registerValidation } from "./validations/validations.js";

import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://qBBma6VU2r9Ztf0y:Wz45AhfercA8Kw0T@cluster0.32wundr.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connected.");
  })
  .catch((err) => {
    console.log("DB error: ", err);
  });

const app = express();
app.use(express.json());

app.post("/auth/login", login);
app.post("/auth/register", registerValidation, register);
app.get("/auth/me", checkAuth, getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running.");
});