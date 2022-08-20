import { Request, Response } from "express";
import cookie from "cookie";

export const Logout = (request: Request, response: Response) => {
  try {
    request.logout(() => {});
    request.session.destroy(() => {});

    response.setHeader("Set-Cookie", [
      cookie.serialize("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: -1,
        sameSite: "strict",
        path: "/",
      }),
      cookie.serialize("idUser", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: -1,
        sameSite: "strict",
        path: "/",
      }),
      cookie.serialize("idProfile", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: -1,
        sameSite: "strict",
        path: "/",
      }),
    ]);

    response.status(200).json({
      success: true,
      message: "successfully logout",
    });
    return;
  } catch (err) {
    response.status(500).json({
      success: false,
      message: "server error",
    });
    return;
  }
};
