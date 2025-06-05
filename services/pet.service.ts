import { ApiResponsePet, PetQueryParams,PaginationParams } from "@/types/type";
import { api } from "./api";
import { Pet } from "@/types/pets";

export const createPet =async (data:Partial<Pet>)=>{
    try {
    const response = await api.post("/PetsRoutes", {
      data,
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Échec de la création du pet";
  }
}

export const getPetSitters = async (
  filters?: PetQueryParams | null,
  pagination?: PaginationParams | null
): Promise<ApiResponsePet> => {
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

    console.log("UEY : ", queryParams.toString());

    const response = await api.get(`/PetsRoutes/user?${queryParams.toString()}`);
    console.log(response.data);
    return response.data.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ??
      "Erreur lors de la récupération des pets"
    );
  }
};