import { Request, Response } from "express";
import User from "@src/model/user";

export const ConfirmAccount = (request: Request, response: Response) => {
  const { token } = request.params;

  if (!token) {
    response.status(400).json({
      success: false,
      message: "missing token value",
    });
    return;
  }

  try {
    User.find({ token: token }).then((data) => {
      const user = data[0];
      if (!user) {
        response.status(400).json({
          success: false,
          message: "user not found",
        });
        return;
      }

      user.verified = true;
      user.save();

      response.status(200).json({
        success: true,
        message: "email successfully validated",
      });
      return;
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "server error",
    });
    return;
  }
};
