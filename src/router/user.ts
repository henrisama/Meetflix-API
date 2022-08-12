import { Router } from "express";
import AddProfiles from "@src/controller/user/profiles/add";
import DelProfiles from "@src/controller/user/profiles/del";
import GetProfiles from "@src/controller/user/profiles/get";
import UpdProfiles from "@src/controller/user/profiles/upd";
import AddWish from "@src/controller/user/wish/add";
import DelWish from "@src/controller/user/wish/del";
import GetWish from "@src/controller/user/wish/get";
import GetWishIds from "@src/controller/user/wish/getIds";
import GetWatched from "@src/controller/user/watched/get";
import AddWatched from "@src/controller/user/watched/add";
import DelWatched from "@src/controller/user/watched/del";
import GetWatchedIds from "@src/controller/user/watched/getIds";

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
