import IContent from "../IContent";
import IUser from "./IUser";

export default interface IUserMethods extends IUser {
  getFullName: () => string;

  /* Password */
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;

  /* Verify Token */
  buildToken: () => void;
  sendToken: () => void;

  /* redis */
  cachefy: () => void;

  /* Profiles */
  getProfiles: () => Array<string>;
  addProfile: (name: string) => number;
  delProfile: (idx: number) => number;
  updProfile: (idx: number, name: string) => number;

  /* Wish */
  getWish: (idProfile: number) => IUser["profiles"];
  addWish: (idProfile: number, content: IContent) => number;
  delWish: (idProfile: number, idContent: number) => number;
  getWishIds: (idProfile: number) => Array<number>;

  /* Watched */
  getWatched: (idProfile: number) => IUser["profiles"];
  addWatched: (idProfile: number, content: IContent) => number;
  delWatched: (idProfile: number, idContent: number) => number;
  getWatchedIds: (idProfile: number) => Array<number>;
}
