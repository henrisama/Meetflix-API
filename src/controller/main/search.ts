import { Request, Response } from "express";
import axios from "axios";

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
