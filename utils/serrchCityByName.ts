import axios from "axios";

const OPENCAGE_API_KEY = "d8e3bf2ecc1c45f6a0056e61add9d65e";

export type CityResult = {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string;
  formattedAddress: string;
};

export const searchCityByName = async (
  cityName: string
): Promise<CityResult[]> => {
  if (!cityName) return [];

  try {
    const res = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: OPENCAGE_API_KEY,
          q: cityName,
          limit: 8,
          language: "fr",
          pretty: 1,
          countrycode: "fr",
        },
      }
    );

    const results = res.data.results;

    if (!results || results.length === 0) return [];

    return results.map((result: any): CityResult => {
      const {
        geometry: { lat, lng },
        components,
        formatted,
      } = result;

      return {
        latitude: lat,
        longitude: lng,
        city: components.city || components.town || components.village || null,
        country: components.country,
        formattedAddress: formatted,
      };
    });
  } catch (error) {
    console.error("Erreur recherche ville OpenCage:", error);
    return [];
  }
};
