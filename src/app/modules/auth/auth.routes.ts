import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);

router.get("/google", AuthControllers.googleLogin);
router.get("/google/callback", AuthControllers.googleCallback);

router.post(
  "/refresh-token",
  checkAuth(...Object.values(Role)),
  AuthControllers.getNewAccessToken
);

router.post(
  "/logout",
  checkAuth(...Object.values(Role)),
  AuthControllers.logout
);

router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);

router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);

router.post("/forgot-password", AuthControllers.forgotPassword);

router.post(
  "/reset-password/:id",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;
