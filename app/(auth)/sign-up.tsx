import { register } from "@/services/auth.service";
import { User } from "@/types/user";
import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons';

const handleSubmit = () => {

}
export default function SignUpScreen() {

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
    if (name === "age") {
      // S'assurer que l'age est un nombre valide, sinon rester à 0
      const parsedAge = parseInt(value, 10);
      setUser((prevState) => ({
        ...prevState,
        [name]: isNaN(parsedAge) ? 0 : parsedAge,  // Si la saisie n'est pas valide, on laisse l'âge à 0
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleDateConfirm = (date: Date) => {
    setUser((prevState) => ({
      ...prevState,
      birthDate: date.toISOString().split("T")[0], // Formater la date au format YYYY-MM-DD
    }));
    setDatePickerVisibility(false);
  };

  const handleSubmit = async () => {
    try {
      await register(user);
      // Optionnellement, tu peux rediriger l'utilisateur ou afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
      // Optionnellement, tu peux gérer les erreurs ici, comme afficher un message d'erreur.
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className='flex-1 bg-white'>
        <ScrollView className='p-4'>
          <View className='flex-1 items-center justify-center bg-white p-4'>
            <Text className='text-4xl font-bold mb-2'>MEOW</Text>
            <Text className='text-x1 font-bold mb-2'>Créer un compte</Text>
            <Text className='text-x1 mb-8'>Entrez vos informations pour créer un compte</Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Nom d'utilisateur"
              placeholderTextColor="gray"
              value={user.username}
              onChangeText={(value) => handleChange("username", value)}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Nom de famille"
              placeholderTextColor="gray"
              value={user.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Prénom"
              placeholderTextColor="gray"
              value={user.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="email@domain.com"
              placeholderTextColor="gray"
              value={user.email}
              onChangeText={(value) => handleChange("email", value)}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Mot de passe"
              placeholderTextColor="gray"
              value={user.password}
              onChangeText={(value) => handleChange("password", value)}
            />

            {/*Modifier la logique pour age (calcul auto) */}
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Age"
              placeholderTextColor="gray"
              value={user.age.toString()}
              onChangeText={(value) => handleChange("age", value)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => setDatePickerVisibility(true)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            >
              <Text className="text-gray-500">{user.birthDate || "Sélectionner la date de naissance"}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisibility(false)}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Numéro de téléphone portable"
              placeholderTextColor="gray"
              value={user.phoneNumber}
              onChangeText={(value) => handleChange("phoneNumber", value)}
              keyboardType="numeric"
            />

            <Text className='text-gray-400 text-x1 mb-1'>Le mot de passe doit contenir au minimum:</Text>
            <Text className='text-gray-400 text-x1 mb-1'>• Lettre minuscule</Text>
            <Text className='text-gray-400 text-x1 mb-1'>• Lettre majuscule</Text>
            <Text className='text-gray-400 text-x1 mb-1'>• Chiffre</Text>
            <Text className='text-gray-400 text-x1 mb-2'>• Caractère spécial</Text>

            <TouchableOpacity className='bg-black px-6 py-3 rounded-lg mb-1 w-full'
              onPress={handleSubmit}>
              <Link href="/sign-up" className='text-white text-center'>Continuer</Link>

            </TouchableOpacity>

            <View className='flex-row items-center my-2 w-3/4'>
              <View className='flex-1 h-[1px] bg-gray-300' />
              <Text className='mx-2 text-gray-500'>ou</Text>
              <View className='flex-1 h-[1px] bg-gray-300' />
            </View>

            <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg mb-1 w-full flex-row items-center justify-center '>
              <AntDesign name="google" size={16} color="black" />
              <Link href="/sign-in" className='text-black text-center ml-2'>Continuer avec Google</Link>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
