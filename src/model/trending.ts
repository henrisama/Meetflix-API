import mongoose, { Schema } from "mongoose";
import IContent from "./interface/IContent";
import ITrendingMethods from "./interface/Trending/ITrendingMethods";
import ITrendingModel from "./interface/Trending/ITrendingModel";

const Trending: Schema = new Schema({
  lastEdited: { type: Date, default: Date.now() },
  trendings: { type: Array<IContent> },
});

Trending.statics.extractTrendings = (result: any) => {
  return new Promise((resolve, reject) => {
    try {
      const extractedResult: Array<IContent> = [];

      for (const item of result) {
        if (item.media_type === "movie" || item.media_type === "tv") {
          extractedResult.push({
            id: item.id,
            title: item.title || item.name,
            original_language: item.original_language,
            original_title: item.original_title || item.original_name,
            overview: item.overview,
            poster_path: item.poster_path,
            media_type: item.media_type,
            genre_ids: item.genre_ids,
            release_date: item.release_date || item.first_air_date,
            vote_average: item.vote_average,
          });
        }
      }

      resolve(extractedResult);
    } catch (err) {
      reject(err);
    }
  });
};

export default mongoose.model<ITrendingMethods, ITrendingModel>(
  "trending",
  Trending
);
