import {
  GoogleAuth,
  Failure,
  GoogleAuthenticate,
  GoogleHandleSuccess,
  FacebookAuth,
  FacebookAuthenticate,
  FacebookHandleSuccess,
} from "../controller/auth";
import { Router } from "express";

const router = Router();

/* google */
router.get("/google", GoogleAuth);
router.get("/google/callback", GoogleAuthenticate, GoogleHandleSuccess);

router.get("/facebook", FacebookAuth);
router.get("/facebook/callback", FacebookAuthenticate, FacebookHandleSuccess);

/* Failure */
router.get("/failure", Failure);

export default router;
