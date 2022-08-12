import { Router } from "express";
import auth from "../middleware/auth";
import os from "os";
import { SignIn } from "@src/controller/main/signin";
import { SignUp } from "@src/controller/main/signup";
import { Logout } from "@src/controller/main/logout";
import { ConfirmAccount } from "@src/controller/main/confirm";
import { GetTrending } from "@src/controller/main/trending";
import { GetSearch } from "@src/controller/main/search";

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
