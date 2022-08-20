import { Request, Response } from "express";
import User from "@src/model/user";

const AddProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;
  const { name } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (!name) {
    response.status(400).json({
      success: false,
      message: "missing name value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.addProfile(name);

        if (result === 1) {
          user.save();

          /* redis */
          user.cachefy();

          response.status(200).json({
            success: true,
            message: "profile created successfully",
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "limit of only 5 profiles",
          });
          return;
        }

        response.status(500).json({
          success: false,
          message: "error, profile was not created",
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

export default AddProfiles;
