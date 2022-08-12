import { Request, Response } from "express";
import Trending from "@src/model/trending";
import axios from "axios";

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
