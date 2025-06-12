import { api } from "./api";
import { User } from "@/types/type";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getAllUsers = async () => {
  try {
    const response = await api.get("/User");
    return response.data.data;
  } catch (error: any) {
    console.error("err recup users", error);
    throw error.response?.data || { message: "erreur recup uses" };
  }
};

export const updateProfilePicture = async (image: string) => {
  try {
    const formData = new FormData();
    const filename = image.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: image,
      name: filename,
      type,
    } as any);

    const response = await api.patch("/User/profilePicture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'upload:", error);
    throw error;
  }
};

export const deleteProfilePicture = async () => {
  try {
    const response = await api.delete("/User/profilePicture");
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'upload:", error);
    throw error;
  }
};

export const updateDocId = async (image: string) => {
  try {
    const formData = new FormData();
    const filename = image.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: image,
      name: filename,
      type,
    } as any);

    const response = await api.patch("/User/identityDoc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    console.error("Erreur lors de l'upload:", error.data);
    throw error.response.data;
  }
};

const forbiddenFields = [
  "identityDocument",
  "profilePicture",
  "password",
  "isAdmin",
  "createdAt",
  "updatedAt",
];

export const updateUser = async (data: Partial<User>) => {
  try {
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      if (!forbiddenFields.includes(key)) {
        (acc as any)[key] = (data as any)[key];
      }
      return acc;
    }, {} as Partial<User>);

    if (sanitizedData.age && sanitizedData.age < 18) {
      throw new Error("L'utilisateur doit avoir au moins 18 ans.");
    }
    console.log("Sanitized data:", sanitizedData);

    const response = await api.patch("/User/update", sanitizedData);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw (
      error.response?.data || { message: "Une erreur inconnue est survenue" }
    );
  }
};

export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/User/${userId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw (
      error.response?.data || { message: "Une erreur inconnue est survenue" }
    );
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    throw error;
  }
};
