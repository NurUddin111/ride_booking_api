"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.Role = exports.VehicleBrands = exports.VehicleType = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["BIKE"] = "BIKE";
    VehicleType["CNG"] = "CNG";
    VehicleType["CAR"] = "CAR";
    VehicleType["MICROBUS"] = "MICROBUS";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var VehicleBrands;
(function (VehicleBrands) {
    VehicleBrands["BAJAJ"] = "BAJAJ";
    VehicleBrands["HERO"] = "HERO";
    VehicleBrands["TVS"] = "TVS";
    VehicleBrands["SUZUKI"] = "SUZUKI";
    VehicleBrands["YAMAHA"] = "YAMAHA";
    VehicleBrands["PULSAR"] = "PULSAR";
    VehicleBrands["ROYAL_ENFIELD"] = "ROYAL_ENFIELD";
    VehicleBrands["KTM"] = "KTM";
    VehicleBrands["FZ"] = "FZ";
    VehicleBrands["TOYOTA"] = "TOYOTA";
    VehicleBrands["HYUNDAI"] = "HYUNDAI";
    VehicleBrands["BMW"] = "BMW";
    VehicleBrands["OMODA"] = "OMODA";
    VehicleBrands["MERCEDES_BENZ"] = "MERCEDES_BENZ";
    VehicleBrands["PIAGGIO"] = "PIAGGIO";
    VehicleBrands["MAHINDRA"] = "MAHINDRA";
    VehicleBrands["RUNNE"] = "RUNNE";
    VehicleBrands["NISSAN"] = "NISSAN";
    VehicleBrands["MITSUBISHI"] = "MITSUBISHI";
    VehicleBrands["MAZDA"] = "MAZDA";
})(VehicleBrands || (exports.VehicleBrands = VehicleBrands = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
