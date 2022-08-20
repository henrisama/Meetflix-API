import { Response } from "express";

export const Failure = (_: any, response: Response) => {
  response.status(400).json({
    success: false,
    message: "error when logging in",
  });
};
