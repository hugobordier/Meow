import { User } from "@/types/user";
import { api } from "./api";
import { Alert } from "react-native";
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
    throw error.response.data.error;
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
    throw error.response?.data?.message || "Échec de la connexion";
  }
};
