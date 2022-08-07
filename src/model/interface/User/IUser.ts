import { Document } from "mongoose";
import IProfile from "../IProfile";

export default interface IUser extends Document {
  name: {
    first: string;
    last: string;
  };
  email: string;
  password: string;
  born: string;
  profiles: Array<IProfile>;
  verified: boolean;
  token: string;
}
