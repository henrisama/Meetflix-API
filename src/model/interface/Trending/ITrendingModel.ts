import { Model } from "mongoose";
import IContent from "../IContent";
import ITrendingMethods from "./ITrendingMethods";

export default interface ITrendingModel extends Model<ITrendingMethods> {
  bar: () => void;
  extractTrendings: (result: any) => Promise<Array<IContent>>;
}
