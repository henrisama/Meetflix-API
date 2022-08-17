import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  let token;

  if (request.cookies && request.cookies.jwt) {
    token = request.cookies.jwt;
  }

  if (!token) {
    response.status(401).json({
      success: false,
      message: "unauthenticated user",
    });
    return;
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (error) {
    const message = (error as JsonWebTokenError).message;

    if (message) {
      response.status(401).json({
        success: false,
        message: message,
      });
      return;
    }

    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export default auth;
