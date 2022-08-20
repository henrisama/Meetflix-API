import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import mail from "../config/mail";
import IUserModel from "./interface/User/IUserModel";
import IProfile from "./interface/IProfile";
import IUser from "./interface/User/IUser";
import IUserMethods from "./interface/User/IUserMethods";
import IContent from "./interface/IContent";
import cache from "../config/redis";

const User: Schema = new Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  born: { type: String },
  profiles: [
    {
      name: { type: String, required: false },
      list: {
        wish: [{}],
        watched: [{}],
      },
    },
  ],
  verified: { type: Boolean, required: true },
  token: { type: String },
  provider: { type: String },
  providerId: { type: String },
});

User.methods.getFullName = function () {
  return this.name.first + " " + this.name.last;
};

User.methods.setPassword = async function (password: string): Promise<void> {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

User.methods.checkPassword = async function (
  password: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

User.methods.buildToken = function () {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  this.token = token;
};

User.methods.sendToken = function () {
  mail.sendMail({
    from: `"Meetflix" <${process.env.GMAIL_USER}>`,
    to: this.email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${this.name.first}</h2>
    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
    <a href=${process.env.HOST}/api/confirm/${this.token}> Click here</a>
    </div>`,
  });
};

User.methods.cachefy = function () {
  const userCache: any = {};
  userCache.id = this.id;
  userCache.email = this.email;
  userCache.name = this.name;
  userCache.born = this.born;
  userCache.profiles = this.profiles
    ? this.profiles.map((value: any) => value.name)
    : [];
  userCache.verified = this.verified;

  cache.set(`user-${this.id}`, JSON.stringify(userCache));
};

/* Profiles */
User.methods.getProfiles = function () {
  return (this.profiles as IUser["profiles"]).map(
    (value: IProfile) => value.name
  );
};

User.methods.addProfile = function (name: string) {
  try {
    if ((this.profiles as IUser["profiles"]).length === 5) return -1;

    (this.profiles as IUser["profiles"]).push({
      name: name,
      list: { wish: [], watched: [] },
    });
    return 1;
  } catch (err) {
    return 0;
  }
};

User.methods.delProfile = function (idProfile: number) {
  try {
    if (idProfile < 0 || idProfile > 4) return -1;
    if ((this.profiles as IUser["profiles"])[idProfile] === undefined)
      return -2;

    (this.profiles as IUser["profiles"]).splice(idProfile, 1);
    return 1;
  } catch (err) {
    return 0;
  }
};

User.methods.updProfile = function (idProfile: number, newName: string) {
  try {
    if (idProfile < 0 || idProfile > 4) return -1;
    if ((this.profiles as IUser["profiles"])[idProfile] === undefined)
      return -2;
    if (newName.length > 10) return -3;

    this.profiles[idProfile].name = newName;
    return 1;
  } catch (err) {
    return 0;
  }
};

/* Wish */
User.methods.getWish = function (idProfile: number) {
  if (this.profiles[idProfile] === undefined) return undefined;
  return this.profiles[idProfile].list.wish;
};

User.methods.addWish = function (idProfile: number, content: IContent) {
  try {
    const index = (this.profiles[idProfile].list.wish as Array<any>).findIndex(
      (item) => item.id === content.id
    );

    if (index >= 0) {
      return -1;
    }

    this.profiles[idProfile].list.wish.push(content);
    return 1;
  } catch (err) {
    return 0;
  }
};

User.methods.delWish = function (idProfile: number, idContent: number) {
  try {
    const index = (this.profiles[idProfile].list.wish as Array<any>).findIndex(
      (item) => item.id === idContent
    );

    if (index < 0) {
      return -1;
    }

    this.profiles[idProfile].list.wish.splice(index, 1);
    return 1;
  } catch (err) {
    return 0;
  }
};

User.methods.getWishIds = function (idProfile: number) {
  try {
    return this.profiles[idProfile].list.wish.map(
      (value: IContent) => value.id
    );
  } catch (err) {
    return 0;
  }
};

/* Watched */
User.methods.getWatched = function (idProfile: number) {
  if (this.profiles[idProfile] === undefined) return undefined;
  return this.profiles[idProfile].list.watched;
};

User.methods.addWatched = function (idProfile: number, content: IContent) {
  try {
    const index = this.profiles[idProfile].list.watched.findIndex(
      (item: IContent) => item.id === content.id
    );

    if (index >= 0) {
      return -1;
    }

    this.profiles[idProfile].list.watched.push(content);
    return 1;
  } catch (err) {
    return 0;
  }
};

User.methods.delWatched = function (idProfile: number, idContent: number) {
  try {
    const index = (
      this.profiles[idProfile].list.watched as Array<any>
    ).findIndex((item) => item.id === idContent);

    if (index < 0) {
      return -1;
    }

    this.profiles[idProfile].list.watched.splice(index, 1);
    return 1;
  } catch (err) {
    return 0;
  }
};

User.methods.getWatchedIds = function (idProfile: number) {
  try {
    return this.profiles[idProfile].list.watched.map(
      (value: IContent) => value.id
    );
  } catch (err) {
    return 0;
  }
};

/* statics */
User.statics.findOneOrCreate = function (
  condition: any,
  profile: any,
  callback: any
) {
  return new Promise(() => {
    this.findOne(condition, async (err: any, user: any) => {
      if (err) return callback(err, false);

      if (user) {
        return callback(null, user);
      } else {
        this.findOne({ email: profile._json.email }, (err: any, user: any) => {
          if (user) {
            return callback(null, false);
          } else {
            this.create(
              {
                name: {
                  first: profile.name.givenName || "User",
                  last: profile.name.familyName || "",
                },
                email: profile._json.email,
                profiles: [
                  {
                    name: profile.name.givenName || "User",
                  },
                ],
                verified: true,
                provider: profile.provider,
                providerId: profile.id,
              },
              (err: any, user: any) => {
                return callback(err, user);
              }
            );
          }
        });
      }
    });
  });
};

export default mongoose.model<IUserMethods, IUserModel>("user", User);
