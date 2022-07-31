import express from "express";
import fs from 'fs';
import cors from 'cors';
import mongoose from "mongoose";
import multer from "multer";

import { CommentController, PostController, UserController } from "./controllers/contollers.js";

import { loginValidation, postCreateValidation, registerValidation, commentCreateValidation } from "./validations/validations.js";

import { checkAuth, handleValidationErrors } from "./utils/utils.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connected.");
  })
  .catch((err) => {
    console.log("DB error: ", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb)  => {
    if(!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');    
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb)  => {
    cb(null, file.originalname);
  }
})

const upload =  multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

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
app.get("/tags", PostController.getLastTags);
app.get("/tags/:tag", PostController.getAllByTag);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.get("/comments/:postId", CommentController.getPostComments);
app.get("/comments", CommentController.getLastComments);
app.post("/comments/:postId", checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.patch("/comments/:commentId", checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update);
app.delete("/comments/:commentId", checkAuth, CommentController.remove);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running.");
});