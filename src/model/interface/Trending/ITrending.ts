import { Document } from "mongoose";
import IContent from "../IContent";

export default interface ITrending extends Document {
  lastEdited: Date;
  trendings: Array<IContent>;
}
