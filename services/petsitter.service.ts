import {
  ApiResponsePetsitter,
  PaginationParams,
  PetSitterQueryParams,
  ResponsePetsitter,
} from "@/types/type";
import { api } from "./api";

export const createPetSitter = async (hourly_rate: number) => {
  try {
    const response = await api.post("/PetSitter", {
      hourly_rate,
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Échec de la création du petsitter";
  }
};

export const getPetSitters = async (
  filters?: PetSitterQueryParams | null,
  pagination?: PaginationParams | null
): Promise<ApiResponsePetsitter> => {
  try {
    const queryParams = new URLSearchParams();
    const combinedParams = { ...filters, ...pagination };

    Object.entries(combinedParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => queryParams.append(key, String(val)));
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    console.log(queryParams.toString());

    const response = await api.get(`/Petsitter?${queryParams.toString()}`);
    console.log(response.data);
    return response.data.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ??
      "Erreur lors de la récupération des pet sitters"
    );
  }
};
