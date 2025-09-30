import axios from "axios";
import { envVars } from "../config/env";
interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface GeoapifyGeocodeResponse {
  features: {
    properties: {
      lat: number;
      lon: number;
      formatted: string;
    };
  }[];
}

const GEOAPIFY_API_KEY = envVars.GEOAPIFY_API_KEY;

const BASE_URL = "https://api.geoapify.com/v1/geocode";

export const geocodeAddress = async (
  address: string
): Promise<Location | null> => {
  try {
    const response = await axios.get<GeoapifyGeocodeResponse>(
      `${BASE_URL}/search`,
      {
        params: {
          text: address,
          apiKey: GEOAPIFY_API_KEY,
          limit: 1,
        },
      }
    );

    const result = response.data.features[0];

    if (result) {
      return {
        latitude: result.properties.lat,
        longitude: result.properties.lon,
        address: result.properties.formatted,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Geoapify Error:", error);
    return null;
  }
};
