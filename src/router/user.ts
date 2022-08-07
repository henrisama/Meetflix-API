import { Router } from "express";
import {
  AddProfiles,
  AddWatched,
  AddWish,
  DelProfiles,
  DelWatched,
  DelWish,
  GetProfiles,
  GetWatched,
  GetWatchedIds,
  GetWish,
  GetWishIds,
  UpdProfiles,
} from "../controller/user";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ mess: "" });
});

router.get("/profiles", GetProfiles);
router.post("/profiles", AddProfiles);
router.delete("/profiles", DelProfiles);
router.patch("/profiles", UpdProfiles);

router.get("/wish", GetWish);
router.post("/wish", AddWish);
router.delete("/wish", DelWish);
router.get("/wish/ids", GetWishIds);

router.get("/watched", GetWatched);
router.post("/watched", AddWatched);
router.delete("/watched", DelWatched);
router.get("/watched/ids", GetWatchedIds);

export default router;
