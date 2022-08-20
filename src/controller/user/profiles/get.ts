import { Request, Response } from "express";
import Cache from "@src/config/redis";
import User from "@src/model/user";

const GetProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  const user = await Cache.get("user-" + idUser);
  if (user) {
    const profiles = JSON.parse(user).profiles;
    if (profiles) {
      response.status(200).json({
        success: true,
        message: profiles,
      });
      return;
    }
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const profiles = user.getProfiles();
        response.status(200).json({
          success: true,
          message: profiles,
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

export default GetProfiles;
