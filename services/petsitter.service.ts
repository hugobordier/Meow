import {
  ApiResponsePetsitter,
  PaginationParams,
  PetSitter,
  PetSitterQueryParams,
  ResponsePetsitter,
  User,
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


export const updatePetsitter = async (petsitterData: any) => {
  try {
    // Assuming 'api' already includes the Authorization header from context
    // If not, you might need to pass the token explicitly and set it in headers here.
    console.log("Updating petsitter with data:", petsitterData);
    const response = await api.patch("/Petsitter/{id}", petsitterData); // Or PUT, depending on your API
    console.log("Petsitter update response:", response.data);
    return response.data.data; // Assuming your API returns data in respon/se.data.data
  } catch (error: any) {
    console.error("Error updating petsitter profile:", error.response?.data || error.message);
    throw (
      error.response?.data?.message || "Échec de la mise à jour du profil petsitter"
    );

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

export const getPetSittersWithPagination = async (
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

    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ??
      "Erreur lors de la récupération des pet sitters"
    );
  }
};
