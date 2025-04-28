import { api } from "./api";

export const createPetSitter = async (hourly_rate: number) => {
  try {
    const response = await api.post("/PetSitter", {
      hourly_rate,
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log("lalalallalal", error.response.data.message);
    throw error.response?.data?.message || "Échec de la création du petsitter";
  }
};
