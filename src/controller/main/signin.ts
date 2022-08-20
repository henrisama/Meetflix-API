import { Request, Response } from "express";
import User from "@src/model/user";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const SignIn = async (request: Request, response: Response) => {
  const { email, password } = request.body as any;

  if (!email || !password) {
    response.status(400).json({
      success: false,
      message: "missing email or password value",
    });
    return;
  }

  try {
    await User.find({ email: email }).then(async (data) => {
      const user = data[0];
      if (!user) {
        response.status(400).json({
          success: false,
          message: "invalid email or password",
        });
        return;
      }

      if (await user.checkPassword(password)) {
        /* redis */
        user.cachefy();

        const token = jwt.sign(
          { data: user.toString() },
          process.env.TOKEN_SECRET as string,
          { expiresIn: 60 * 60 * 1000 }
        );

        response.setHeader("Set-Cookie", [
          cookie.serialize("jwt", token, {
            httpOnly: true,
            /* secure: true, */
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
            path: "/",
          }),
          cookie.serialize("idUser", user.id, {
            httpOnly: true,
            /* secure: true, */
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
      } else {
        response.status(400).json({
          success: false,
          message: "invalid email or password",
        });
        return;
      }
    });
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "server error",
    });
    return;
  }
};
