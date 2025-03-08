import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}
interface User {
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
