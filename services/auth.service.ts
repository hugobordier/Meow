import { User } from "@/types/user";
import { api } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register = async (user: User) => {
  try {
    const response = await api.post("/authRoutes/register", {
      username: user.username,
      email: user.email,
      password: user.password,
      lastName: user.lastName,
      firstName: user.firstName,
      age: user.age,
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber,
    });
    return response.data;
  } catch (error: any) {
    //@ts-ignore
    throw error.response.data.message || "Echec de la connexion";
  }
};

export const login = async (form: { email: string; password: string }) => {
  try {
    const { data } = await api.post("authRoutes/login", form, {
      headers: { "Content-Type": "application/json" },
    });
    if (data.accessToken) {
      await AsyncStorage.setItem("accessToken", data.accessToken);
    }
    const userData = await api.get("/authRoutes/me");
    return userData.data;
  } catch (error: any) {
    throw error.response.data || "Échec de la connexion";
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data } = await api.post("/authRoutes/forgot-password", { email });
  } catch (error: any) {
    throw error || "Le code n'a pas pu etre envoyé";
  }
};

export const verifyResetCode = async (
  email: string,
  resetCode: string,
  password: string
) => {
  try {
    const { data } = await api.post("authRoutes/verify-reset-code", {
      email: email.toLowerCase(),
      code: resetCode,
      password,
    });
  } catch (error: any) {
    throw error?.response?.data.error || "Le code n'a pas pu etre envoyé";
  }
};
