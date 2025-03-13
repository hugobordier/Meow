import { Link } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";

export default function SignUpScreen() {
  return (
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
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Nom de famille"
            placeholderTextColor="gray"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Prénom"
            placeholderTextColor="gray"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="email@domain.com"
            placeholderTextColor="gray"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Mot de passe"
            placeholderTextColor="gray"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Age"
            placeholderTextColor="gray"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Date de naissance"
            placeholderTextColor="gray"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            placeholder="Numéro de téléphone portable"
            placeholderTextColor="gray"
          />

          <Text className='text-gray-400 text-x1 mb-1'>Le mot de passe doit contenir au minimum:</Text>
          <Text className='text-gray-400 text-x1 mb-1'>• Lettre minuscule</Text>
          <Text className='text-gray-400 text-x1 mb-1'>• Lettre majuscule</Text>
          <Text className='text-gray-400 text-x1 mb-1'>• Chiffre</Text>
          <Text className='text-gray-400 text-x1 mb-2'>• Caractère spécial</Text>

          <TouchableOpacity className='bg-black px-6 py-3 rounded-lg mb-1 w-full'>
            <Link href="/sign-up" className='text-white text-center'>Continuer</Link>
          </TouchableOpacity>

          <View className='flex-row items-center my-2 w-3/4'>
            <View className='flex-1 h-[1px] bg-gray-300' />
            <Text className='mx-2 text-gray-500'>ou</Text>
            <View className='flex-1 h-[1px] bg-gray-300' />
          </View>

          <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg mb-1 w-full'>
            <Link href="/sign-in" className='text-black text-center'>Continuer avec Google</Link>
          </TouchableOpacity>

          <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg w-full'>
            <Link href="/sign-in" className='text-black text-center'>Continuer avec Apple</Link>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
