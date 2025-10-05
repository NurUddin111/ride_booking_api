import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  RegisterRequestZodSchemaValidation,
  RegisterSuccessZodSchemaValidation,
  RegisterVerificationZodSchemaValidation,
  UpdateLocationZodSchemaValidation,
  UpdateUserZodSchemaValidation,
} from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register-request",
  validateRequest(RegisterRequestZodSchemaValidation),
  UserControllers.createUserRequest
);

router.post(
  "/register-verification",
  validateRequest(RegisterVerificationZodSchemaValidation),
  UserControllers.createUserVerification
);

router.post(
  "/register-success",
  validateRequest(RegisterSuccessZodSchemaValidation),
  UserControllers.createUserSuccess
);

router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);

router.patch(
  "/:id",
  validateRequest(UpdateUserZodSchemaValidation),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.patch(
  "/vehicle-location/:id",
  validateRequest(UpdateLocationZodSchemaValidation),
  checkAuth(Role.DRIVER),
  UserControllers.updateVehicleLocation
);

router.patch("/delete/:id", UserControllers.deleteUser);

export const UserRoutes = router;
