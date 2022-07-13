import CommentModel from "../models/comment.js";



export const fetchLastComments = (req, res) => {
  try {
  } catch (err) {}
};

export const fetchAddComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.params.postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить комментарий.",
    });
  }
};

export const fetchEditComment = (req, res) => {
  try {
  } catch (err) {}
};
