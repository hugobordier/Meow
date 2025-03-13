import { Link } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";

export default function SignUpScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-white p-4'>
      <Text className='text-4xl font-bold mb-2'>MEOW</Text>
      <Text className='text-x1 font-bold mb-2'>Créer un compte</Text>
      <Text className='text-x1 mb-8'>Entrez vos informations pour créer un compte</Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
        placeholder="Nom d'utilisateur"
        placeholderTextColor="gray"
      />




      <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg mb-4 w-3/4'>
        <Link href="/sign-up" className='text-black text-center'>Créer un compte</Link>
      </TouchableOpacity>


      <View className='flex-row items-center my-2 w-3/4'>
        <View className='flex-1 h-[1px] bg-gray-300' />
        <Text className='mx-2 text-gray-500'>ou</Text>
        <View className='flex-1 h-[1px] bg-gray-300' />
      </View>

      <TouchableOpacity className='bg-gray-200 px-6 py-3 rounded-lg w-3/4'>
        <Link href="/sign-in" className='text-black text-center'>Se connecter</Link>
      </TouchableOpacity>
    </View>
  )
}
