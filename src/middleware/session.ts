import session from "express-session";

export default session({
  resave: false,
  saveUninitialized: true,
  secret: "cats",
  cookie: {
    secure: true,
    httpOnly: true,
  },
});
