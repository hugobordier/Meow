import { register } from "@/services/auth.service";
import { User } from "@/types/user";
import { Link, router, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, TouchableWithoutFeedback, Keyboard, } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";

const handleSubmit = () => { };
export default function SignUpScreen() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
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

  //const checkEmailAvailability

  //const checkPhoneNumberAvailability

  //const checkUsernameAvailability

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

  const emailDomains = ['gmail.com', 'epfedu.fr', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'hotmail.fr', 'msn.com', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 'yandex.ru', 'mail.ru', 'free.fr', 'ymail.com', 'sfr.fr', 'laposte.net'];
  const suggestEmailDomains = (email: string) => {
    const [usernamePart, domainPart] = email.split('@');

    if (!domainPart) return [];

    return emailDomains
      .filter((domain) => domain.startsWith(domainPart)) //filtrage en fonction de l'input
      .map((domain) => `${usernamePart}@${domain}`); //creation des suggestions des adresses mail full
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const phoneRegex = /^0\d{9}$/;

  const validateFields = () => {
    //Erreur saisie fields
    let newErrors: { [key in keyof User]?: string } = {};
    if (!user.username.trim())
      newErrors.username = "Nom d'utilisateur requis";
    if (!user.lastName.trim())
      newErrors.lastName = "Nom de famille requis";
    if (!user.firstName.trim())
      newErrors.firstName = "Prénom requis";
    if (!user.email.trim() || !emailRegex.test(user.email))
      newErrors.email = "Email invalide";
    if (!user.password.trim()) {
      newErrors.password = "Mot de passe requis";
    } else if (!passwordRegex.test(user.password)) {
      newErrors.password = "Le mot de passe doit contenir au minimum :\n• 1 lettre minuscule\n• 1 lettre majuscule\n• 1 chiffre\n• 1 caractère spécial\n• 6 caractères minimum";
    }
    if (!user.birthDate) newErrors.birthDate = "Date de naissance requise";
    if (!user.phoneNumber.trim()) {
      newErrors.phoneNumber = "Numéro de téléphone requis";
    } else if (!phoneRegex.test(user.phoneNumber)) {
      newErrors.phoneNumber = "Numéro de téléphone invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

    //Erreur utilisateur existe ou email existe ou phone existe etc
    //let newErrors: { [key in keyof User]?: string } = {};
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      await register(user);
      router.push("../(auth)/sign-in");
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
            <Text className="text-lg font-bold mb-2">Créer un compte</Text>
            <Text className="text-sm mb-4">
              Entrez vos informations pour créer un compte
            </Text>

            <View className="w-full mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="Nom d'utilisateur"
                placeholderTextColor="gray"
                value={user.username}
                onChangeText={(value) => {
                  handleChange("username", value)
                  //checkUsernameAvailability(value);
                }}
              />

              {errors.username && (
                <Text className="text-red-500 text-center">{errors.username}</Text>
              )}
            </View>

            <View className="w-full mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="Nom de famille"
                placeholderTextColor="gray"
                value={user.lastName}
                onChangeText={(value) => handleChange("lastName", value)}
              />

              {errors.lastName && (
                <Text className="text-red-500 text-center">{errors.lastName}</Text>
              )}
            </View>

            <View className="w-full mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 w-full "
                placeholder="Prénom"
                placeholderTextColor="gray"
                value={user.firstName}
                onChangeText={(value) => handleChange("firstName", value)}
              />

              {errors.firstName && (
                <Text className="text-red-500 text-left text-center">
                  {errors.firstName}
                </Text>
              )}
            </View>

            <View className="w-full mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 w-full "
                placeholder="email@domain.com"
                placeholderTextColor="gray"
                value={user.email}
                onChangeText={(value) => {
                  handleChange("email", value);
                  setSuggestions(suggestEmailDomains(value)); //it'll generate suggestions
                  //checkEmailAvailability(value);
                }}
                onFocus={() => setSuggestions(suggestEmailDomains(user.email))}
              />
              {suggestions.length > 0 && (
                <View className="absolute top-full w-full bg-white shadow-md rounded-lg p-2 z-50">
                  {suggestions.map((suggestion, index) => (
                    <TouchableOpacity key={index} onPress={() => {
                      handleChange("email", suggestion); // Autofill email when clicked
                      setSuggestions([]);
                    }}
                      className="p-2 border-b border-gray-200">
                      <Text className="text-black text-center">{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}


              {errors.email && (
                <Text className="text-red-500 text-center">{errors.email}</Text>
              )}
            </View>

            <View className="w-full mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 w-full "
                placeholder="Mot de passe"
                placeholderTextColor="gray"
                value={user.password}
                secureTextEntry
                onChangeText={(value) => handleChange("password", value)}
              />

              {errors.password && (
                <Text className="text-red-500 text-center">{errors.password}</Text>
              )}
            </View>

            <View className="w-full mb-3">
              <TouchableOpacity
                onPress={() => setDatePickerVisibility(true)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
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
                <Text className="text-red-500 text-center">{errors.birthDate}</Text>
              )}
            </View>

            <View className="w-full mb-3">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                placeholder="Numéro de téléphone portable"
                placeholderTextColor="gray"
                value={user.phoneNumber}
                onChangeText={(value) => {
                  handleChange("phoneNumber", value)
                  //checkPhoneNumberAvailability(value);
                }}
                keyboardType="numeric"
              />

              {errors.phoneNumber && (
                <Text className="text-red-500 text-center">{errors.phoneNumber}</Text>
              )}
            </View>

            <Text className="text-gray-400 text-x1 mb-1">
              Le mot de passe doit contenir au minimum:
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">
              • 1 Lettre minuscule
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">
              • 1 Lettre majuscule
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">
              • 1 Chiffre
            </Text>
            <Text className="text-gray-400 text-x1 mb-1">
              • 1 Caractère spécial
            </Text>
            <Text className="text-gray-400 text-x1 mb-2">
              • 6 Caractères
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
    </TouchableWithoutFeedback >
  );
}
