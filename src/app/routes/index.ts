import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";

export const router = Router();

const apiRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
