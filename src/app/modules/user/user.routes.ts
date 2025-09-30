import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  CreateUserZodValidation,
  UpdateUserZodValidation,
} from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post("/register-request", UserControllers.createUserRequest);
router.post("/register-verification", UserControllers.createUserVerification);
router.post(
  "/register-success",
  validateRequest(CreateUserZodValidation),
  UserControllers.createUserSuccess
);

router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);
router.patch(
  "/vehicle-location/:id",
  checkAuth(Role.DRIVER),
  UserControllers.updateVehicleLocation
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(UpdateUserZodValidation),
  UserControllers.updateUser
);
router.patch("/delete/:id", UserControllers.deleteUser);

export const UserRoutes = router;
