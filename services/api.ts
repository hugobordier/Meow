import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createCache from "@/utils/cache";
import { router } from "expo-router";

const BASE_URL = "https://meowback-production.up.railway.app/";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

const cache = createCache(500, 300000);

//send the accessToken for each request except login & register
api.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (
      accessToken &&
      !config.url?.includes("/login") &&
      !config.url?.includes("/register") &&
      !config.url?.includes("/forgot-password") &&
      !config.url?.includes("/verify-reset-code") &&
      !config.url?.includes("/logout")
    ) {
      console.log("bizarre y'a plus d'access normaleùment");
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
    console.log("eroor", error);
    if (error.isCached) {
      return Promise.resolve({ data: error.data });
    }
    const originalRequest = error.config;

    // Si erreur 401 (non autorisé) et ce n'est pas déjà une requête de refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, ajoute la requête à la file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log(
          "ON VA CHERCHER UN NOUVEAU TOKEN LEZGO CA VA MARCHER SI Y'A UN REFRESH DE MOINS DE 7 JOURS"
        );
        // Appel à la route de refresh
        const response = await api.post("/authRoutes/refresh");
        const { accessToken } = response.data;

        // Sauvegarde du nouveau token
        await AsyncStorage.setItem("accessToken", accessToken);

        // Met à jour le header pour toutes les requêtes suivantes
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Met à jour le header pour la requête originale
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        // Traite les requêtes en attente
        processQueue(null, accessToken);

        isRefreshing = false;

        // Réexécute la requête originale avec le nouveau token
        return api(originalRequest);
      } catch (refreshError) {
        console.log("CA A PAS MARCHE LE USER SE RECONNECTE LE LOSER");
        // En cas d'échec du refresh, nettoie la file d'attente
        processQueue(refreshError, null);
        isRefreshing = false;

        // Supprime les tokens et redirige vers la page de login
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

    return res.data.success;
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
    return false;
  }
};
