import passport from "passport";
import oauth2 from "passport-google-oauth20";
import facebook from "passport-facebook";
import User from "../model/user";

const GoogleStrategy = oauth2.Strategy;
const FacebookStrategy = facebook.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      await User.findOneOrCreate(
        { providerId: profile.id },
        profile,
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/api/auth/facebook/callback",
      profileFields: ["id", "email", "name", "verified"],
    },
    async function (accessToken, refreshToken, profile, done) {
      await User.findOneOrCreate(
        { providerId: profile.id },
        profile as any,
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
