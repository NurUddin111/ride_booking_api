import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  CreateUserZodValidation,
  UpdateUserZodValidation,
} from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(CreateUserZodValidation),
  UserControllers.createUser
);

router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getSingleUser);
router.patch(
  "/:id",
  validateRequest(UpdateUserZodValidation),
  UserControllers.updateUser
);
router.patch("/delete/:id", UserControllers.deleteUser);

export const UserRoutes = router;
