import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createCache from "@/utils/cache";

const BASE_URL = "https://meowback-production.up.railway.app/";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const cache = createCache(500, 300000);

//send the accessToken for each request except login & register
api.interceptors.request.use(
  (config) => {
    const accessToken = AsyncStorage.getItem("accessToken");

    if (
      accessToken &&
      !config.url?.includes("/login") &&
      !config.url?.includes("/register") &&
      !config.url?.includes("/forgot-password") &&
      !config.url?.includes("/verify-reset-code")
    ) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const paramsString = config.params
      ? new URLSearchParams(config.params).toString()
      : "";
    const bodyString = config.data ? JSON.stringify(config.data) : "";
    const cacheKey = `${config.url}?${paramsString}&body=${bodyString}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("cache hit : ", cachedData);
      return Promise.reject({ isCached: true, data: cachedData });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const cacheKey = `${response.config.url}?${new URLSearchParams(
      response.config.params
    ).toString()}`;
    cache.set(cacheKey, response.data); // Stocke les données dans le cache
    return response;
  },
  (error) => {
    if (error.isCached) {
      return Promise.resolve({ data: error.data });
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, mdp: string) => {
  try {
    const response = await api.post("/login", {
      email: email,
      mdp: mdp,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    //@ts-ignore
    throw error.response.data.error;
  }
};
