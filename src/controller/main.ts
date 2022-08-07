import { Request, Response } from "express";
import User from "../model/user";
import Trending from "../model/trending";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import axios from "axios";

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
          message: "user does not exist",
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
            /* secure: process.env.NODE_ENV !== "development", */
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
            path: "/",
          }),
          cookie.serialize("idUser", user.id, {
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
      } else {
        response.status(200).json({
          success: false,
          message: "passwords do not match",
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

export const SignUp = async (request: Request, response: Response) => {
  const { firstName, lastName, born, email, password } = request.body as any;

  if (!firstName || !lastName || !born || !email || !password) {
    response.status(400);
    response.json({
      success: false,
      message: "missing first name, last name, born, email or password value",
    });
    return;
  }

  try {
    await User.find({ email: email }).then(async (data) => {
      const user = data[0];
      if (user) {
        response.status(409).json({
          success: false,
          message: "user already exist",
        });
        return;
      }

      const newUser = new User({
        name: {
          first: firstName,
          last: lastName,
        },
        email: email,
        born: born,
        password: password,
        profiles: [
          {
            name: firstName,
          },
        ],
        verified: false,
      });

      /* send token confirmation */
      newUser.buildToken();
      newUser.sendToken();

      await newUser.setPassword(password);
      newUser.save();

      response.status(201).json({
        success: true,
        message: "successfully created",
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

export const GetTrending = async (request: Request, response: Response) => {
  try {
    const lastCommited = await Trending.findOne().sort({ _id: -1 }).limit(1);

    if (!lastCommited) {
      const rows = await Trending.count();

      if (rows) {
        response.status(500).json({
          success: false,
          message: "error getting trendings",
        });
        return;
      }

      const trending = new Trending();
      const url =
        "https://api.themoviedb.org/3/trending/all/day?api_key=" +
        process.env.TMDB_API +
        "&page=";
      for (let index = 1; index <= 10; index++) {
        const trendings: Array<any> = await axios
          .get(url + index, { timeout: 2000 })
          .then((res: any) => res.data.results);

        const extractedTrendings = await Trending.extractTrendings(trendings);
        trending.trendings.push(...extractedTrendings);
      }
      trending.save();
      response.status(200).json({
        success: true,
        message: trending.trendings,
      });
      return;
    }

    const date1 = lastCommited.lastEdited.getTime();
    const date2 = Date.now();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
      const trending = new Trending();
      const url =
        "https://api.themoviedb.org/3/trending/all/day?api_key=" +
        process.env.TMDB_API +
        "&page=";
      for (let index = 1; index <= 10; index++) {
        const trendings: Array<any> = await axios
          .get(url + index, { timeout: 2000 })
          .then((res: any) => res.data.results);

        const extractedTrendings = await Trending.extractTrendings(trendings);
        trending.trendings.push(...extractedTrendings);
      }
      trending.save();
      response.status(200).json({
        success: true,
        message: trending.trendings,
      });
      return;
    }

    response.status(200).json({
      success: true,
      message: lastCommited.trendings,
    });
    return;
  } catch (err) {
    console.log(err);
    response.status(500).json({
      success: false,
      message: "server error",
    });
    return;
  }
};

export const GetSearch = async (request: Request, response: Response) => {
  const { search, page } = request.params;

  if (!search || !page) {
    response.status(400).json({
      success: false,
      message: "search not provided",
    });
    return;
  }

  try {
    const url =
      "https://api.themoviedb.org/3/search/multi?api_key=" +
      process.env.TMDB_API +
      "&query=" +
      search +
      "&include_adult=false" +
      "&page=" +
      page;

    const searchResult: Array<any> = await axios
      .get(url, { timeout: 2000 })
      .then((res: any) => res.data.results);

    const finalResult = searchResult.map((value: any) => {
      if (value.media_type != "person") {
        return value;
      }
    });

    response.status(200).json({
      success: true,
      message: finalResult,
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
