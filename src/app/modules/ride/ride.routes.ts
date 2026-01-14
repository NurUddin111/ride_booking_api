import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideControllers } from "./ride.conroller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema, updateRideZodSchema } from "./ride.validation";

const router = Router();

router.post(
  "/ride-request",
  validateRequest(createRideZodSchema),
  checkAuth(...Object.values(Role)),
  RideControllers.createRideRequest
);

router.get(
  "/pending-ride-requests",
  checkAuth(Role.DRIVER, Role.ADMIN),
  RideControllers.getPendingRideRequests
);

router.get(
  "/all-rides",
  checkAuth(Role.ADMIN),
  RideControllers.getAllRidesData
);

router.get(
  "/my-rides",
  checkAuth(...Object.values(Role)),
  RideControllers.getMyRidesData
);

router.get(
  "/driver-status",
  checkAuth(Role.DRIVER),
  RideControllers.getDriverStatus
);

router.get(
  "/active",
  checkAuth(...Object.values(Role)),
  RideControllers.getActiveRide
);

router.get("/:id", checkAuth(Role.ADMIN), RideControllers.getSingleRideData);

router.post(
  "/accept-ride/:id",
  checkAuth(Role.DRIVER),
  RideControllers.acceptRideRequest
);

router.post(
  "/cancel-ride/:id",
  checkAuth(...Object.values(Role)),
  RideControllers.cancleRideRequest
);

router.put(
  "/update-ride/:id",
  validateRequest(updateRideZodSchema),
  checkAuth(Role.DRIVER),
  RideControllers.updateRideRequest
);

router.get(
  "/view-earnings/:id",
  checkAuth(Role.DRIVER),
  RideControllers.viewEarnings
);

export const RideRoutes = router;
