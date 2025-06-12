import { ApiResponsePet, ApiResponsePetImage } from "@/types/type";
import { api } from "./api";
import { Pet } from "@/types/pets";

export const createPet =async (data:Partial<Pet>)=>{
    try {
    const response = await api.post("/PetsRoutes", data,);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Échec de la création du pet";
  }
}

export const getPetsForAUser = async (
): Promise<ApiResponsePet> => {
  try{
    const response = await api.get(`/PetsRoutes/user`);
    return response.data;
  }catch (error:any){
    console.log("erreur lors de la récupération des pets", error);
    throw(error.response?.data || {message: "erreur lors de la récupération des pets"});
  }
    }

export const getPetById = async (petID: string) => {
  try {
    const response = await api.get(`/PetsRoutes/${petID}`);
    return response.data;
  } catch (error: any) {
    console.log("Erreur lors de la récupération du pet:", error);
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
    console.log("Erreur lors du pet:", error);
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



export const updatePhotoprofilPet = async (id:string,image: string) => {
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

    const response = await api.patch(`/PetsRoutes/PhotoProfil/${id}`, formData, {
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
export const createPetImage = async (petId:string,image: string) => {
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

    const response = await api.post(`/PetImage/${petId}`, formData, {
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

export const deletePetImage = async (imageId:string) : Promise<ApiResponsePetImage>=> {
  try {
    const response = await api.delete(`/PetImage/${imageId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};


export const getAllImagesForaPet = async (petId:string
): Promise<ApiResponsePetImage> => {
  try{
    const response = await api.get(`/PetImage/${petId}`);
    return response.data;
  }catch (error:any){
    console.log("erreur lors de la récupération des images pet", error);
    throw(error.response?.data || {message: "erreur lors de la récupération des images pet"});
  }
    }

export const getPetImageByid = async (id: string) => {
  try {
    const response = await api.get(`/PetImage/OneImage/${id}`);
    return response.data;
  } catch (error: any) {
    console.log("Erreur lors de la récupération du petimage:", error);
    throw (
      error.response?.data || { message: "Une erreur inconnue est survenue" }
    );
  }
};