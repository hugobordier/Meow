import { Alert } from "react-native";
import { api } from "./api";
import { User } from "@/types/type";

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
