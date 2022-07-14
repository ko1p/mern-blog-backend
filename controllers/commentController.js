import CommentModel from "../models/comment.js";

export const getPostComments = (req, res) => {
  try {
    const { postId } = req.params;
    CommentModel.find(
      {
        post: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть комментарии.",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена.",
          });
        }
        res.json(doc);
      }
    )
      .populate("user")
      .populate("post")
      .sort("createdAt");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии.",
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("user").sort('createdAt').limit(5).exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии.",
    });
  }
};

export const create = async (req, res) => {
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

export const update = async (req, res) => {
  try {
    const { commentId } = req.params;

    await CommentModel.findOneAndUpdate(commentId, {
      $set: { ["text"]: req.body.text },
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отредактировать комментарий.",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { commentId } = req.params;

    CommentModel.findByIdAndDelete(
      commentId,
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить комментарий.",
          });
        }
        if (!doc) {
          console.log(err);
          return res.status(404).json({
            message: "Комментарий не найден.",
          });
        }
        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарии.",
    });
  }
};
