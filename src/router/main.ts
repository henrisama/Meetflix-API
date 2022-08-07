import { Router } from "express";
import auth from "../middleware/auth";
import {
  ConfirmAccount,
  GetSearch,
  GetTrending,
  Logout,
  SignIn,
  SignUp,
} from "../controller/main";
import os from "os";

const router = Router();

router.get("/test", (req, res) => {
  const payload = "this is a payload test on nodejs";
  res.status(200).send(payload.repeat(10000));
});

router.get("/test-2", (req, res) => {
  res.status(200).send("Server: " + os.hostname());
});

router.post("/signin", SignIn);
router.post("/signup", SignUp);
router.post("/logout", Logout);
router.get("/confirm/:token", ConfirmAccount);
router.get("/trending", auth, GetTrending);
router.get("/search/:search/:page", auth, GetSearch);

export default router;
