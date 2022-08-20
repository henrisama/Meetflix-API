import { Request, Response } from "express";
import User from "@src/model/user";

const DelWatched = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;
  const { idContent } = request.body;

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

  if (idContent === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idContent value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.delWatched(
          Number.parseInt(idProfile),
          Number.parseInt(idContent)
        );

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
            message: "content not found",
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "content not deleted to wish list",
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

export default DelWatched;
