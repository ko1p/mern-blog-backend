import express from "express";
import fs from "fs";
import fileUpload from "express-fileupload";
import { v4 } from "uuid";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import { storage } from "./firebase/storage.js";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  CommentController,
  PostController,
  UserController,
} from "./controllers/contollers.js";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
  commentCreateValidation,
} from "./validations/validations.js";

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


const upload = multer({ storage });
app.use(fileUpload({}));
app.use(express.json());
app.use(cors());

app.get("/auth/me", checkAuth, UserController.getMe);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.post("/upload", checkAuth, async (req, res) => {
  const file = req.files.image;
  const storageRef = ref(storage, `uploads/${v4() + "_" + file.name}`);
  await uploadBytes(storageRef, file.data);

  getDownloadURL(storageRef)
    .then((url) => {
      return res.json({
        url,
      });
    })
    .catch((error) => {
      return res.json({
        mesage: error,
      });
    });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get("/tags", PostController.getLastTags);
app.get("/tags/:tag", PostController.getAllByTag);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.get("/comments/:postId", CommentController.getPostComments);
app.get("/comments", CommentController.getLastComments);
app.post(
  "/comments/:postId",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create
);
app.patch(
  "/comments/:commentId",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.update
);
app.delete("/comments/:commentId", checkAuth, CommentController.remove);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is running.");
});
