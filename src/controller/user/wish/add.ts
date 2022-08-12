import { Request, Response } from "express";
import User from "@src//model/user";

const AddWish = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;
  const { content } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  if (
    !content ||
    !content.id ||
    !content.title ||
    !content.original_language ||
    !content.original_title ||
    !content.overview ||
    !content.poster_path ||
    !content.media_type ||
    !content.genre_ids ||
    !content.release_date ||
    !content.vote_average
  ) {
    response.status(400).json({
      success: false,
      message: "missing some content value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.addWish(Number.parseInt(idProfile), content);

        if (result === 1) {
          user.save();

          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "content already added",
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "content not added to wish list",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export default AddWish;
