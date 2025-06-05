import { api } from "@/services/api";
import { PaginationParams, PetSitterReviewResponse } from "@/types/type";

export const getReviewsByPetSitterId = async (
  petSitterId: string,
  pagination?: PaginationParams | null
): Promise<{ reviews: PetSitterReviewResponse[]; total: number }> => {
  try {
    let url = `/petSitterReview/petsitter/${petSitterId}`;

    if (pagination) {
      const queryParams = new URLSearchParams();

      if (pagination.page) {
        queryParams.append("page", pagination.page.toString());
      }
      if (pagination.limit) {
        queryParams.append("limit", pagination.limit.toString());
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    console.log("pet sitter reviex url :", url);

    const response = await api.get(url);
    console.log("data ? : ", response.data);
    console.log("reviews ? : ", response.data.data.reviews);

    return {
      reviews: response.data.data.reviews,
      total: response.data.data.totalItems,
    };
  } catch (error) {
    console.error("Error fetching pet sitter reviews:", error);
    return { reviews: [], total: 0 };
  }
};

export const postReviewForPetSitter = async (
  pet_sitter_id: string,
  message: string
): Promise<any> => {
  try {
    const response = await api.post(`/petSitterReview`, {
      pet_sitter_id,
      message,
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la review :", error);
    throw new Error("Échec de la création de l'avis");
  }
};

export const postRatingForPetSitter = async (
  pet_sitter_id: string,
  rating: number
): Promise<any> => {
  try {
    const response = await api.post(`/petSitterRating`, {
      pet_sitter_id,
      rating,
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la review :", error);
    throw new Error("Échec de la création de l'avis");
  }
};
