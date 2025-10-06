"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const ride_routes_1 = require("../modules/ride/ride.routes");
exports.router = (0, express_1.Router)();
const apiRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/ride",
        route: ride_routes_1.RideRoutes,
    },
];
apiRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
