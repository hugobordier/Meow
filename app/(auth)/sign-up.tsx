import { register } from "@/services/auth.service";
import { User } from "@/types/user";
import { Link, router, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";

const handleSubmit = () => {};
export default function SignUpScreen() {
  const [errors, setErrors] = useState<{ [key in keyof User]?: string }>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [user, setUser] = useState<User>({
    username: "",
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    age: 0,
    birthDate: "",
    phoneNumber: "",
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleChange = (name: keyof User, value: string) => {
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    //validateFields();
  };

  const handleDateConfirm = (date: Date) => {
    const currentDate = new Date();
    const birthDate = new Date(date);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--; // Si la date d'anniversaire n'est pas encore passée cette année
    }
    setUser((prevState) => ({
      ...prevState,
      birthDate: date.toISOString().split("T")[0],
      age,
    }));
    setDatePickerVisibility(false);
  };

  const validateFields = () => {
    let newErrors: { [key in keyof User]?: string } = {};
    if (!user.username.trim()) newErrors.username = "Nom d'utilisateur requis";
    if (!user.lastName.trim()) newErrors.lastName = "Nom de famille requis";
    if (!user.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!user.email.trim() || !user.email.includes("@"))
      newErrors.email = "Email invalide";
    if (!user.password.trim() || user.password.length < 6)
      newErrors.password = "Mot de passe trop court";
    if (user.age && isNaN(Number(user.age))) newErrors.age = "Âge invalide";
    if (!user.birthDate) newErrors.birthDate = "Date de naissance requise";
    if (!user.phoneNumber.trim())
      newErrors.phoneNumber = "Numéro de téléphone requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await register(user);
      router.push("../(home)/home");
    } catch (error) {
      setSubmitError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="p-4">
          <View className="flex-1 items-center justify-center bg-white p-4">
            <Text className="text-4xl font-bold mb-2">MEOW</Text>
            <Text className="text-x1 font-bold mb-2">Créer un compte</Text>
            <Text className="text-x1 mb-8">
              Entrez vos informations pour créer un compte
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Nom d'utilisateur"
              placeholderTextColor="gray"
              value={user.username}
              onChangeText={(value) => handleChange("username", value)}
            />

            {errors.username && (
              <Text className="text-red-500 ">{errors.username}</Text>
            )}

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Nom de famille"
              placeholderTextColor="gray"
              value={user.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
            />

            {errors.lastName && (
              <Text className="text-red-500">{errors.lastName}</Text>
            )}

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Prénom"
              placeholderTextColor="gray"
              value={user.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
            />

            {errors.firstName && (
              <Text className="text-red-500 text-sm text-left">
                {errors.firstName}
              </Text>
            )}

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="email@domain.com"
              placeholderTextColor="gray"
              value={user.email}
              onChangeText={(value) => handleChange("email", value)}
            />

            {errors.email && (
              <Text className="text-red-500">{errors.email}</Text>
            )}

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Mot de passe"
              placeholderTextColor="gray"
              value={user.password}
              secureTextEntry
              onChangeText={(value) => handleChange("password", value)}
            />

            {errors.password && (
              <Text className="text-red-500">{errors.password}</Text>
            )}

            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            >
              <Text className="text-gray-500">
                {user.birthDate || "Sélectionner la date de naissance"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisibility(false)}
            />

            {errors.birthDate && (
              <Text className="text-red-500">{errors.birthDate}</Text>
            )}
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Numéro de téléphone portable"
              placeholderTextColor="gray"
              value={user.phoneNumber}
              onChangeText={(value) => handleChange("phoneNumber", value)}
              keyboardType="numeric"
            />

            {errors.phoneNumber && (
              <Text className="text-red-500">{errors.phoneNumber}</Text>
            )}

            <Text className="text-gray-400 text-x1 mb-1">
              Le mot de passe doit contenir au minimum:
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">
              • Lettre minuscule
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">
              • Lettre majuscule
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">• Chiffre</Text>
            <Text className="text-gray-400 text-x1 mb-2">
              • Caractère spécial
            </Text>

            <TouchableOpacity
              className="bg-black px-6 py-3 rounded-lg mb-1 w-full"
              onPress={handleSubmit}
            >
              <Link href="/sign-up" className="text-white text-center">
                Continuer
              </Link>
            </TouchableOpacity>

            <View className="flex-row items-center my-2 w-3/4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-2 text-gray-500">ou</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <TouchableOpacity className="bg-gray-200 px-6 py-3 rounded-lg mb-1 w-full flex-row items-center justify-center ">
              <AntDesign name="google" size={16} color="black" />
              <Link href="/sign-in" className="text-black text-center ml-2">
                Continuer avec Google
              </Link>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
