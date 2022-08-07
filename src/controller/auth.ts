import { Request, Response } from "express";
import passport from "passport";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export const Failure = (request: Request, response: Response) => {
  response.status(400).json({
    success: false,
    message: "error when logging in",
  });
};

/* Google */
export const GoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const GoogleAuthenticate = passport.authenticate("google", {
  failureRedirect: "/api/auth/failure",
});

export const GoogleHandleSuccess = (request: Request, response: Response) => {
  const user = (request.session as any).passport.user;

  /* redis */
  // do

  const token = jwt.sign(
    { data: JSON.stringify(user) },
    process.env.TOKEN_SECRET as string,
    { expiresIn: 60 * 60 * 1000 }
  );

  response.setHeader("Set-Cookie", [
    cookie.serialize("jwt", token, {
      httpOnly: true,
      /* secure: process.env.NODE_ENV !== "development", */
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    }),
    cookie.serialize("idUser", user._id, {
      httpOnly: true,
      /* secure: process.env.NODE_ENV !== "development", */
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    }),
  ]);

  response.status(200).json({
    success: true,
    message: "successfully logged in",
  });
  return;
};

/* Facebook */
export const FacebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
});

export const FacebookAuthenticate = passport.authenticate("facebook", {
  failureRedirect: "/api/auth/failure",
});

export const FacebookHandleSuccess = (request: Request, response: Response) => {
  const user = (request.session as any).passport.user;

  /* redis */
  // do

  const token = jwt.sign(
    { data: JSON.stringify(user) },
    process.env.TOKEN_SECRET as string,
    { expiresIn: 60 * 60 * 1000 }
  );

  response.setHeader("Set-Cookie", [
    cookie.serialize("jwt", token, {
      httpOnly: true,
      /* secure: process.env.NODE_ENV !== "development", */
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    }),
    cookie.serialize("idUser", user._id, {
      httpOnly: true,
      /* secure: process.env.NODE_ENV !== "development", */
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
      path: "/",
    }),
  ]);

  response.status(200).json({
    success: true,
    message: "successfully logged in",
  });
  return;
};
