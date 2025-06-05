import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}
export interface User {
  id: string;
  username: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  age: number;
  birthDate: string;
  city: string;
  country: string;
  gender: string;
  profilePicture: string;
  bio: string;
  bankInfo: string;
  rating: number;
  phoneNumber: string;
  address: string;
  identityDocument: string;
  insuranceCertificate: string;
  isAdmin: boolean;
  resetcode: null;
  resetcodeexpires: null;
  createdAt: string;
  updatedAt: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface CreatePetSitterInput {
  bio?: string;
  hourly_rate: number;
  experience?: number;
  availability?: AvailabilityDay[];
}

// export interface PetSitter {
//   id: string;
//   user_id: string;
//   bio?: string;
//   hourly_rate: number;
//   experience?: number;
//   availability?: AvailabilityDay[];
//   latitude: number | null;
//   longitude: number | null;
//   createdAt: string;
//   updatedAt: string;
// }

export type TimeInterval = {
  start_time: string;
  end_time: string;
};

export type AvailabilityDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type AvailabilityInterval = "Matin" | "Après-midi" | "Soir" | "Nuit";

export type ServiceType =
  | "Promenade"
  | "Alimentation"
  | "Jeux"
  | "Soins"
  | "Toilettage"
  | "Dressage"
  | "Garderie"
  | "Médication"
  | "Nettoyage"
  | "Transport";

export type AnimalType =
  | "Chat"
  | "Chien"
  | "Oiseau"
  | "Rongeur"
  | "Reptile"
  | "Poisson"
  | "Furet"
  | "Cheval"
  | "Autre";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PetSitterQueryParams {
  search?: string;
  minRate?: number;
  maxRate?: number;
  minExperience?: number;
  availability_days?: AvailabilityDay[];
  availability_intervals?: AvailabilityInterval[];
  animal_types?: AnimalType[];
  services?: ServiceType[];
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface PetSitter {
  id: string;
  user_id: string;
  bio: string | null;
  experience: number;
  hourly_rate: string;
  latitude: number;
  longitude: number;
  animal_types: string[] | null;
  available_days: AvailabilityDay[] | null;
  available_slots: AvailabilityInterval[] | null;
  services: ServiceType[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPetSitter {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  profilePicture: string;
  city: string;
  country: string;
  bankInfo: string;
  identityDocument: string;
  bio: string | null;
  birthDate: string;
  age: number;
  rating: number | null;
  gender: string | null;
  googleId: string | null;
  isAdmin: boolean | null;
  resetcode: string | null;
  resetcodeexpires: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResponsePetsitter {
  petsitter: PetSitter;
  user: UserPetSitter;
}

export interface Pagination {
  currentPage: string;
  itemsPerPage: string;
  totalItems: string;
  totalPages: string;
}

export interface ApiResponsePetsitter {
  success: boolean;
  petsitters: ResponsePetsitter[];
  message: string;
  pagination: Pagination;
}

export type PetSitterReviewResponse = {
  id: string;
  pet_sitter_id: string;
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  user_username: string;
  user_picture: string;
  pet_sitter_rating: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};
