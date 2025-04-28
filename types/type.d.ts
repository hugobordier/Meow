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

export interface PetSitter {
  id: string;
  user_id: string;
  bio?: string;
  hourly_rate: number;
  experience?: number;
  availability?: AvailabilityDay[];
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export type TimeInterval = {
  start_time: string;
  end_time: string;
};

export type AvailabilityDay = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  intervals: TimeInterval[];
};
