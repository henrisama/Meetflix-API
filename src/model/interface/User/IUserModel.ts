import { Model } from "mongoose";
import IUserMethods from "./IUserMethods";
import { Profile, VerifyCallback } from "passport-google-oauth20";

export default interface IUserModel extends Model<IUserMethods> {
  findOneOrCreate: (
    condition: any,
    profile: Profile,
    callback: VerifyCallback
  ) => Promise<any>;
}
