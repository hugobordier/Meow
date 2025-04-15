import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createCache from "@/utils/cache";
import { router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

const BASE_URL = "https://meowback-production.up.railway.app/";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const cache = createCache(500, 300000);

api.interceptors.request.use(
  async (config) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return Promise.reject({
        response: {
          data: { message: "Pas de connexion Internet" },
        },
      });
    }

    const accessToken = await AsyncStorage.getItem("accessToken");
    if (
      accessToken &&
      !config.url?.includes("/login") &&
      !config.url?.includes("/register") &&
      !config.url?.includes("/forgot-password") &&
      !config.url?.includes("/verify-reset-code") &&
      !config.url?.includes("/logout") &&
      !config.url?.includes("/refresh")
    ) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      console.log(accessToken);
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

let isRefreshing = false;
let failedQueue: any[] = [];

// Fonction pour traiter les requêtes en attente
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    const cacheKey = `${response.config.url}?${new URLSearchParams(
      response.config.params
    ).toString()}`;
    cache.set(cacheKey, response.data); // Stocke les données dans le cache
    return response;
  },
  async (error) => {
    if (error.isCached) {
      return Promise.resolve({ data: error.data });
    }
    const originalRequest = error.config;

    // Si erreur 401 (non autorisé) et ce n'est pas déjà une requête de refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.message === "No refresh token found"
    ) {
      if (isRefreshing) {
        console.log("isRefreshing");
        // Si une requête de rafraîchissement est déjà en cours, on attend qu'elle se termine
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log(
              "token qui a ete ajouté avec les ancienne requete",
              token
            );
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            console.log("erreur dans le refresh", err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("on appelle la route pour rafraichir avec levieux token");
        const response = await api.post("/authRoutes/refresh");
        const { accessToken } = response.data;
        console.log("le nouveau token est : ", accessToken);

        await AsyncStorage.setItem("accessToken", accessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        await AsyncStorage.removeItem("accessToken");

        router.replace("/(auth)/sign-in");

        return Promise.reject(refreshError);
      }
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

export const logout = async () => {
  try {
    console.log("logout");
    await AsyncStorage.removeItem("accessToken");

    const res = await api.post("/authRoutes/logout");

    cache.clear();

    router.replace("/(auth)/homePage");

    return res.data.success;
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
    return false;
  }
};
