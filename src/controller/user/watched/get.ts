import { Request, Response } from "express";
import User from "@src/model/user";

const GetWatched = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;

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

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.getWatched(Number.parseInt(idProfile));

        if (result) {
          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "wish list not found",
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

export default GetWatched;
