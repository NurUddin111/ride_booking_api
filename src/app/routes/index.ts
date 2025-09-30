import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { RideRoutes } from "../modules/ride/ride.routes";

export const router = Router();

const apiRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/ride",
    route: RideRoutes,
  },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
