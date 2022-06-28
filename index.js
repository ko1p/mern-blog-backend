import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { PostController, UserController } from "./controllers/contollers.js";

import { loginValidation, postCreateValidation, registerValidation } from "./validations/validations.js";

import { checkAuth, handleValidationErrors } from "./utils/utils.js";

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

const storage = multer.diskStorage({
  destination: (_, __, cb)  => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb)  => {
    cb(null, file.originalname);
  }
})

const upload =  multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);

app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running.");
});