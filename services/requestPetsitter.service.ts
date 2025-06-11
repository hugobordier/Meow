import { api } from "./api";

export interface PetsittingRequest {
  petsitter_id: string;
  message: string;
}

export interface PetsittingRequestResponse {
  id: string;
  user_id: string;
  petsitter_id: string;
  statusdemande: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePetsittingRequestInput {}

export const createPetsittingRequest = async (
  data: CreatePetsittingRequestInput
) => {
  try {
    const response = await api.post("/Amis", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Échec de la création de la demande";
  }
};

export const getAllPetsittingRequests = async () => {
  try {
    const response = await api.get("/Amis");
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la récupération des demandes"
    );
  }
};

export const getPetsittingRequestById = async (id: Date) => {
  try {
    const response = await api.get(`/Amis/ById/${id}`);
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la récupération de la demande"
    );
  }
};

export const getUserPetsittingRequests = async (): Promise<
  PetsittingRequestResponse[]
> => {
  try {
    const response = await api.get("/Amis/user");
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la récupération des demandes utilisateur"
    );
  }
};

export const getPetsitterReceivedRequests = async (): Promise<
  PetsittingRequestResponse[]
> => {
  try {
    const response = await api.get("/Amis/petsitter");
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la récupération des demandes reçues"
    );
  }
};

export const respondToPetsittingRequest = async (
  iddemandeur: string,
  data: any
) => {
  try {
    const response = await api.patch(
      `/Amis/ReponseDemande/${iddemandeur}`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message || "Erreur lors de la réponse à la demande"
    );
  }
};

export const updatePetsittingRequest = async (
  id: string,
  data: Partial<PetsittingRequest>
) => {
  try {
    const response = await api.patch(`/Amis/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la modification de la demande"
    );
  }
};

export const deletePetsittingRequest = async (id: string) => {
  try {
    const response = await api.delete(`/Amis/${id}`);
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la suppression de la demande"
    );
  }
};
