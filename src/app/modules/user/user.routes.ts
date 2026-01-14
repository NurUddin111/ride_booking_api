import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  BecomeDriverZodSchemaValidation,
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
  "/signup",
  validateRequest(RegisterRequestZodSchemaValidation),
  UserControllers.createUserRequest
);

router.post(
  "/signup/verify",
  validateRequest(RegisterVerificationZodSchemaValidation),
  UserControllers.createUserVerification
);

router.post(
  "/signup/password",
  validateRequest(RegisterSuccessZodSchemaValidation),
  UserControllers.createUserSuccess
);

router.get("/all", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/driver-requests",
  checkAuth(Role.ADMIN),
  UserControllers.becomeDriverRequests
);

router.get(
  "/drivers",
  checkAuth(Role.ADMIN),
  UserControllers.getAllDrivers
);

router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);

router.patch(
  "/edit-profile/:id",
  validateRequest(UpdateUserZodSchemaValidation),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.patch(
  "/become-driver/:id",
  validateRequest(BecomeDriverZodSchemaValidation),
  checkAuth(Role.RIDER),
  UserControllers.becomeDriver
);

router.patch(
  "/approve-driver/:id",
  checkAuth(Role.ADMIN),
  UserControllers.approveDriver
);

router.patch(
  "/vehicle-location/:id",
  validateRequest(UpdateLocationZodSchemaValidation),
  checkAuth(Role.DRIVER),
  UserControllers.updateVehicleLocation
);

router.patch("/delete/:id", UserControllers.deleteUser);

export const UserRoutes = router;
