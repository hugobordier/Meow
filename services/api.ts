import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://meowback-production.up.railway.app/";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

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
      console.log("y'a bine le access");
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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


