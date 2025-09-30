import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideControllers } from "./ride.conroller";

const router = Router();

router.post(
  "/ride-request",
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

router.post(
  "/update-ride/:id",
  checkAuth(Role.DRIVER),
  RideControllers.updateRideRequest
);

export const RideRoutes = router;
