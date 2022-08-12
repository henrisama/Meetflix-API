import { Request, Response } from "express";
import cookie from "cookie";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "@src/model/user";

export const GoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const GoogleAuthenticate = passport.authenticate("google", {
  failureRedirect: "/api/auth/failure",
});

export const GoogleHandleSuccess = (request: Request, response: Response) => {
  const user = (request.session as any).passport.user;

  /* redis */
  User.findById({ _id: user.id }).then(function (user) {
    user?.cachefy();
  });

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
