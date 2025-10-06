"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.Role = exports.VehicleType = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["CAR"] = "CAR";
    VehicleType["BIKE"] = "BIKE";
    VehicleType["CNG"] = "CNG";
    VehicleType["MICROBUS"] = "MICROBUS";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var VehicleModel;
(function (VehicleModel) {
    VehicleModel["BAJAJ"] = "BAJAJ";
    VehicleModel["HONDA"] = "HONDA";
})(VehicleModel || (VehicleModel = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
