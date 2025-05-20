import axios from "axios";

const OPENCAGE_API_KEY = "d8e3bf2ecc1c45f6a0056e61add9d65e";

export const searchCityByName = async (cityName: string) => {
  if (!cityName) return null;

  try {
    const res = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: OPENCAGE_API_KEY,
          q: cityName,
          limit: 1,
          language: "fr",
          pretty: 1,
        },
      }
    );

    const result = res.data.results[0];

    if (!result) return null;

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
  } catch (error) {
    console.error("Erreur recherche ville OpenCage:", error);
    return null;
  }
};
