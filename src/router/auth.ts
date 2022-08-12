import { Router } from "express";
import { Failure } from "@src/controller/auth/failure";
import {
  GoogleAuth,
  GoogleAuthenticate,
  GoogleHandleSuccess,
} from "@src/controller/auth/google";
import {
  FacebookAuth,
  FacebookAuthenticate,
  FacebookHandleSuccess,
} from "@src/controller/auth/facebook";

const router = Router();

/* google */
router.get("/google", GoogleAuth);
router.get("/google/callback", GoogleAuthenticate, GoogleHandleSuccess);

router.get("/facebook", FacebookAuth);
router.get("/facebook/callback", FacebookAuthenticate, FacebookHandleSuccess);

/* Failure */
router.get("/failure", Failure);

export default router;
