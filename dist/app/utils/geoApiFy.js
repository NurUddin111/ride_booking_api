"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const GEOAPIFY_API_KEY = env_1.envVars.GEOAPIFY_API_KEY;
const BASE_URL = "https://api.geoapify.com/v1/geocode";
const geocodeAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/search`, {
            params: {
                text: address,
                apiKey: GEOAPIFY_API_KEY,
                limit: 1,
            },
        });
        const result = response.data.features[0];
        if (result) {
            return {
                latitude: result.properties.lat,
                longitude: result.properties.lon,
                address: result.properties.formatted,
            };
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error("Geoapify Error:", error);
        return null;
    }
});
exports.geocodeAddress = geocodeAddress;
