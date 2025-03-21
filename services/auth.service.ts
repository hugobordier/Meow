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
      city: user.city,
      country: user.country,
      gender: user.gender,
      profilePicture: user.profilePicture,
      bio: user.bio,
      bankInfo: user.bankInfo,
      rating: user.rating,
      phoneNumber: user.phoneNumber,
      address: user.address,
      identityDocument: user.identityDocument,
      insuranceCertificate: user.insuranceCertificate,
      isAdmin: user.isAdmin,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    //@ts-ignore
    throw error.response.data.error || "Echec de la connexion";
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
    throw error.response?.data?.error || "Échec de la connexion";
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data } = await api.post("/authRoutes/forgot-password", { email });
  } catch (error: any) {
    throw error?.response?.data.error || "Le code n'a pas pu etre envoyé";
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
