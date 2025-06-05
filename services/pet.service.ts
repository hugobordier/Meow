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

export const getPetsForAUser = async (
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

export const getPetById = async (petID: string) => {
  try {
    const response = await api.get(`/PetsRoutes/${petID}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du pet:", error);
    throw (
      error.response?.data || { message: "Une erreur inconnue est survenue" }
    );
  }
};


const forbiddenFields = [
  "photo_url",
];

export const updatePet = async (userID:string,data: Partial<Pet>) => {
  try {
    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      if (!forbiddenFields.includes(key)) {
        (acc as any)[key] = (data as any)[key];
      }
      return acc;
    }, {} as Partial<Pet>);
    console.log("Sanitized data:", sanitizedData);

    const response = await api.patch(`/PetsRoutes/${userID}`, sanitizedData);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors du pet:", error);
    throw (
      error.response?.data || { message: "Une erreur inconnue est survenue" }
    );
  }
};



export const deletePet = async (petID:string) => {
  try {
    const response = await api.delete(`/PetsRoutes/pets/${petID}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};



export const createPhotoprofilPet = async (id:string,image: string) => {
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

    const response = await api.post(`/PetsRoutes/PhotoProfil/${id}`, formData, {
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

export const deletePhotoprofilPet = async (id:string) => {
  try {
    const response = await api.delete(`/PetsRoutes/PhotoProfil/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};
export const createPetImage = async (imageId:string,image: string) => {
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

    const response = await api.post(`/PetImage/${imageId}`, formData, {
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

export const deletePetImage = async (imageId:string) => {
  try {
    const response = await api.delete(`/PetImage/${imageId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};