import { Request, Response } from "express";
import User from "@src/model/user";

const UpdProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;
  const { idProfile, name } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined || !name) {
    response.status(400).json({
      success: false,
      message: "missing idProfile or name value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.updProfile(Number.parseInt(idProfile), name);

        if (result === 1) {
          user.save();

          /* redis */
          user.cachefy();

          response.status(200).json({
            success: true,
            message: "profile updated successfully",
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "idProfile does not match expected",
          });
          return;
        } else if (result === -2) {
          response.status(400).json({
            success: false,
            message: "profile not found",
          });
          return;
        } else if (result === -3) {
          response.status(400).json({
            success: false,
            message: "profile name too long",
          });
          return;
        }

        response.status(500).json({
          success: false,
          message: "profile was not updated",
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

export default UpdProfiles;
